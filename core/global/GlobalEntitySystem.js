// =======================================
// ACTUAL VIEW CONSTRUCTION OS - GLOBAL ENTITY SYSTEM
// =======================================

export class GlobalEntitySystem {
    constructor(geoReferencing) {
        this.geoRef = geoReferencing;
        this.entities = new Map();
        this.entityCounter = 0;
        this.segments = new Map();
        console.log('✅ GlobalEntitySystem initialized');
    }

    /**
     * إنشاء كيان جديد
     * @param {string} type - نوع الكيان (wall, column, beam, etc.)
     * @param {Object} data - بيانات الكيان
     * @returns {string} معرف الكيان
     */
    createEntity(type, data = {}) {
        const entityId = `entity_${++this.entityCounter}_${Date.now()}`;
        
        const entity = {
            id: entityId,
            type: type,
            data: {
                ...data,
                created: data.created || new Date().toISOString(),
                updated: new Date().toISOString()
            },
            scenes: new Map(), // المشاهد التي يوجد فيها الكيان
            segments: [], // الأجزاء المكونة للكيان
            metadata: {
                version: 1,
                createdAt: new Date().toISOString(),
                createdBy: 'system'
            }
        };
        
        this.entities.set(entityId, entity);
        console.log(`📌 Created entity: ${entityId} (${type})`);
        
        return entityId;
    }

    /**
     * إضافة جزء من الكيان إلى مشهد
     * @param {string} entityId - معرف الكيان
     * @param {string} sceneId - معرف المشهد
     * @param {Object} segmentData - بيانات الجزء
     */
    addSegment(entityId, sceneId, segmentData) {
        const entity = this.entities.get(entityId);
        if (!entity) {
            console.error(`❌ Entity ${entityId} not found`);
            return false;
        }
        
        const segmentId = `segment_${Date.now()}_${Math.random()}`;
        const segment = {
            id: segmentId,
            sceneId: sceneId,
            data: segmentData,
            addedAt: new Date().toISOString()
        };
        
        if (!entity.segments) entity.segments = [];
        entity.segments.push(segment);
        
        if (!entity.scenes.has(sceneId)) {
            entity.scenes.set(sceneId, []);
        }
        entity.scenes.get(sceneId).push(segmentId);
        
        // تحديث metadata
        entity.data.updated = new Date().toISOString();
        entity.metadata.version++;
        
        console.log(`➕ Added segment ${segmentId} to entity ${entityId} in scene ${sceneId}`);
        return segmentId;
    }

    /**
     * إزالة جزء من الكيان
     * @param {string} entityId - معرف الكيان
     * @param {string} sceneId - معرف المشهد
     * @param {string} segmentId - معرف الجزء
     */
    removeSegment(entityId, sceneId, segmentId) {
        const entity = this.entities.get(entityId);
        if (!entity) return false;
        
        const index = entity.segments.findIndex(s => s.id === segmentId && s.sceneId === sceneId);
        if (index !== -1) {
            entity.segments.splice(index, 1);
            
            if (entity.scenes.has(sceneId)) {
                const segments = entity.scenes.get(sceneId);
                const segIndex = segments.indexOf(segmentId);
                if (segIndex !== -1) segments.splice(segIndex, 1);
                if (segments.length === 0) entity.scenes.delete(sceneId);
            }
            
            entity.data.updated = new Date().toISOString();
            console.log(`➖ Removed segment ${segmentId} from entity ${entityId}`);
            return true;
        }
        
        return false;
    }

    /**
     * الحصول على جميع أجزاء الكيان في مشهد معين
     * @param {string} sceneId - معرف المشهد
     * @returns {Array} أجزاء الكيان في المشهد
     */
    getSceneEntities(sceneId) {
        const result = [];
        
        for (const [entityId, entity] of this.entities) {
            if (entity.scenes.has(sceneId)) {
                const sceneSegments = entity.segments.filter(s => s.sceneId === sceneId);
                result.push({
                    entityId: entityId,
                    entity: entity,
                    segments: sceneSegments
                });
            }
        }
        
        return result;
    }

