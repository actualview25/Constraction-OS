// =======================================
// ACTUAL VIEW CONSTRUCTION OS - GLOBAL STONE
// =======================================

export class GlobalStone {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        
        this.stoneData = {
            type: options.type || 'limestone',
            finish: options.finish || 'natural',
            size: options.size || { width: 0.4, height: 0.2, depth: 0.2 },
            color: options.color || 0xeeeeee,
            mortar: options.mortar !== false,
            mortarColor: options.mortarColor || 0xcccccc
        };
        
        this.entityId = null;
        this.instances = [];
        this.walls = []; // جدران حجرية كاملة
    }

    // إنشاء حجر عالمي
    create(position, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('stone', {
            ...this.stoneData,
            created: new Date().toISOString()
        });

        if (sceneId) {
            this.addInstance(sceneId, position);
        }

        return this.entityId;
    }

    // إضافة نسخة في مشهد
    addInstance(sceneId, position, rotation = 0) {
        const globalPos = this.sceneConnector.localToGlobal(sceneId, position);
        
        const instanceData = {
            id: `stone-${Date.now()}-${Math.random()}`,
            position: globalPos,
            localPosition: position,
            rotation: rotation,
            stoneData: { ...this.stoneData }
        };

        this.globalSystem.addSegment(this.entityId, sceneId, instanceData);
        this.instances.push({ sceneId, ...instanceData });

        return instanceData;
    }

    // إنشاء جدار حجري مستمر عبر مشاهد متعددة
    createContinuousWall(sceneIds, points, options = {}) {
        const wallId = `wall-${Date.now()}`;
        const segments = [];

        for (let i = 0; i < sceneIds.length; i++) {
            const sceneId = sceneIds[i];
            const startPoint = points[i];
            const endPoint = points[i + 1] || points[i];
            
            if (i < sceneIds.length - 1) {
                // ربط مع المشهد التالي
                const linkPoint = this.calculateLinkPoint(startPoint, endPoint);
                this.sceneConnector.createLink(
                    sceneId,
                    sceneIds[i + 1],
                    linkPoint,
                    'wall_connection'
                );
            }

            // حساب عدد الحجارة في هذا الجزء
            const stoneCount = Math.floor(
                this.calculateDistance(startPoint, endPoint) / this.stoneData.size.width
            );

            const segment = {
                sceneId,
                startPoint,
                endPoint,
                stoneCount,
                stones: []
            };

            for (let j = 0; j < stoneCount; j++) {
                const t = j / stoneCount;
                const pos = {
                    x: startPoint.x + (endPoint.x - startPoint.x) * t,
                    y: startPoint.y,
                    z: startPoint.z + (endPoint.z - startPoint.z) * t
                };
                
                const stone = this.addInstance(sceneId, pos);
                segment.stones.push(stone);
            }

            segments.push(segment);
        }

        this.walls.push({
            id: wallId,
            segments,
            totalStones: segments.reduce((sum, s) => sum + s.stoneCount, 0)
        });

        return wallId;
    }

    calculateDistance(p1, p2) {
        return Math.sqrt(
            Math.pow(p2.x - p1.x, 2) +
            Math.pow(p2.z - p1.z, 2)
        );
    }

    calculateLinkPoint(p1, p2) {
        return {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2,
            z: (p1.z + p2.z) / 2
        };
    }

    // تحديث خصائص الحجر
    updateStoneData(newData) {
        this.stoneData = { ...this.stoneData, ...newData };
        
        this.instances.forEach(instance => {
            instance.stoneData = { ...this.stoneData };
        });

        this.globalSystem.updateEntity(this.entityId, this.stoneData);
    }

    // تقرير عالمي
    generateGlobalReport() {
        const totalStones = this.instances.length;
        const totalWalls = this.walls.length;

        return {
            entityId: this.entityId,
            type: 'حجر عالمي',
            stoneType: this.stoneData.type,
            finish: this.stoneData.finish,
            totalStones,
            totalWalls,
            distribution: this.instances.reduce((acc, i) => {
                acc[i.sceneId] = (acc[i.sceneId] || 0) + 1;
                return acc;
            }, {}),
            walls: this.walls.map(w => ({
                id: w.id,
                segments: w.segments.length,
                stones: w.totalStones
            })),
            specifications: this.stoneData
        };
    }
}
