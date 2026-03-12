// =======================================
// ACTUAL VIEW CONSTRUCTION OS - GLOBAL MARBLE
// =======================================

export class GlobalMarble {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        this.marbleData = {
            type: options.type || 'carrara',
            finish: options.finish || 'polished',
            size: options.size || { width: 1.0, height: 0.02, depth: 1.0 }
        };
        this.entityId = null;
        this.instances = [];
    }

    create(position, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('marble', {
            ...this.marbleData,
            created: new Date().toISOString()
        });
        if (sceneId) this.addInstance(sceneId, position);
        return this.entityId;
    }

    addInstance(sceneId, position) {
        const globalPos = this.sceneConnector.localToGlobal(sceneId, position);
        const instance = { position: globalPos, localPosition: position, marbleData: { ...this.marbleData } };
        this.globalSystem.addSegment(this.entityId, sceneId, instance);
        this.instances.push({ sceneId, ...instance });
        return instance;
    }

    generateGlobalReport() {
        return {
            entityId: this.entityId,
            type: 'رخام عالمي',
            totalInstances: this.instances.length,
            specifications: this.marbleData
        };
    }
}