    /**
     * الحصول على جميع الكيانات
     * @returns {Array} قائمة الكيانات
     */
    getAllEntities() {
        return Array.from(this.entities.values());
    }

    /**
     * الحصول على كيان بواسطة معرفه
     * @param {string} entityId - معرف الكيان
     * @returns {Object|null} الكيان أو null
     */
    getEntity(entityId) {
        return this.entities.get(entityId) || null;
    }

    /**
     * تحديث بيانات كيان
     * @param {string} entityId - معرف الكيان
     * @param {Object} newData - البيانات الجديدة
     */
    updateEntity(entityId, newData) {
        const entity = this.entities.get(entityId);
        if (!entity) return false;
        
        entity.data = {
            ...entity.data,
            ...newData,
            updated: new Date().toISOString()
        };
        entity.metadata.version++;
        
        console.log(`🔄 Updated entity ${entityId}`);
        return true;
    }

    /**
     * حذف كيان
     * @param {string} entityId - معرف الكيان
     */
    deleteEntity(entityId) {
        const entity = this.entities.get(entityId);
        if (!entity) return false;
        
        this.entities.delete(entityId);
        console.log(`🗑️ Deleted entity ${entityId}`);
        return true;
    }

    /**
     * ربط كيان بآخر
     * @param {string} sourceEntityId - الكيان المصدر
     * @param {string} targetEntityId - الكيان الهدف
     * @param {string} relationType - نوع العلاقة
     */
    linkEntities(sourceEntityId, targetEntityId, relationType = 'reference') {
        const source = this.entities.get(sourceEntityId);
        const target = this.entities.get(targetEntityId);
        
        if (!source || !target) {
            console.error('❌ One or both entities not found');
            return false;
        }
        
        if (!source.links) source.links = [];
        source.links.push({
            targetId: targetEntityId,
            type: relationType,
            createdAt: new Date().toISOString()
        });
        
        if (!target.links) target.links = [];
        target.links.push({
            targetId: sourceEntityId,
            type: relationType,
            createdAt: new Date().toISOString()
        });
        
        console.log(`🔗 Linked ${sourceEntityId} ↔ ${targetEntityId} (${relationType})`);
        return true;
    }

    /**
     * الحصول على إحصائيات النظام
     * @returns {Object} إحصائيات
     */
    getStats() {
        const byType = {};
        let totalSegments = 0;
        let totalScenes = new Set();
        
        for (const entity of this.entities.values()) {
            byType[entity.type] = (byType[entity.type] || 0) + 1;
            totalSegments += entity.segments?.length || 0;
            entity.scenes.forEach((_, sceneId) => totalScenes.add(sceneId));
        }
        
        return {
            totalEntities: this.entities.size,
            totalSegments: totalSegments,
            totalScenes: totalScenes.size,
            byType: byType,
            version: '1.0'
        };
    }

    /**
     * تصدير جميع البيانات
     * @returns {Object} بيانات النظام
     */
    exportData() {
        return {
            entities: Array.from(this.entities.entries()),
            stats: this.getStats(),
            exportedAt: new Date().toISOString()
        };
    }

    /**
     * استيراد بيانات
     * @param {Object} data - البيانات المستوردة
     */
    importData(data) {
        if (data.entities) {
            this.entities.clear();
            this.entityCounter = 0;
            
            for (const [id, entity] of data.entities) {
                this.entities.set(id, entity);
                const num = parseInt(id.split('_')[1]);
                if (num > this.entityCounter) this.entityCounter = num;
            }
            
            console.log(`📥 Imported ${this.entities.size} entities`);
        }
    }

    /**
     * إضافة عنصر إلى مشهد (اختصار)
     * @param {string} sceneId - معرف المشهد
     * @param {Object} element - العنصر
     */
    addElementToScene(sceneId, element) {
        const entityId = this.createEntity(element.type || 'element', element);
        this.addSegment(entityId, sceneId, {
            position: element.position,
            rotation: element.rotation,
            data: element
        });
        return entityId;
    }
}
