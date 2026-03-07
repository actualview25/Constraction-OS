.l// =======================================
// ACTUAL CONSTRUCTION OS - GLOBAL COLUMN
// =======================================

export class GlobalColumn {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        
        this.columnData = {
            shape: options.shape || 'rectangular',
            width: options.width || 0.3,
            depth: options.depth || 0.3,
            diameter: options.diameter || 0.3,
            height: options.height || 3.0,
            grade: options.grade || 'C35',
            rebar: options.rebar || {
                mainBars: 6,
                stirrups: 8
            },
            color: options.color || 0x7a7a7a
        };
        
        this.entityId = null;
        this.columns = []; // مواقع الأعمدة
        this.totalVolume = 0;
        this.totalRebar = 0;
    }

    create(position, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('column', {
            ...this.columnData,
            created: new Date().toISOString()
        });

        if (sceneId) {
            this.addColumn(sceneId, position);
        }

        return this.entityId;
    }

    addColumn(sceneId, position) {
        const globalPos = this.sceneConnector.localToGlobal(sceneId, position);
        
        const volume = this.calculateVolume();
        const rebarWeight = this.calculateRebarWeight(volume);

        const columnData = {
            position: globalPos,
            localPosition: position,
            volume: volume,
            rebarWeight: rebarWeight,
            height: this.columnData.height
        };

        this.globalSystem.addSegment(this.entityId, sceneId, columnData);
        
        this.columns.push({ sceneId, ...columnData });
        this.totalVolume += volume;
        this.totalRebar += rebarWeight;

        console.log(`🏛️ تم إضافة عمود في المشهد ${sceneId}`);
        return columnData;
    }

    calculateVolume() {
        if (this.columnData.shape === 'circular') {
            return Math.PI * Math.pow(this.columnData.diameter/2, 2) * this.columnData.height;
        } else {
            return this.columnData.width * this.columnData.depth * this.columnData.height;
        }
    }

    calculateRebarWeight(volume) {
        // وزن تقريبي: 150 كجم/م³ للأعمدة
        return volume * 150;
    }

    renderInScene(sceneId, threeScene) {
        const sceneEntities = this.globalSystem.getSceneEntities(sceneId);
        
        sceneEntities.forEach(item => {
            if (item.entityId === this.entityId) {
                this.renderColumn(item.segment, threeScene);
            }
        });
    }

    renderColumn(column, threeScene) {
        let geometry;
        if (this.columnData.shape === 'circular') {
            geometry = new THREE.CylinderGeometry(
                this.columnData.diameter/2, 
                this.columnData.diameter/2, 
                this.columnData.height, 
                16
            );
        } else {
            geometry = new THREE.BoxGeometry(
                this.columnData.width, 
                this.columnData.height, 
                this.columnData.depth
            );
        }

        const material = new THREE.MeshStandardMaterial({
            color: this.columnData.color,
            transparent: true,
            opacity: 0.9
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        // تعديل الموقع ليكون قاعدة العمود على الأرض
        mesh.position.set(
            column.position.x,
            column.position.y + this.columnData.height/2,
            column.position.z
        );
        
        threeScene.add(mesh);
    }

    getTotalQuantities() {
        return {
            shape: this.columnData.shape,
            dimensions: this.columnData.shape === 'circular' 
                ? `قطر ${this.columnData.diameter}`
                : `${this.columnData.width} × ${this.columnData.depth}`,
            height: this.columnData.height,
            grade: this.columnData.grade,
            count: this.columns.length,
            totalVolume: this.totalVolume.toFixed(2),
            totalRebar: this.totalRebar.toFixed(2),
            scenes: [...new Set(this.columns.map(c => c.sceneId))]
        };
    }
}
