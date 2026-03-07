// =======================================
// ACTUAL CONSTRUCTION OS - REALITY BRIDGE
// =======================================
// الجسر بين العالمين: التصميم والعرض
// Single Source of Truth للكيانات العالمية

export class RealityBridge {
    constructor(globalSystem, sceneConnector) {
        this.globalSystem = globalSystem;     // مصدر الحقيقة للكيانات
        this.sceneConnector = sceneConnector; // ربط المشاهد
        
        this.sceneAnchors = new Map();        // مرتكزات المشاهد
        this.entityMarkers = new Map();       // علامات الكيانات
        this.sceneLinks = [];                  // روابط المشاهد
        
        this.syncManager = new SyncManager(this);
        
        console.log('🌉 RealityBridge جاهز - مصدر الحقيقة الموحد');
    }

    // ربط كيان عالمي بمشهد
    anchorGlobalEntity(entityId, sceneId, localPosition) {
        const entity = this.globalSystem.getCompleteEntity(entityId);
        if (!entity) {
            console.error('❌ كيان غير موجود:', entityId);
            return null;
        }

        // إنشاء مرتكز للمشهد
        const anchor = new SceneAnchor(entity, sceneId, localPosition);
        this.sceneAnchors.set(`${entityId}_${sceneId}`, anchor);

        // إنشاء علامة للكيان
        const marker = new EntityMarker(entity, sceneId, localPosition);
        this.entityMarkers.set(`${entityId}_${sceneId}`, marker);

        // ربط الكيان بالمشهد في SceneConnector
        this.sceneConnector.addGlobalEntityToScene(sceneId, entityId);

        console.log(`🔗 تم ربط الكيان ${entityId} بالمشهد ${sceneId}`);
        return anchor;
    }

    // إنشاء رابط بين مشهدين
    createSceneLink(fromSceneId, toSceneId, connectionPoint, type = 'door') {
        const link = new SceneLink(fromSceneId, toSceneId, connectionPoint, type);
        this.sceneLinks.push(link);
        
        // إنشاء نقاط انتقال تلقائية
        this.createHotspotsFromLink(link);
        
        return link;
    }

    // إنشاء نقاط انتقال من الرابط
    createHotspotsFromLink(link) {
        const fromScene = this.sceneConnector.scenes.get(link.fromSceneId);
        const toScene = this.sceneConnector.scenes.get(link.toSceneId);
        
        if (!fromScene || !toScene) return;

        // نقطة انتقال من المشهد الأول إلى الثاني
        const hotspot1 = {
            id: `hotspot_${link.id}_to_${link.toSceneId}`,
            type: 'SCENE',
            position: link.point,
            localPosition: this.sceneConnector.worldToLocal(link.fromSceneId, link.point),
            data: {
                targetSceneId: link.toSceneId,
                targetSceneName: `المشهد ${link.toSceneId}`,
                description: link.description || 'انتقال'
            }
        };

        // نقطة انتقال من المشهد الثاني إلى الأول
        const hotspot2 = {
            id: `hotspot_${link.id}_to_${link.fromSceneId}`,
            type: 'SCENE',
            position: link.point,
            localPosition: this.sceneConnector.worldToLocal(link.toSceneId, link.point),
            data: {
                targetSceneId: link.fromSceneId,
                targetSceneName: `المشهد ${link.fromSceneId}`,
                description: link.description || 'انتقال'
            }
        };

        // إضافة النقاط إلى المشاهد
        if (!fromScene.hotspots) fromScene.hotspots = [];
        if (!toScene.hotspots) toScene.hotspots = [];
        
        fromScene.hotspots.push(hotspot1);
        toScene.hotspots.push(hotspot2);
    }

    // مزامنة كيان عبر جميع المشاهد
    syncEntityAcrossScenes(entityId) {
        const entity = this.globalSystem.getCompleteEntity(entityId);
        if (!entity) return;

        // تحديث جميع أجزاء الكيان في المشاهد
        entity.segments.forEach((segment, sceneId) => {
            const marker = this.entityMarkers.get(`${entityId}_${sceneId}`);
            if (marker) {
                marker.updateFromEntity(entity);
            }
        });

        console.log(`🔄 تمت مزامنة الكيان ${entityId} عبر ${entity.segments.size} مشاهد`);
    }

    // الحصول على كيان كامل بمعلوماته في جميع المشاهد
    getCompleteEntityView(entityId) {
        const entity = this.globalSystem.getCompleteEntity(entityId);
        if (!entity) return null;

        const view = {
            entity: entity,
            anchors: [],
            markers: [],
            scenes: []
        };

        // جمع معلومات من جميع المشاهد
        entity.segments.forEach((_, sceneId) => {
            const anchor = this.sceneAnchors.get(`${entityId}_${sceneId}`);
            const marker = this.entityMarkers.get(`${entityId}_${sceneId}`);
            const scene = this.sceneConnector.scenes.get(sceneId);

            if (anchor) view.anchors.push(anchor);
            if (marker) view.markers.push(marker);
            if (scene) view.scenes.push(scene);
        });

        return view;
    }

    // تصدير للاستخدام في ACTUAL VIEW STUDIO
    exportForViewer() {
        const exportData = {
            scenes: [],
            globalEntities: [],
            links: this.sceneLinks.map(l => l.toJSON()),
            hotspots: []
        };

        // تجميع كل المشاهد مع نقاطها
        this.sceneConnector.scenes.forEach((scene, sceneId) => {
            const sceneData = {
                id: sceneId,
                position: scene.realWorldPosition,
                rotation: scene.rotation,
                hotspots: scene.hotspots || [],
                globalEntities: []
            };

            // إضافة الكيانات العالمية في هذا المشهد
            scene.globalEntities.forEach(entityId => {
                const marker = this.entityMarkers.get(`${entityId}_${sceneId}`);
                if (marker) {
                    sceneData.globalEntities.push(marker.toJSON());
                }
            });

            exportData.scenes.push(sceneData);
        });

        return exportData;
    }

    // الحصول على تقرير شامل
    getBridgeReport() {
        return {
            totalEntities: this.globalSystem.entities.size,
            totalScenes: this.sceneConnector.scenes.size,
            totalAnchors: this.sceneAnchors.size,
            totalMarkers: this.entityMarkers.size,
            totalLinks: this.sceneLinks.length,
            syncStatus: this.syncManager.getStatus()
        };
    }
}
