// =======================================
// ACTUAL VIEW CONSTRUCTION OS - GLOBAL SKYLIGHT
// =======================================

export class GlobalSkylight {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        this.skylightData = {
            shape: options.shape || 'rectangular',
            width: options.width || 2.0,
            length: options.length || 3.0,
            glassType: options.glassType || 'clear'
        };
        this.entityId = null;
        this.instances = [];
    }

    create(position, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('skylight', {
            ...this.skylightData,
            created: new Date().toISOString()
        });
        if (sceneId) this.addInstance(sceneId, position);
        return this.entityId;
    }

    addInstance(sceneId, position) {
        const globalPos = this.sceneConnector.localToGlobal(sceneId, position);
        const instance = { position: globalPos, localPosition: position, skylightData: { ...this.skylightData } };
        this.globalSystem.addSegment(this.entityId, sceneId, instance);
        this.instances.push({ sceneId, ...instance });
        return instance;
    }

    generateGlobalReport() {
        return {
            entityId: this.entityId,
            type: 'مناور عالمي',
            totalInstances: this.instances.length,
            specifications: this.skylightData
        };
    }
}
