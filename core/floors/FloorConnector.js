// =======================================
// ACTUAL VIEW CONSTRUCTION OS - FLOOR CONNECTOR
// =======================================

export class FloorConnector {
    constructor(globalSystem, sceneConnector) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        this.floors = new Map();
        this.connections = [];
        console.log('✅ FloorConnector initialized');
    }

    // إضافة طابق جديد
    addFloor(floorId, level, sceneId, elevation = 0) {
        const floor = {
            id: floorId,
            level: level,
            sceneId: sceneId,
            elevation: elevation,
            elements: [],
            connections: [],
            createdAt: new Date().toISOString()
        };
        
        this.floors.set(floorId, floor);
        console.log(`📌 تم إضافة طابق ${floorId} في المستوى ${level}`);
        return floor;
    }

    // ربط طابقين
    connectFloors(floorFrom, floorTo, connectionType = 'stairs', options = {}) {
        const connection = {
            id: `conn-${Date.now()}-${this.connections.length}`,
            from: floorFrom,
            to: floorTo,
            type: connectionType,
            options: {
                width: options.width || 1.2,
                height: options.height || 2.5,
                location: options.location || { x: 0, y: 0, z: 0 },
                ...options
            },
            createdAt: new Date().toISOString()
        };
        
        this.connections.push(connection);
        
        // تحديث connections في كلا الطابقين
        const floorFromObj = this.floors.get(floorFrom);
        const floorToObj = this.floors.get(floorTo);
        
        if (floorFromObj) {
            floorFromObj.connections.push(connection.id);
        }
        if (floorToObj) {
            floorToObj.connections.push(connection.id);
        }
        
        console.log(`🔗 تم ربط ${floorFrom} و ${floorTo} via ${connectionType}`);
        return connection;
    }

    // الحصول على الطابق في مستوى معين
    getFloorAtLevel(level) {
        for (const [id, floor] of this.floors) {
            if (floor.level === level) return floor;
        }
        return null;
    }

    // الحصول على جميع الطوابق في مشهد معين
    getFloorsInScene(sceneId) {
        const result = [];
        for (const [id, floor] of this.floors) {
            if (floor.sceneId === sceneId) {
                result.push(floor);
            }
        }
        return result;
    }

    // الحصول على الطابق العلوي
    getUpperFloor(floorId) {
        const currentFloor = this.floors.get(floorId);
        if (!currentFloor) return null;
        
        let upperFloor = null;
        let minLevelDiff = Infinity;
        
        for (const [id, floor] of this.floors) {
            if (floor.level > currentFloor.level && 
                floor.level - currentFloor.level < minLevelDiff) {
                upperFloor = floor;
                minLevelDiff = floor.level - currentFloor.level;
            }
        }
        
        return upperFloor;
    }

    // الحصول على الطابق السفلي
    getLowerFloor(floorId) {
        const currentFloor = this.floors.get(floorId);
        if (!currentFloor) return null;
        
        let lowerFloor = null;
        let minLevelDiff = Infinity;
        
        for (const [id, floor] of this.floors) {
            if (floor.level < currentFloor.level && 
                currentFloor.level - floor.level < minLevelDiff) {
                lowerFloor = floor;
                minLevelDiff = currentFloor.level - floor.level;
            }
        }
        
        return lowerFloor;
    }

    // نسخ عناصر من طابق لآخر
    copyElements(sourceFloorId, targetFloorId, heightOffset = 3.0) {
        const sourceFloor = this.floors.get(sourceFloorId);
        const targetFloor = this.floors.get(targetFloorId);
        
        if (!sourceFloor || !targetFloor) {
            console.error('❌ طابق غير موجود');
            return [];
        }
        
        // الحصول على عناصر المصدر من sceneConnector
        const sourceElements = this.sceneConnector.getElementsInScene(sourceFloor.sceneId) || [];
        const copiedElements = [];
        
        for (const element of sourceElements) {
            // نسخ العنصر مع تغيير الارتفاع
            const copy = {
                ...element,
                id: `${element.id}-copy-${Date.now()}`,
                position: {
                    ...element.position,
                    y: element.position.y + heightOffset
                }
            };
            
            // إضافة النسخة للمشهد الهدف
            this.sceneConnector.addElement(targetFloor.sceneId, copy);
            copiedElements.push(copy);
        }
        
        console.log(`📋 تم نسخ ${copiedElements.length} عنصر من ${sourceFloorId} إلى ${targetFloorId}`);
        return copiedElements;
    }

    // حذف طابق
    removeFloor(floorId) {
        const floor = this.floors.get(floorId);
        if (!floor) return false;
        
        // حذف connections المرتبطة
        this.connections = this.connections.filter(conn => 
            conn.from !== floorId && conn.to !== floorId
        );
        
        // حذف الطابق
        this.floors.delete(floorId);
        console.log(`🗑️ تم حذف الطابق ${floorId}`);
        return true;
    }

    // الحصول على جميع الطوابق
    getAllFloors() {
        return Array.from(this.floors.values());
    }

    // الحصول على إحصائيات
    getStats() {
        return {
            totalFloors: this.floors.size,
            totalConnections: this.connections.length,
            floorsByLevel: Array.from(this.floors.values()).reduce((acc, floor) => {
                acc[floor.level] = (acc[floor.level] || 0) + 1;
                return acc;
            }, {})
        };
    }
}
