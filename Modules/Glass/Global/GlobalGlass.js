// =======================================
// ACTUAL VIEW CONSTRUCTION OS - GLOBAL GLASS
// =======================================

export class GlobalGlass {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        
        this.glassData = {
            type: options.type || 'clear',
            thickness: options.thickness || 0.01,
            transparency: options.transparency || 0.8,
            reflectivity: options.reflectivity || 0.2,
            tint: options.tint || 0xffffff
        };
        
        this.entityId = null;
        this.instances = [];
        this.windows = [];
        this.curtainWalls = [];
    }

    // إنشاء زجاج عالمي
    create(position, sceneId = null, dimensions = { width: 1.0, height: 1.0 }) {
        this.entityId = this.globalSystem.createEntity('glass', {
            ...this.glassData,
            dimensions,
            created: new Date().toISOString()
        });

        if (sceneId) {
            this.addInstance(sceneId, position, dimensions);
        }

        return this.entityId;
    }

    // إضافة نسخة في مشهد
    addInstance(sceneId, position, dimensions) {
        const globalPos = this.sceneConnector.localToGlobal(sceneId, position);
        
        const instanceData = {
            id: `glass-${Date.now()}-${Math.random()}`,
            position: globalPos,
            localPosition: position,
            dimensions: dimensions,
            glassData: { ...this.glassData }
        };

        this.globalSystem.addSegment(this.entityId, sceneId, instanceData);
        this.instances.push({ sceneId, ...instanceData });

        return instanceData;
    }

    // إنشاء واجهة زجاجية متصلة عبر مشاهد
    createConnectedCurtainWall(sceneIds, path, options = {}) {
        const wallId = `curtain-${Date.now()}`;
        const segments = [];

        for (let i = 0; i < sceneIds.length; i++) {
            const sceneId = sceneIds[i];
            const startPoint = path[i];
            const endPoint = path[i + 1] || path[i];
            
            // حساب عدد الألواح الزجاجية
            const length = this.calculateDistance(startPoint, endPoint);
            const panelWidth = options.panelWidth || 1.5;
            const panelCount = Math.floor(length / panelWidth);

            const segment = {
                sceneId,
                startPoint,
                endPoint,
                panelCount,
                panels: []
            };

            for (let j = 0; j < panelCount; j++) {
                const t = j / panelCount;
                const pos = {
                    x: startPoint.x + (endPoint.x - startPoint.x) * t,
                    y: startPoint.y + (options.height || 3.0) / 2,
                    z: startPoint.z + (endPoint.z - startPoint.z) * t
                };

                const panel = this.addInstance(sceneId, pos, {
                    width: panelWidth,
                    height: options.height || 3.0
                });
                segment.panels.push(panel);
            }

            // ربط مع المشهد التالي
            if (i < sceneIds.length - 1) {
                this.sceneConnector.createLink(
                    sceneId,
                    sceneIds[i + 1],
                    endPoint,
                    'glass_connection'
                );
            }

            segments.push(segment);
        }

        this.curtainWalls.push({
            id: wallId,
            segments,
            totalPanels: segments.reduce((sum, s) => sum + s.panelCount, 0)
        });

        return wallId;
    }

    // إنشاء نافذة تربط مشهدين
    createConnectingWindow(sceneId1, sceneId2, position, size) {
        const windowId = `window-${Date.now()}`;
        
        // إنشاء النافذة في كلا المشهدين
        const window1 = this.addInstance(sceneId1, position, size);
        const window2 = this.addInstance(sceneId2, position, size);

        // ربط المشهدين عبر النافذة
        this.sceneConnector.createLink(
            sceneId1,
            sceneId2,
            position,
            'window'
        );

        this.windows.push({
            id: windowId,
            scenes: [sceneId1, sceneId2],
            position,
            size,
            instances: [window1, window2]
        });

        return windowId;
    }

    calculateDistance(p1, p2) {
        return Math.sqrt(
            Math.pow(p2.x - p1.x, 2) +
            Math.pow(p2.z - p1.z, 2)
        );
    }

    // تغيير شفافية الزجاج عبر المشاهد
    setGlobalTransparency(value) {
        this.glassData.transparency = value;
        
        this.instances.forEach(instance => {
            instance.glassData.transparency = value;
        });

        this.globalSystem.updateEntity(this.entityId, this.glassData);
    }

    // تقرير عالمي
    generateGlobalReport() {
        return {
            entityId: this.entityId,
            type: 'زجاج عالمي',
            glassType: this.glassData.type,
            totalInstances: this.instances.length,
            windows: this.windows.length,
            curtainWalls: this.curtainWalls.length,
            distribution: this.instances.reduce((acc, i) => {
                acc[i.sceneId] = (acc[i.sceneId] || 0) + 1;
                return acc;
            }, {}),
            specifications: this.glassData
        };
    }
}
