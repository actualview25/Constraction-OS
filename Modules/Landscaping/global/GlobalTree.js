// =======================================
// ACTUAL VIEW CONSTRUCTION OS - GLOBAL TREE
// =======================================

export class GlobalTree {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        
        this.treeData = {
            type: options.type || 'oak',
            height: options.height || 5.0,
            trunkDiameter: options.trunkDiameter || 0.3,
            canopySize: options.canopySize || 3.0,
            age: options.age || 5
        };
        
        this.entityId = null;
        this.instances = [];
        this.forestGroups = new Map(); // مجموعات الأشجار
    }

    // إنشاء شجرة عالمية
    create(position, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('tree', {
            ...this.treeData,
            created: new Date().toISOString()
        });

        if (sceneId) {
            this.addInstance(sceneId, position);
        }

        return this.entityId;
    }

    // إضافة نسخة في مشهد
    addInstance(sceneId, position) {
        const globalPos = this.sceneConnector.localToGlobal(sceneId, position);
        
        const instanceData = {
            id: `tree-${Date.now()}-${Math.random()}`,
            position: globalPos,
            localPosition: position,
            treeData: { ...this.treeData },
            growthStage: 'mature',
            plantedAt: new Date().toISOString()
        };

        this.globalSystem.addSegment(this.entityId, sceneId, instanceData);
        this.instances.push({ sceneId, ...instanceData });

        console.log(`🌳 Tree added to scene ${sceneId}`);
        return instanceData;
    }

    // إنشاء غابة (مجموعة أشجار)
    createForest(sceneId, center, radius, count, pattern = 'random') {
        const forestId = `forest-${Date.now()}`;
        const trees = [];

        for (let i = 0; i < count; i++) {
            let position;
            
            if (pattern === 'grid') {
                const gridSize = Math.ceil(Math.sqrt(count));
                const row = Math.floor(i / gridSize);
                const col = i % gridSize;
                position = {
                    x: center.x + (col - gridSize/2) * 3,
                    y: center.y,
                    z: center.z + (row - gridSize/2) * 3
                };
            } else {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * radius;
                position = {
                    x: center.x + Math.cos(angle) * distance,
                    y: center.y,
                    z: center.z + Math.sin(angle) * distance
                };
            }

            const tree = this.addInstance(sceneId, position);
            trees.push(tree);
        }

        this.forestGroups.set(forestId, {
            id: forestId,
            sceneId,
            center,
            radius,
            count,
            pattern,
            trees
        });

        return forestId;
    }

    // ربط الأشجار بمشاهد مختلفة
    connectTreesAcrossScenes(treeIds, connectionType = 'path') {
        const connections = [];
        
        for (let i = 0; i < treeIds.length - 1; i++) {
            const tree1 = this.instances.find(t => t.id === treeIds[i]);
            const tree2 = this.instances.find(t => t.id === treeIds[i+1]);
            
            if (tree1 && tree2) {
                const link = this.sceneConnector.createLink(
                    tree1.sceneId,
                    tree2.sceneId,
                    tree1.position,
                    connectionType
                );
                connections.push(link);
            }
        }

        return connections;
    }

    // نمو الأشجار عبر الزمن
    grow(years) {
        this.treeData.age += years;
        this.treeData.height += years * 0.3;
        this.treeData.trunkDiameter += years * 0.02;
        this.treeData.canopySize += years * 0.2;

        // تحديث كل النسخ
        this.instances.forEach(instance => {
            instance.treeData = { ...this.treeData };
            instance.growthStage = this.getGrowthStage();
        });

        this.globalSystem.updateEntity(this.entityId, this.treeData);
    }

    getGrowthStage() {
        if (this.treeData.age < 3) return 'young';
        if (this.treeData.age < 10) return 'growing';
        if (this.treeData.age < 30) return 'mature';
        return 'old';
    }

    // تقرير عالمي
    generateGlobalReport() {
        return {
            entityId: this.entityId,
            type: 'شجرة عالمية',
            species: this.treeData.type,
            totalCount: this.instances.length,
            forests: Array.from(this.forestGroups.keys()).length,
            averageAge: this.treeData.age,
            distribution: this.instances.reduce((acc, i) => {
                acc[i.sceneId] = (acc[i.sceneId] || 0) + 1;
                return acc;
            }, {}),
            specifications: this.treeData
        };
    }
}
