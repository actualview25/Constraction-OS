// =======================================
// ACTUAL CONSTRUCTION OS - GLOBAL BEAM
// =======================================

export class GlobalBeam {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        
        this.beamData = {
            width: options.width || 0.2,
            depth: options.depth || 0.5,
            grade: options.grade || 'C30',
            rebar: options.rebar || {
                mainBars: 4,
                stirrups: 8,
                spacing: 150
            },
            color: options.color || 0x888888
        };
        
        this.entityId = null;
        this.segments = [];
        this.totalLength = 0;
        this.totalVolume = 0;
        this.totalRebar = 0;
    }

    create(startPoint, endPoint, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('beam', {
            ...this.beamData,
            created: new Date().toISOString()
        });

        if (sceneId) {
            this.addSegment(sceneId, startPoint, endPoint);
        }

        return this.entityId;
    }

    addSegment(sceneId, startPoint, endPoint) {
        const globalStart = this.sceneConnector.localToGlobal(sceneId, startPoint);
        const globalEnd = this.sceneConnector.localToGlobal(sceneId, endPoint);
        
        const length = this.calculateLength(globalStart, globalEnd);
        const volume = length * this.beamData.width * this.beamData.depth;
        const rebarWeight = this.calculateRebarWeight(length);

        const segmentData = {
            start: globalStart,
            end: globalEnd,
            localStart: startPoint,
            localEnd: endPoint,
            length: length,
            volume: volume,
            rebarWeight: rebarWeight
        };

        this.globalSystem.addSegment(this.entityId, sceneId, segmentData);
        
        this.totalLength += length;
        this.totalVolume += volume;
        this.totalRebar += rebarWeight;
        this.segments.push({ sceneId, ...segmentData });

        console.log(`🏗️ تم إضافة كمرة بطول ${length.toFixed(2)} م في المشهد ${sceneId}`);
        return segmentData;
    }

    calculateLength(point1, point2) {
        return Math.sqrt(
            Math.pow(point2.x - point1.x, 2) +
            Math.pow(point2.y - point1.y, 2) +
            Math.pow(point2.z - point1.z, 2)
        );
    }

    calculateRebarWeight(length) {
        // وزن تقريبي للحديد: 100 كجم/م³
        const volume = length * this.beamData.width * this.beamData.depth;
        return volume * 100;
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
        const direction = new THREE.Vector3().subVectors(segment.end, segment.start);
        const length = direction.length();
        
        const geometry = new THREE.BoxGeometry(length, this.beamData.depth, this.beamData.width);
        const material = new THREE.MeshStandardMaterial({
            color: this.beamData.color,
            transparent: true,
            opacity: 0.8
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        
        const center = new THREE.Vector3().addVectors(segment.start, segment.end).multiplyScalar(0.5);
        mesh.position.copy(center);
        
        mesh.quaternion.setFromUnitVectors(
            new THREE.Vector3(1, 0, 0),
            direction.clone().normalize()
        );
        
        threeScene.add(mesh);
    }

    getTotalQuantities() {
        return {
            grade: this.beamData.grade,
            dimensions: `${this.beamData.width} × ${this.beamData.depth}`,
            totalLength: this.totalLength.toFixed(2),
            totalVolume: this.totalVolume.toFixed(2),
            totalRebar: this.totalRebar.toFixed(2),
            segments: this.segments.length,
            scenes: [...new Set(this.segments.map(s => s.sceneId))]
        };
    }
}
