// =======================================
// ACTUAL CONSTRUCTION OS - DXF PARSER
// =======================================

export class DXFParser {
    constructor() {
        this.lines = [];
        this.position = 0;
        this.currentGroup = null;
        this.currentValue = null;
        this.entities = [];
        this.layers = {};
    }

    async parse(file) {
        const text = await file.text();
        this.lines = text.split('\n');
        this.position = 0;
        this.entities = [];
        this.layers = {};

        while (this.position < this.lines.length) {
            this.readGroup();
            
            if (this.currentGroup === '0' && this.currentValue === 'SECTION') {
                this.readSection();
            }
        }

        return {
            format: 'dxf',
            layers: this.layers,
            entities: this.entities
        };
    }

    readGroup() {
        if (this.position + 1 >= this.lines.length) {
            this.currentGroup = null;
            this.currentValue = null;
            return;
        }

        this.currentGroup = this.lines[this.position].trim();
        this.currentValue = this.lines[this.position + 1].trim();
        this.position += 2;
    }

    readSection() {
        this.readGroup(); // SECTION type
        const sectionType = this.currentValue;

        switch (sectionType) {
            case 'HEADER':
                this.readHeader();
                break;
            case 'TABLES':
                this.readTables();
                break;
            case 'BLOCKS':
                this.readBlocks();
                break;
            case 'ENTITIES':
                this.readEntities();
                break;
        }

        // انتظار نهاية القسم
        while (this.currentGroup !== '0' || this.currentValue !== 'ENDSEC') {
            this.readGroup();
        }
    }

    readHeader() {
        while (this.currentGroup !== '0' || this.currentValue !== 'ENDSEC') {
            this.readGroup();
            // قراءة معلومات الرأس
        }
    }

    readTables() {
        while (this.currentGroup !== '0' || this.currentValue !== 'ENDSEC') {
            this.readGroup();
            
            if (this.currentGroup === '0' && this.currentValue === 'TABLE') {
                this.readGroup(); // Table type
                const tableType = this.currentValue;
                
                if (tableType === 'LAYER') {
                    this.readLayerTable();
                }
            }
        }
    }

    readLayerTable() {
        while (this.currentGroup !== '0' || this.currentValue !== 'ENDTAB') {
            this.readGroup();
            
            if (this.currentGroup === '0' && this.currentValue === 'LAYER') {
                this.readLayer();
            }
        }
    }

    readLayer() {
        let layer = {
            name: '0',
            color: 0xffffff,
            lineType: 'CONTINUOUS'
        };

        while (this.currentGroup !== '0') {
            this.readGroup();
            
            switch (this.currentGroup) {
                case '2': // Layer name
                    layer.name = this.currentValue;
                    break;
                case '62': // Color number
                    const colorNum = parseInt(this.currentValue);
                    layer.color = this.dxfColorToHex(colorNum);
                    break;
                case '6': // Line type
                    layer.lineType = this.currentValue;
                    break;
            }
        }

        this.layers[layer.name] = layer;
    }

    readBlocks() {
        while (this.currentGroup !== '0' || this.currentValue !== 'ENDSEC') {
            this.readGroup();
            // قراءة البلوكات
        }
    }

    readEntities() {
        while (this.currentGroup !== '0' || this.currentValue !== 'ENDSEC') {
            this.readGroup();
            
            if (this.currentGroup === '0') {
                this.readEntity();
            }
        }
    }

    readEntity() {
        const entityType = this.currentValue;
        let entity = {
            type: entityType,
            layer: '0',
            color: null,
            lineType: null
        };

        while (this.currentGroup !== '0') {
            this.readGroup();
            
            switch (entityType) {
                case 'LINE':
                    this.readLineEntity(entity);
                    break;
                case 'CIRCLE':
                    this.readCircleEntity(entity);
                    break;
                case 'ARC':
                    this.readArcEntity(entity);
                    break;
                case 'LWPOLYLINE':
                case 'POLYLINE':
                    this.readPolylineEntity(entity);
                    break;
                case 'INSERT':
                    this.readInsertEntity(entity);
                    break;
            }

            // الخصائص المشتركة
            switch (this.currentGroup) {
                case '8': // Layer
                    entity.layer = this.currentValue;
                    break;
                case '62': // Color
                    entity.color = this.dxfColorToHex(parseInt(this.currentValue));
                    break;
                case '6': // Line type
                    entity.lineType = this.currentValue;
                    break;
            }
        }

        this.entities.push(entity);
    }

