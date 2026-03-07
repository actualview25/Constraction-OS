// =======================================
// ACTUAL CONSTRUCTION OS - UNIVERSAL IMPORTER
// =======================================
// يستورد أي عنصر من أي مصدر

export class UniversalImporter {
    constructor(globalSystem, cadImporter) {
        this.globalSystem = globalSystem;
        this.cadImporter = cadImporter;
        
        // قواعد الاستيراد لكل نوع
        this.importRules = {
            // هيكل خرساني
            'COLUMN': { layer: 'COLUMNS|أعمدة', handler: this.importColumn },
            'BEAM': { layer: 'BEAMS|كمرات', handler: this.importBeam },
            'SLAB': { layer: 'SLABS|أسقف', handler: this.importSlab },
            'FOUNDATION': { layer: 'FOUNDATIONS|قواعد', handler: this.importFoundation },
            
            // عمارة
            'WALL': { layer: 'WALLS|جدران', handler: this.importWall },
            'DOOR': { layer: 'DOORS|أبواب', handler: this.importDoor },
            'WINDOW': { layer: 'WINDOWS|شبابيك', handler: this.importWindow },
            
            // تمديدات
            'PIPE': { layer: 'PIPES|مواسير', handler: this.importPipe },
            'CABLE': { layer: 'CABLES|كابلات', handler: this.importCable },
            'DUCT': { layer: 'DUCTS|مجاري', handler: this.importDuct },
            
            // أعمال ترابية
            'EXCAVATION': { layer: 'EXCAVATION|حفريات', handler: this.importExcavation }
        };
    }

    // الاستيراد من CAD
    async importFromCAD(cadFile) {
        console.log('📥 بدء الاستيراد العالمي من CAD...');
        
        // 1. تحليل ملف CAD
        const cadData = await this.cadImporter.import(cadFile);
        
        // 2. استخراج كل الطبقات
        const importedElements = [];
        
        for (const [layerName, layerData] of Object.entries(cadData.layers)) {
            // البحث عن نوع العنصر من اسم الطبقة
            const elementType = this.detectElementType(layerName);
            
            if (elementType && this.importRules[elementType]) {
                const rule = this.importRules[elementType];
                
                // استيراد كل كيان في الطبقة
                layerData.entities.forEach(entity => {
                    const element = rule.handler(entity);
                    if (element) {
                        importedElements.push(element);
                    }
                });
            }
        }

        console.log(`✅ تم استيراد ${importedElements.length} عنصر`);
        return importedElements;
    }

    // اكتشاف نوع العنصر من اسم الطبقة
    detectElementType(layerName) {
        const upperName = layerName.toUpperCase();
        
        if (upperName.includes('COLUMN') || upperName.includes('عمود')) return 'COLUMN';
        if (upperName.includes('BEAM') || upperName.includes('كمر')) return 'BEAM';
        if (upperName.includes('WALL') || upperName.includes('جدار')) return 'WALL';
        if (upperName.includes('DOOR') || upperName.includes('باب')) return 'DOOR';
        if (upperName.includes('WINDOW') || upperName.includes('شباك')) return 'WINDOW';
        if (upperName.includes('PIPE') || upperName.includes('ماسورة')) return 'PIPE';
        if (upperName.includes('CABLE') || upperName.includes('كابل')) return 'CABLE';
        if (upperName.includes('EXCAVATION') || upperName.includes('حفر')) return 'EXCAVATION';
        
        return null;
    }

    // معالجات الاستيراد لكل نوع
    importColumn(entity) {
        return {
            type: 'column',
            shape: entity.type === 'CIRCLE' ? 'circular' : 'rectangular',
            position: this.getPosition(entity),
            dimensions: this.getDimensions(entity),
            fromCAD: true
        };
    }

    importBeam(entity) {
        return {
            type: 'beam',
            start: entity.start,
            end: entity.end,
            dimensions: { width: 0.2, depth: 0.5 }, // من CAD أو افتراضي
            fromCAD: true
        };
    }

    importWall(entity) {
        return {
            type: 'wall',
            start: entity.start,
            end: entity.end,
            thickness: 0.2,
            height: 3.0,
            fromCAD: true
        };
    }

    importDoor(entity) {
        return {
            type: 'door',
            position: entity.insertPoint || entity.center,
            width: 0.9,
            height: 2.1,
            fromCAD: true
        };
    }

    importWindow(entity) {
        return {
            type: 'window',
            position: entity.center || entity.insertPoint,
            width: 1.2,
            height: 1.5,
            fromCAD: true
        };
    }

    importPipe(entity) {
        return {
            type: 'pipe',
            start: entity.start,
            end: entity.end,
            diameter: 0.05,
            material: 'PVC',
            fromCAD: true
        };
    }

    importCable(entity) {
        return {
            type: 'cable',
            start: entity.start,
            end: entity.end,
            size: '2.5mm²',
            cores: 3,
            fromCAD: true
        };
    }

    importExcavation(entity) {
        return {
            type: 'excavation',
            boundary: entity.points,
            depth: 2.0,
            fromCAD: true
        };
    }

    // دوال مساعدة
    getPosition(entity) {
        return entity.center || entity.insertPoint || entity.start || { x: 0, y: 0, z: 0 };
    }

    getDimensions(entity) {
        if (entity.type === 'CIRCLE') {
            return { diameter: entity.radius * 2 };
        }
        if (entity.type === 'RECTANGLE') {
            return {
                width: Math.abs(entity.points[1].x - entity.points[0].x),
                depth: Math.abs(entity.points[2].z - entity.points[0].z)
            };
        }
        return { width: 0.3, depth: 0.3 };
    }
}
