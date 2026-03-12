// =======================================
// ACTUAL VIEW CONSTRUCTION OS - GLOBAL BRICK
// =======================================

export class GlobalBrick {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        this.brickData = {
            type: options.type || 'clay',
            color: options.color || 0xcc8866,
            size: options.size || { width: 0.2, height: 0.1, depth: 0.1 }
        };
        this.entityId = null;
        this.instances = [];
    }

    create(position, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('brick', {
            ...this.brickData,
            created: new Date().toISOString()
        });
        if (sceneId) this.addInstance(sceneId, position);
        return this.entityId;
    }

    addInstance(sceneId, position) {
        const globalPos = this.sceneConnector.localToGlobal(sceneId, position);
        const instance = { position: globalPos, localPosition: position, brickData: { ...this.brickData } };
        this.globalSystem.addSegment(this.entityId, sceneId, instance);
        this.instances.push({ sceneId, ...instance });
        return instance;
    }

    generateGlobalReport() {
        return {
            entityId: this.entityId,
            type: 'طوب عالمي',
            totalInstances: this.instances.length,
            specifications: this.brickData
        };
    }
}
