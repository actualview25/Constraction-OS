// =======================================
// ACTUAL VIEW CONSTRUCTION OS - GLOBAL CURTAIN WALL
// =======================================

export class GlobalCurtainWall {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        this.wallData = {
            width: options.width || 10.0,
            height: options.height || 20.0,
            glassType: options.glassType || 'clear'
        };
        this.entityId = null;
        this.segments = [];
    }

    create(position, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('curtainWall', {
            ...this.wallData,
            created: new Date().toISOString()
        });
        if (sceneId) this.addSegment(sceneId, position);
        return this.entityId;
    }

    addSegment(sceneId, position) {
        const globalPos = this.sceneConnector.localToGlobal(sceneId, position);
        const segment = { position: globalPos, localPosition: position, wallData: { ...this.wallData } };
        this.globalSystem.addSegment(this.entityId, sceneId, segment);
        this.segments.push({ sceneId, ...segment });
        return segment;
    }

    generateGlobalReport() {
        return {
            entityId: this.entityId,
            type: 'واجهة زجاجية عالمية',
            totalSegments: this.segments.length,
            totalArea: (this.wallData.width * this.wallData.height * this.segments.length).toFixed(2) + ' م²'
        };
    }
}
