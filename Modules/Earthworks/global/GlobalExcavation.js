// =======================================
// ACTUAL CONSTRUCTION OS - GLOBAL EXCAVATION
// =======================================

export class GlobalExcavation {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        
        this.excavationData = {
            soilType: options.soilType || 'topsoil',
            depth: options.depth || 2.0,
            slope: options.slope || 45,
            material: new SoilMaterial(options.soilType),
            color: options.color || 0x8B4513
        };
        
        this.entityId = null;
        this.volumes = [];
        this.totalVolume = 0;
    }

    // إنشاء حفرية عالمية
    create(boundaryPoints, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('excavation', {
            ...this.excavationData,
            created: new Date().toISOString()
        });

        if (sceneId) {
            this.addSegment(sceneId, boundaryPoints);
        }

        return this.entityId;
    }

    // إضافة جزء في مشهد
    addSegment(sceneId, boundaryPoints) {
        // تحويل النقاط إلى إحداثيات عالمية
        const globalPoints = boundaryPoints.map(p => 
            this.sceneConnector.localToGlobal(sceneId, p)
        );

        // حساب المساحة والحجم
        const area = this.calculateArea(globalPoints);
        const volume = area * this.excavationData.depth;

        const segmentData = {
            boundary: globalPoints,
            localBoundary: boundaryPoints,
            area: area,
            volume: volume,
            depth: this.excavationData.depth,
            soilType: this.excavationData.soilType
        };

        this.globalSystem.addSegment(this.entityId, sceneId, segmentData);
        this.volumes.push(volume);
        this.totalVolume += volume;

        console.log(`⛏️ تم إضافة حفرية بمساحة ${area.toFixed(2)} م² في المشهد ${sceneId}`);
        return segmentData;
    }

    calculateArea(points) {
        if (points.length < 3) return 0;
        let area = 0;
        for (let i = 0; i < points.length; i++) {
            const j = (i + 1) % points.length;
            area += points[i].x * points[j].z;
            area -= points[j].x * points[i].z;
        }
        return Math.abs(area) / 2;
    }

    renderInScene(sceneId, threeScene) {
        const sceneEntities = this.globalSystem.getSceneEntities(sceneId);
        
        sceneEntities.forEach(item => {
            if (item.entityId === this.entityId) {
                this.renderSegment(item.segment, threeScene);
            }
        });
    }

    renderSegment(segment, threeScene) {
        const shape = new THREE.Shape();
        segment.localBoundary.forEach((p, i) => {
            if (i === 0) shape.moveTo(p.x, p.z);
            else shape.lineTo(p.x, p.z);
        });

        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: this.excavationData.depth,
            bevelEnabled: false
        });

        const material = new THREE.MeshStandardMaterial({
            color: this.excavationData.color,
            transparent: true,
            opacity: 0.6
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = -this.excavationData.depth;
        threeScene.add(mesh);
    }

    getTotalQuantities() {
        return {
            soilType: this.excavationData.soilType,
            totalVolume: this.totalVolume.toFixed(2),
            averageDepth: this.excavationData.depth,
            segments: this.volumes.length,
            estimatedWeight: (this.totalVolume * 1.6).toFixed(2) // طن
        };
    }
}
