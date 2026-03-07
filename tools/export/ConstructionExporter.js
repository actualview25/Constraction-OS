// =======================================
// ACTUAL CONSTRUCTION OS - CONSTRUCTION EXPORTER
// =======================================

export class ConstructionExporter {
    constructor(app) {
        this.app = app;
        this.zip = new JSZip();
        this.format = 'actual-view'; // actual-view, ifc, obj
    }

    // تصدير المشروع كاملاً
    async export(projectName, format = 'actual-view') {
        this.format = format;
        console.log(`📦 بدء تصدير المشروع: ${projectName} (${format})`);
        
        const folder = this.zip.folder(projectName);
        
        // تصدير حسب الصيغة
        switch (format) {
            case 'actual-view':
                await this.exportForActualView(folder);
                break;
            case 'ifc':
                await this.exportAsIFC(folder);
                break;
            case 'obj':
                await this.exportAsOBJ(folder);
                break;
            default:
                throw new Error('صيغة غير معروفة');
        }

        // إنشاء ملف ZIP
        const content = await this.zip.generateAsync({ type: 'blob' });
        saveAs(content, `${projectName}.zip`);
        
        console.log(`✅ تم تصدير المشروع بنجاح: ${projectName}.zip`);
    }

    // تصدير لـ ACTUAL VIEW STUDIO
    async exportForActualView(folder) {
        // إنشاء manifest
        const manifest = this.createManifest();
        folder.file('manifest.json', JSON.stringify(manifest, null, 2));
        
        // تصدير المشاهد
        await this.exportScenes(folder);
        
        // تصدير الكيانات العالمية
        const globalData = this.exportGlobalEntities();
        folder.file('global-entities.json', JSON.stringify(globalData, null, 2));
        
        // تصدير الإحداثيات
        const geoData = this.exportGeoReferencing();
        folder.file('georeferencing.json', JSON.stringify(geoData, null, 2));
        
        // إنشاء نقاط انتقال تلقائية
        const hotspots = this.generateHotspots();
        folder.file('hotspots.json', JSON.stringify(hotspots, null, 2));
        
        console.log(`📋 تم إنشاء manifest مع ${manifest.scenes.length} مشهد`);
    }

    // إنشاء manifest
    createManifest() {
        const scenes = this.app.sceneManager?.scenes || [];
        
        return {
            project: {
                name: this.app.projectManager?.currentProject?.name || 'مشروع جديد',
                date: new Date().toISOString(),
                version: '2.0',
                scenesCount: scenes.length
            },
            scenes: scenes.map((scene, index) => ({
                id: scene.id,
                index: index,
                name: scene.name,
                image: `scenes/scene-${index}.jpg`,
                data: `scenes/scene-${index}.json`,
                hotspotsCount: scene.hotspots?.length || 0,
                hasPaths: (scene.paths?.length > 0),
                hasMeasurements: (scene.measurements?.length > 0),
                realWorldPosition: this.getScenePosition(scene.id)
            })),
            georeferencing: {
                enabled: this.app.geoRef?.gcp?.length > 0,
                coordinateSystem: this.app.geoRef?.coordinateSystem,
                datum: this.app.geoRef?.datum
            }
        };
    }

    // الحصول على موقع المشهد في العالم الحقيقي
    getScenePosition(sceneId) {
        if (!this.app.sceneConnector) return null;
        
        const position = this.app.sceneConnector.getScenePosition(sceneId);
        if (!position) return null;
        
        return {
            x: position.x,
            y: position.y,
            z: position.z,
            latitude: position.latitude,
            longitude: position.longitude
        };
    }

    // تصدير المشاهد
    async exportScenes(folder) {
        const scenes = this.app.sceneManager?.scenes || [];
        const imagesFolder = folder.folder('images');
        const scenesFolder = folder.folder('scenes');
        
        for (let i = 0; i < scenes.length; i++) {
            const scene = scenes[i];
            
            // تصدير الصورة
            if (scene.originalImage) {
                const imageData = scene.originalImage.split(',')[1];
                if (imageData) {
                    imagesFolder.file(`scene-${i}.jpg`, imageData, { base64: true });
                }
            }
            
            // تصدير بيانات المشهد
            const sceneData = this.prepareSceneData(scene, i);
            scenesFolder.file(`scene-${i}.json`, JSON.stringify(sceneData, null, 2));
        }
    }

    // تجهيز بيانات مشهد واحد
    prepareSceneData(scene, index) {
        return {
            id: scene.id,
            index: index,
            name: scene.name,
            image: `images/scene-${index}.jpg`,
            realWorldPosition: this.getScenePosition(scene.id),
            paths: (scene.paths || []).map(p => ({
                type: p.type || 'unknown',
                color: p.color || '#ffaa44',
                points: (p.points || []).map(pt => ({
                    x: pt.x || 0,
                    y: pt.y || 0,
                    z: pt.z || 0
                }))
            })),
            hotspots: (scene.hotspots || []).map(h => ({
                id: h.id,
                type: h.type,
                position: h.position,
                data: h.data || {}
            })),
            measurements: (scene.measurements || []).map(m => ({
                length: m.length,
                height: m.height,
                start: m.start,
                end: m.end
            })),
            globalEntities: this.getSceneGlobalEntities(scene.id)
        };
    }

