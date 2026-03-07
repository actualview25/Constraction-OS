// =======================================
// ACTUAL CONSTRUCTION OS - GLOBAL COMPACTION
// =======================================

export class GlobalCompaction {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        
        this.compactionData = {
            layers: options.layers || [],
            totalThickness: 0,
            compactionRatio: options.compactionRatio || 0.95
        };
        
        this.entityId = null;
        this.layerVolumes = [];
    }

    create(area, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('compaction', {
            area: area,
            ...this.compactionData
        });

        if (sceneId) {
            this.addSegment(sceneId, area);
        }

        return this.entityId;
    }

    addLayer(thickness, materialType, sceneId) {
        const layer = {
            thickness: thickness,
            materialType: materialType,
            compactedVolume: 0
        };
        
        this.compactionData.layers.push(layer);
        this.compactionData.totalThickness += thickness;
        
        return layer;
    }

    addSegment(sceneId, area) {
        const segmentData = {
            area: area,
            layers: this.compactionData.layers.map(l => ({
                thickness: l.thickness,
                materialType: l.materialType,
                looseVolume: area * l.thickness,
                compactedVolume: area * l.thickness * this.compactionData.compactionRatio
            }))
        };

        this.globalSystem.addSegment(this.entityId, sceneId, segmentData);
        
        const totalVolume = segmentData.layers.reduce((sum, l) => sum + l.compactedVolume, 0);
        this.layerVolumes.push(totalVolume);

        console.log(`🔄 تم إضافة ردم بمساحة ${area} م² في المشهد ${sceneId}`);
        return segmentData;
    }

    getTotalQuantities() {
        const totalVolume = this.layerVolumes.reduce((sum, v) => sum + v, 0);
        
        return {
            layers: this.compactionData.layers.length,
            totalThickness: this.compactionData.totalThickness,
            totalVolume: totalVolume.toFixed(2),
            compactionRatio: this.compactionData.compactionRatio,
            materialBreakdown: this.compactionData.layers.map(l => ({
                material: l.materialType,
                thickness: l.thickness
            }))
        };
    }
}