    readLineEntity(entity) {
        while (this.currentGroup !== '0') {
            this.readGroup();
            
            switch (this.currentGroup) {
                case '10': entity.startX = parseFloat(this.currentValue); break;
                case '20': entity.startY = parseFloat(this.currentValue); break;
                case '30': entity.startZ = parseFloat(this.currentValue); break;
                case '11': entity.endX = parseFloat(this.currentValue); break;
                case '21': entity.endY = parseFloat(this.currentValue); break;
                case '31': entity.endZ = parseFloat(this.currentValue); break;
            }
        }

        entity.start = {
            x: entity.startX || 0,
            y: entity.startY || 0,
            z: entity.startZ || 0
        };
        entity.end = {
            x: entity.endX || 0,
            y: entity.endY || 0,
            z: entity.endZ || 0
        };
    }

    readCircleEntity(entity) {
        while (this.currentGroup !== '0') {
            this.readGroup();
            
            switch (this.currentGroup) {
                case '10': entity.centerX = parseFloat(this.currentValue); break;
                case '20': entity.centerY = parseFloat(this.currentValue); break;
                case '30': entity.centerZ = parseFloat(this.currentValue); break;
                case '40': entity.radius = parseFloat(this.currentValue); break;
            }
        }

        entity.center = {
            x: entity.centerX || 0,
            y: entity.centerY || 0,
            z: entity.centerZ || 0
        };
    }

    readArcEntity(entity) {
        while (this.currentGroup !== '0') {
            this.readGroup();
            
            switch (this.currentGroup) {
                case '10': entity.centerX = parseFloat(this.currentValue); break;
                case '20': entity.centerY = parseFloat(this.currentValue); break;
                case '30': entity.centerZ = parseFloat(this.currentValue); break;
                case '40': entity.radius = parseFloat(this.currentValue); break;
                case '50': entity.startAngle = parseFloat(this.currentValue) * Math.PI / 180; break;
                case '51': entity.endAngle = parseFloat(this.currentValue) * Math.PI / 180; break;
            }
        }

        entity.center = {
            x: entity.centerX || 0,
            y: entity.centerY || 0,
            z: entity.centerZ || 0
        };
    }

    readPolylineEntity(entity) {
        entity.vertices = [];
        let vertex = null;

        while (this.currentGroup !== '0') {
            this.readGroup();
            
            if (this.currentGroup === '0' && this.currentValue === 'VERTEX') {
                vertex = {};
                this.readVertex(vertex);
                entity.vertices.push(vertex);
            }
        }
        
        entity.points = entity.vertices.map(v => ({
            x: v.x || 0,
            y: v.y || 0,
            z: v.z || 0
        }));
        
        entity.closed = entity.vertices.length > 0 && 
            entity.vertices[0].x === entity.vertices[entity.vertices.length-1].x &&
            entity.vertices[0].y === entity.vertices[entity.vertices.length-1].y;
    }

    readVertex(vertex) {
        while (this.currentGroup !== '0') {
            this.readGroup();
            
            switch (this.currentGroup) {
                case '10': vertex.x = parseFloat(this.currentValue); break;
                case '20': vertex.y = parseFloat(this.currentValue); break;
                case '30': vertex.z = parseFloat(this.currentValue); break;
            }
        }
    }

    readInsertEntity(entity) {
        while (this.currentGroup !== '0') {
            this.readGroup();
            
            switch (this.currentGroup) {
                case '2': entity.blockName = this.currentValue; break;
                case '10': entity.insertX = parseFloat(this.currentValue); break;
                case '20': entity.insertY = parseFloat(this.currentValue); break;
                case '30': entity.insertZ = parseFloat(this.currentValue); break;
                case '41': entity.scaleX = parseFloat(this.currentValue); break;
                case '42': entity.scaleY = parseFloat(this.currentValue); break;
                case '43': entity.scaleZ = parseFloat(this.currentValue); break;
                case '50': entity.rotation = parseFloat(this.currentValue) * Math.PI / 180; break;
            }
        }

        entity.insertPoint = {
            x: entity.insertX || 0,
            y: entity.insertY || 0,
            z: entity.insertZ || 0
        };
    }

    dxfColorToHex(colorNum) {
        // ألوان DXF الأساسية
        const colors = {
            1: 0xff0000, // Red
            2: 0xffff00, // Yellow
            3: 0x00ff00, // Green
            4: 0x00ffff, // Cyan
            5: 0x0000ff, // Blue
            6: 0xff00ff, // Magenta
            7: 0xffffff, // White/Black
            8: 0x808080, // Gray
        };
        
        return colors[colorNum] || 0xcccccc;
    }
}
