// =======================================
// ACTUAL CONSTRUCTION OS - GLOBAL HVAC
// =======================================

export class GlobalHVAC {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        
        this.hvacData = {
            systemType: options.systemType || 'split', // split, ducted, vrf
            capacity: options.capacity || 18000,
            efficiency: options.efficiency || 3.5 // COP
        };
        
        this.entityId = null;
        this.units = [];
        this.ducts = [];
    }

    create(sceneId = null) {
        this.entityId = this.globalSystem.createEntity('hvac', {
            ...this.hvacData,
            created: new Date().toISOString()
        });

        if (sceneId) {
            this.addSegment(sceneId);
        }

        return this.entityId;
    }

    addUnit(sceneId, position, unitType = 'indoor', capacity = null) {
        const globalPos = this.sceneConnector.localToGlobal(sceneId, position);
        
        const unitData = {
            position: globalPos,
            localPosition: position,
            type: unitType,
            capacity: capacity || this.hvacData.capacity,
            id: `hvac_${Date.now()}_${this.units.length}`
        };

        let segment = this.getOrCreateSegment(sceneId);
        if (!segment.units) segment.units = [];
        segment.units.push(unitData);
        
        this.units.push(unitData);

        return unitData;
    }

    addDuct(sceneId, startPoint, endPoint, diameter = 200) {
        const globalStart = this.sceneConnector.localToGlobal(sceneId, startPoint);
        const globalEnd = this.sceneConnector.localToGlobal(sceneId, endPoint);
        
        const length = this.calculateLength(globalStart, globalEnd);

        const ductData = {
            start: globalStart,
            end: globalEnd,
            localStart: startPoint,
            localEnd: endPoint,
            diameter: diameter,
            length: length
        };

        let segment = this.getOrCreateSegment(sceneId);
        if (!segment.ducts) segment.ducts = [];
        segment.ducts.push(ductData);
        
        this.ducts.push(ductData);

        return ductData;
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
                units: [],
                ducts: []
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

    calculateTotalCapacity() {
        return this.units.reduce((sum, unit) => sum + (unit.capacity || 0), 0);
    }

    getTotalQuantities() {
        const totalDuctLength = this.ducts.reduce((sum, d) => sum + d.length, 0);
        
        return {
            systemType: this.hvacData.systemType,
            totalCapacity: this.calculateTotalCapacity(),
            unitsCount: this.units.length,
            indoorUnits: this.units.filter(u => u.type === 'indoor').length,
            outdoorUnits: this.units.filter(u => u.type === 'outdoor').length,
            totalDuctLength: totalDuctLength.toFixed(2),
            efficiency: this.hvacData.efficiency
        };
    }
}
