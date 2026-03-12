// =======================================
// ACTUAL VIEW CONSTRUCTION OS - GLOBAL GLASS PARTITION
// =======================================

export class GlobalGlassPartition {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        this.partitionData = {
            length: options.length || 3.0,
            height: options.height || 2.4,
            glassType: options.glassType || 'clear'
        };
        this.entityId = null;
        this.instances = [];
    }

    create(position, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('glassPartition', {
            ...this.partitionData,
            created: new Date().toISOString()
        });
        if (sceneId) this.addInstance(sceneId, position);
        return this.entityId;
    }

    addInstance(sceneId, position) {
        const globalPos = this.sceneConnector.localToGlobal(sceneId, position);
        const instance = { position: globalPos, localPosition: position, partitionData: { ...this.partitionData } };
        this.globalSystem.addSegment(this.entityId, sceneId, instance);
        this.instances.push({ sceneId, ...instance });
        return instance;
    }

    generateGlobalReport() {
        return {
            entityId: this.entityId,
            type: 'فاصل زجاجي عالمي',
            totalInstances: this.instances.length,
            totalLength: (this.partitionData.length * this.instances.length).toFixed(2) + ' م'
        };
    }
}
