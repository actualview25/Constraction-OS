// =======================================
// ACTUAL CONSTRUCTION OS - CAD IMPORTER
// =======================================

export class CADImporter {
    constructor(geoRef, sceneConnector) {
        this.geoRef = geoRef;
        this.sceneConnector = sceneConnector;
        this.parsedData = null;
        this.layers = {};
        this.units = 'mm'; // units in CAD file
    }

    async importFile(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        
        try {
            let data;
            if (extension === 'dwg') {
                data = await this.importDWG(file);
            } else if (extension === 'dxf') {
                data = await this.importDXF(file);
            } else {
                throw new Error('صيغة ملف غير مدعومة');
            }

            this.parsedData = data;
            this.extractLayers(data);
            
            console.log(`✅ تم استيراد ملف CAD: ${file.name}`);
            console.log(`📊 الطبقات: ${Object.keys(this.layers).length}`);
            console.log(`📐 الكيانات: ${data.entities?.length || 0}`);
            
            return data;
        } catch (error) {
            console.error('❌ فشل استيراد ملف CAD:', error);
            throw error;
        }
    }

    async importDWG(file) {
        // DWG يحتاج مكتبة خارجية، هذه محاكاة
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                // محاكاة تحليل DWG
                const mockData = {
                    format: 'dwg',
                    version: '2018',
                    units: this.units,
                    layers: {
                        '0': { color: 0xffffff, entities: [] },
                        'WALLS': { color: 0xff0000, entities: [] },
                        'COLUMNS': { color: 0x00ff00, entities: [] },
                        'DOORS': { color: 0x0000ff, entities: [] },
                        'WINDOWS': { color: 0xffff00, entities: [] }
                    },
                    entities: []
                };
                resolve(mockData);
            };
            reader.readAsArrayBuffer(file);
        });
    }

    async importDXF(file) {
        const parser = new DXFParser();
        return await parser.parse(file);
    }

    extractLayers(data) {
        this.layers = {};
        
        if (data.layers) {
            Object.keys(data.layers).forEach(layerName => {
                this.layers[layerName] = {
                    name: layerName,
                    visible: true,
                    color: data.layers[layerName].color || 0xffffff,
                    entities: []
                };
            });
        }

        // تصنيف الكيانات حسب الطبقات
        if (data.entities) {
            data.entities.forEach(entity => {
                const layer = entity.layer || '0';
                if (!this.layers[layer]) {
                    this.layers[layer] = {
                        name: layer,
                        visible: true,
                        color: entity.color || 0xffffff,
                        entities: []
                    };
                }
                
                // تحويل الإحداثيات
                const convertedEntity = this.convertEntity(entity);
                this.layers[layer].entities.push(convertedEntity);
            });
        }
    }

    convertEntity(entity) {
        const converted = { ...entity };
        
        // تحويل النقاط
        if (entity.points) {
            converted.points = entity.points.map(p => 
                this.geoRef.cadToWorld(p)
            );
        }
        
        if (entity.start && entity.end) {
            converted.start = this.geoRef.cadToWorld(entity.start);
            converted.end = this.geoRef.cadToWorld(entity.end);
        }
        
        if (entity.center) {
            converted.center = this.geoRef.cadToWorld(entity.center);
        }
        
        return converted;
    }

    getLayerNames() {
        return Object.keys(this.layers);
    }

    getLayerEntities(layerName) {
        return this.layers[layerName]?.entities || [];
    }

    setLayerVisible(layerName, visible) {
        if (this.layers[layerName]) {
            this.layers[layerName].visible = visible;
        }
    }

    generate3DModels() {
        const models = [];
        
        Object.values(this.layers).forEach(layer => {
            if (!layer.visible) return;
            
            layer.entities.forEach(entity => {
                const model = this.createModel(entity, layer.color);
                if (model) models.push(model);
            });
        });
        
        return models;
    }

    createModel(entity, color) {
        switch (entity.type) {
            case 'LINE':
                return this.createLineModel(entity, color);
            case 'CIRCLE':
                return this.createCircleModel(entity, color);
            case 'ARC':
                return this.createArcModel(entity, color);
            case 'POLYLINE':
                return this.createPolylineModel(entity, color);
            default:
                return null;
        }
    }

    createLineModel(entity, color) {
        const geometry = new THREE.BufferGeometry();
        const points = [
            new THREE.Vector3(entity.start.x, entity.start.y, entity.start.z),
            new THREE.Vector3(entity.end.x, entity.end.y, entity.end.z)
        ];
        geometry.setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: color });
        return new THREE.Line(geometry, material);
    }

    createCircleModel(entity, color) {
        const geometry = new THREE.CircleGeometry(entity.radius, 32);
        const material = new THREE.MeshBasicMaterial({ 
            color: color, 
            wireframe: true,
            side: THREE.DoubleSide
        });
        const circle = new THREE.Mesh(geometry, material);
        circle.position.set(entity.center.x, entity.center.y, entity.center.z);
        return circle;
    }

    createArcModel(entity, color) {
        // إنشاء قوس (جزء من دائرة)
        const points = [];
        const segments = 32;
        for (let i = 0; i <= segments; i++) {
            const angle = entity.startAngle + (entity.endAngle - entity.startAngle) * i / segments;
            const x = entity.center.x + entity.radius * Math.cos(angle);
            const y = entity.center.y + entity.radius * Math.sin(angle);
            points.push(new THREE.Vector3(x, y, entity.center.z));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: color });
        return new THREE.Line(geometry, material);
    }

    createPolylineModel(entity, color) {
        const points = entity.points.map(p => 
            new THREE.Vector3(p.x, p.y, p.z)
        );
        
        if (entity.closed) {
            points.push(points[0]); // إغلاق المضلع
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: color });
        return new THREE.Line(geometry, material);
    }
}