    // الحصول على الكيانات العالمية في المشهد
    getSceneGlobalEntities(sceneId) {
        if (!this.app.sceneConnector) return [];
        
        const entityIds = this.app.sceneConnector.getGlobalEntitiesInScene(sceneId);
        
        return entityIds.map(id => {
            const entity = this.app.globalSystem?.getCompleteEntity(id);
            if (!entity) return null;
            
            return {
                id: entity.id,
                type: entity.type,
                segment: entity.segments?.get(sceneId)
            };
        }).filter(e => e !== null);
    }

    // تصدير الكيانات العالمية
    exportGlobalEntities() {
        if (!this.app.globalSystem) return { entities: [] };
        
        const exportData = this.app.globalSystem.exportEntities();
        
        // إضافة معلومات الإحداثيات
        exportData.entities.forEach(entity => {
            entity.geoReferenced = this.app.geoRef?.gcp?.length > 0;
        });
        
        return exportData;
    }

    // تصدير معلومات الإحداثيات
    exportGeoReferencing() {
        if (!this.app.geoRef) return null;
        
        return this.app.geoRef.exportForViewer();
    }

    // إنشاء نقاط انتقال تلقائية
    generateHotspots() {
        if (!this.app.sceneConnector) return [];
        
        const hotspots = this.app.sceneConnector.createAutomaticHotspots(15);
        
        // توزيع النقاط على المشاهد
        const sceneHotspots = {};
        
        hotspots.forEach(hotspot => {
            const targetId = hotspot.data.targetSceneId;
            
            if (!sceneHotspots[targetId]) {
                sceneHotspots[targetId] = [];
            }
            
            sceneHotspots[targetId].push(hotspot);
        });
        
        return sceneHotspots;
    }

    // تصدير بصيغة IFC (للتكامل مع برامج BIM)
    async exportAsIFC(folder) {
        // إنشاء ملف IFC أساسي
        let ifcContent = this.generateIFCHeader();
        
        // إضافة الكيانات
        ifcContent += this.generateIFCEntities();
        
        folder.file('model.ifc', ifcContent);
        console.log('🏗️ تم تصدير نموذج IFC');
    }

    generateIFCHeader() {
        const date = new Date();
        const timeStamp = Math.floor(date.getTime() / 1000);
        
        return `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ViewDefinition [DesignTransferView]'),'2;1');
FILE_NAME('model.ifc','${date.toISOString()}',('User'),('Company'),' ',' ','Unknown');
FILE_SCHEMA(('IFC4'));
ENDSEC;
DATA;
`;
    }

    generateIFCEntities() {
        let entities = '';
        
        // إضافة الكيانات من النظام العالمي
        if (this.app.globalSystem) {
            this.app.globalSystem.entities.forEach(entity => {
                entities += this.entityToIFC(entity);
            });
        }
        
        entities += 'ENDSEC;\nEND-ISO-10303-21;';
        return entities;
    }

    entityToIFC(entity) {
        // تحويل كيان إلى IFC - دالة مبسطة
        return `#${entity.id}=IFCBUILDINGELEMENTPROXY('${entity.id}',#1,'${entity.type}','',$,#100,$,$);\n`;
    }

    // تصدير بصيغة OBJ (للنمذجة ثلاثية الأبعاد)
    async exportAsOBJ(folder) {
        let objContent = '# ACTUAL CONSTRUCTION OS Export\n';
        let mtlContent = this.generateMTL();
        
        // إضافة الكيانات
        objContent += this.generateOBJEntities();
        
        folder.file('model.obj', objContent);
        folder.file('model.mtl', mtlContent);
        
        console.log('📐 تم تصدير نموذج OBJ');
    }

    generateMTL() {
        return `# Material Library
newmtl default
Ka 0.2 0.2 0.2
Kd 0.8 0.8 0.8
Ks 0.5 0.5 0.5
Ns 10

newmtl concrete
Ka 0.2 0.2 0.2
Kd 0.5 0.5 0.5
Ks 0.3 0.3 0.3
Ns 5

newmtl steel
Ka 0.1 0.1 0.1
Kd 0.6 0.6 0.6
Ks 0.8 0.8 0.8
Ns 50
`;
    }

    generateOBJEntities() {
        let obj = '';
        let vertexIndex = 1;
        
        if (this.app.globalSystem) {
            this.app.globalSystem.entities.forEach(entity => {
                obj += this.entityToOBJ(entity, vertexIndex);
                vertexIndex += 1000; // تباعد بسيط
            });
        }
        
        return obj;
    }

    entityToOBJ(entity, startIndex) {
        // دالة مبسطة لتحويل كيان إلى OBJ
        return `# ${entity.type} - ${entity.id}\n`;
    }

    // تصدير تقرير الكميات
    exportBOQ() {
        if (!this.app.globalBOQ) return null;
        
        const boq = this.app.globalBOQ.calculateAll();
        const report = this.app.globalReporter?.generateFullReport();
        
        return {
            summary: boq.grandTotals,
            details: boq,
            report: report
        };
    }

    // الحصول على إحصائيات التصدير
    getExportStats() {
        return {
            scenes: this.app.sceneManager?.scenes?.length || 0,
            globalEntities: this.app.globalSystem?.entities?.size || 0,
            georeferenced: this.app.geoRef?.gcp?.length > 0,
            totalStationPoints: this.app.calibrationWizard?.totalStationData?.length || 0,
            gpsPoints: this.app.calibrationWizard?.gpsData?.length || 0
        };
    }
}
