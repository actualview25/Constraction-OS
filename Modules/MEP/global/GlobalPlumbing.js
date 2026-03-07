// =======================================
// ACTUAL CONSTRUCTION OS - GLOBAL PLUMBING
// =======================================

export class GlobalPlumbing {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        
        this.plumbingData = {
            systemType: options.systemType || 'cold', // cold, hot, mixed
            pressure: options.pressure || 4,
            pipes: []
        };
        
        this.entityId = null;
        this.totalLength = 0;
        this.fixtures = [];
    }

    create(sceneId = null) {
        this.entityId = this.globalSystem.createEntity('plumbing', {
            ...this.plumbingData,
            created: new Date().toISOString()
        });

        if (sceneId) {
            this.addSegment(sceneId);
        }

        return this.entityId;
    }

    addPipe(sceneId, startPoint, endPoint, diameter = 25, material = 'ppr') {
        const globalStart = this.sceneConnector.localToGlobal(sceneId, startPoint);
        const globalEnd = this.sceneConnector.localToGlobal(sceneId, endPoint);
        
        const length = this.calculateLength(globalStart, globalEnd);

        const pipeData = {
            start: globalStart,
            end: globalEnd,
            localStart: startPoint,
            localEnd: endPoint,
            diameter: diameter,
            material: material,
            length: length
        };

        let segment = this.getOrCreateSegment(sceneId);
        if (!segment.pipes) segment.pipes = [];
        segment.pipes.push(pipeData);
        
        this.totalLength += length;

        return pipeData;
    }

    addFixture(sceneId, position, fixtureType = 'sink') {
        const globalPos = this.sceneConnector.localToGlobal(sceneId, position);
        
        const fixtureData = {
            position: globalPos,
            localPosition: position,
            type: fixtureType,
            id: `fixture_${Date.now()}_${this.fixtures.length}`
        };

        let segment = this.getOrCreateSegment(sceneId);
        if (!segment.fixtures) segment.fixtures = [];
        segment.fixtures.push(fixtureData);
        
        this.fixtures.push(fixtureData);

        return fixtureData;
    }

    getOrCreateSegment(sceneId) {
        let segment = null;
        const sceneEntities = this.globalSystem.getSceneEntities(sceneId);
        
        sceneEntities.forEach(item => {
            if (item.entityId === this.entityId) {
                segment = item.segment;
            }
        });

        if (!segment) {
            segment = {
                sceneId,
                pipes: [],
                fixtures: []
            };
            this.globalSystem.addSegment(this.entityId, sceneId, segment);
        }

        return segment;
    }

    calculateLength(point1, point2) {
        return Math.sqrt(
            Math.pow(point2.x - point1.x, 2) +
            Math.pow(point2.y - point1.y, 2) +
            Math.pow(point2.z - point1.z, 2)
        );
    }

    getTotalQuantities() {
        // تجميع الأطوال حسب القطر
        const pipesByDiameter = {};
        this.globalSystem.entities.forEach(entity => {
            if (entity.id === this.entityId) {
                entity.segments.forEach(segment => {
                    segment.pipes?.forEach(pipe => {
                        if (!pipesByDiameter[pipe.diameter]) {
                            pipesByDiameter[pipe.diameter] = 0;
                        }
                        pipesByDiameter[pipe.diameter] += pipe.length;
                    });
                });
            }
        });

        return {
            totalPipeLength: this.totalLength.toFixed(2),
            fixturesCount: this.fixtures.length,
            pipesByDiameter: pipesByDiameter,
            systemType: this.plumbingData.systemType,
            pressure: this.plumbingData.pressure
        };
    }
}
