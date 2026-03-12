// =======================================
// ACTUAL VIEW CONSTRUCTION OS - GLOBAL CLADDING
// =======================================

export class GlobalCladding {
    constructor(globalSystem, sceneConnector, options = {}) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        
        this.claddingData = {
            material: options.material || 'stone',
            materialType: options.materialType || 'limestone',
            pattern: options.pattern || 'random',
            thickness: options.thickness || 0.1
        };
        
        this.entityId = null;
        this.facades = [];
        this.continuousWalls = [];
    }

    // إنشاء تكسية عالمية
    create(facadeId, sceneId = null) {
        this.entityId = this.globalSystem.createEntity('cladding', {
            ...this.claddingData,
            created: new Date().toISOString()
        });

        return this.entityId;
    }

    // تكسية جدار يمتد عبر مشاهد متعددة
    coverContinuousWall(sceneIds, wallPath, options = {}) {
        const claddingId = `cladding-${Date.now()}`;
        const sections = [];

        for (let i = 0; i < sceneIds.length; i++) {
            const sceneId = sceneIds[i];
            const startPoint = wallPath[i];
            const endPoint = wallPath[i + 1] || wallPath[i];
            
            const section = {
                sceneId,
                startPoint,
                endPoint,
                height: options.height || 3.0,
                materialType: this.claddingData.materialType,
                panels: []
            };

            // حساب عدد الألواح
            const length = this.calculateDistance(startPoint, endPoint);
            const panelWidth = options.panelWidth || 0.4;
            const panelCount = Math.floor(length / panelWidth);
            const panelHeight = options.panelHeight || 0.2;
            const rows = Math.floor(section.height / panelHeight);

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < panelCount; col++) {
                    const t = col / panelCount;
                    const pos = {
                        x: startPoint.x + (endPoint.x - startPoint.x) * t,
                        y: startPoint.y + (row + 0.5) * panelHeight,
                        z: startPoint.z + (endPoint.z - startPoint.z) * t
                    };

                    section.panels.push({
                        position: pos,
                        row, col,
                        material: this.claddingData.materialType
                    });
                }
            }

            // ربط الأقسام المتجاورة
            if (i < sceneIds.length - 1) {
                this.sceneConnector.createLink(
                    sceneId,
                    sceneIds[i + 1],
                    endPoint,
                    'cladding_connection'
                );
            }

            sections.push(section);
        }

        this.continuousWalls.push({
            id: claddingId,
            sections,
            totalPanels: sections.reduce((sum, s) => sum + s.panels.length, 0)
        });

        return claddingId;
    }

    calculateDistance(p1, p2) {
        return Math.sqrt(
            Math.pow(p2.x - p1.x, 2) +
            Math.pow(p2.z - p1.z, 2)
        );
    }

    // تحديث نمط التكسية
    updatePattern(newPattern) {
        this.claddingData.pattern = newPattern;
        this.globalSystem.updateEntity(this.entityId, this.claddingData);
    }

    // تقرير عالمي
    generateGlobalReport() {
        return {
            entityId: this.entityId,
            type: 'تكسية عالمية',
            material: this.claddingData.material,
            materialType: this.claddingData.materialType,
            pattern: this.claddingData.pattern,
            continuousWalls: this.continuousWalls.length,
            totalPanels: this.continuousWalls.reduce((sum, w) => sum + w.totalPanels, 0),
            specifications: this.claddingData
        };
    }
}
