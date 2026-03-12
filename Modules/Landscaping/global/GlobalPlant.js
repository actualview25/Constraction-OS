// =======================================
// ACTUAL VIEW CONSTRUCTION OS - GLOBAL PLANT
// =======================================

export class GlobalPlant {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        
        this.plantData = {
            type: options.type || 'shrub',
            species: options.species || 'generic',
            height: options.height || 0.5,
            width: options.width || 0.4,
            color: options.color || 0x44aa44,
            density: options.density || 0.8
        };
        
        this.entityId = null;
        this.instances = []; // النباتات في المشاهد المختلفة
        this.totalCount = 0;
    }

    // إنشاء نبتة عالمية
    create(position, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('plant', {
            ...this.plantData,
            created: new Date().toISOString()
        });

        if (sceneId) {
            this.addInstance(sceneId, position);
        }

        return this.entityId;
    }

    // إضافة نسخة في مشهد
    addInstance(sceneId, position) {
        const globalPos = this.sceneConnector.localToGlobal(sceneId, position);
        
        const instanceData = {
            position: globalPos,
            localPosition: position,
            plantData: { ...this.plantData }
        };

        this.globalSystem.addSegment(this.entityId, sceneId, instanceData);
        this.instances.push({ sceneId, ...instanceData });
        this.totalCount++;

        console.log(`🌱 Plant added to scene ${sceneId}`);
        return instanceData;
    }

    // نقل النبات بين المشاهد
    moveToScene(instanceId, targetSceneId, newPosition) {
        const instance = this.instances.find(i => i.id === instanceId);
        if (!instance) return false;

        // إزالة من المشهد القديم
        this.globalSystem.removeSegment(this.entityId, instance.sceneId, instanceId);
        
        // إضافة للمشهد الجديد
        const globalPos = this.sceneConnector.localToGlobal(targetSceneId, newPosition);
        instance.sceneId = targetSceneId;
        instance.position = globalPos;
        instance.localPosition = newPosition;
        
        this.globalSystem.addSegment(this.entityId, targetSceneId, instance);

        return true;
    }

    // تكرار النبات في مشاهد متعددة
    duplicateToScenes(sceneIds, basePosition, spacing = 2.0) {
        const duplicates = [];
        
        sceneIds.forEach((sceneId, index) => {
            const offset = {
                x: basePosition.x + (index * spacing),
                y: basePosition.y,
                z: basePosition.z
            };
            
            const dup = this.addInstance(sceneId, offset);
            duplicates.push(dup);
        });

        return duplicates;
    }

    // تحديث خصائص النبات
    updateProperties(newData) {
        this.plantData = { ...this.plantData, ...newData };
        
        // تحديث كل النسخ
        this.instances.forEach(instance => {
            instance.plantData = { ...this.plantData };
        });

        this.globalSystem.updateEntity(this.entityId, this.plantData);
    }

    // الحصول على إحصائيات
    getStats() {
        return {
            totalInstances: this.totalCount,
            scenes: [...new Set(this.instances.map(i => i.sceneId))],
            species: this.plantData.species,
            averageHeight: this.plantData.height
        };
    }

    // تقرير عالمي
    generateGlobalReport() {
        return {
            entityId: this.entityId,
            type: 'نبات عالمي',
            species: this.plantData.species,
            totalCount: this.totalCount,
            distributionByScene: this.instances.reduce((acc, i) => {
                acc[i.sceneId] = (acc[i.sceneId] || 0) + 1;
                return acc;
            }, {}),
            specifications: this.plantData
        };
    }
}
