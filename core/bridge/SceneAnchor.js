// =======================================
// ACTUAL CONSTRUCTION OS - SCENE ANCHOR
// =======================================
// مرتكز المشهد - يربط الكيان العالمي بموقع في مشهد معين

export class SceneAnchor {
    constructor(entity, sceneId, localPosition) {
        this.id = `anchor_${entity.id}_${sceneId}_${Date.now()}`;
        this.entityId = entity.id;
        this.entityType = entity.type;
        this.sceneId = sceneId;
        
        this.localPosition = { ...localPosition };
        this.worldPosition = null; // يحسب لاحقاً
        
        this.transform = {
            rotation: 0,
            scale: 1.0
        };
        
        this.metadata = {
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            version: 1
        };
    }

    // تحديث الموقع من الإحداثيات العالمية
    updateFromWorld(worldPosition, sceneConnector) {
        this.worldPosition = { ...worldPosition };
        this.localPosition = sceneConnector.worldToLocal(this.sceneId, worldPosition);
        this.metadata.updated = new Date().toISOString();
        this.metadata.version++;
    }

    // تحديث الموقع من الإحداثيات المحلية
    updateFromLocal(localPosition, sceneConnector) {
        this.localPosition = { ...localPosition };
        this.worldPosition = sceneConnector.localToWorld(this.sceneId, localPosition);
        this.metadata.updated = new Date().toISOString();
        this.metadata.version++;
    }

    // ربط بكيان محدث
    updateFromEntity(entity) {
        // تحديث خصائص الكيان إذا تغيرت
        this.metadata.updated = new Date().toISOString();
        this.metadata.version++;
    }

    // حساب المسافة من نقطة
    distanceTo(point) {
        return Math.sqrt(
            Math.pow(point.x - this.localPosition.x, 2) +
            Math.pow(point.y - this.localPosition.y, 2) +
            Math.pow(point.z - this.localPosition.z, 2)
        );
    }

    // تحويل إلى JSON للتخزين
    toJSON() {
        return {
            id: this.id,
            entityId: this.entityId,
            entityType: this.entityType,
            sceneId: this.sceneId,
            localPosition: this.localPosition,
            worldPosition: this.worldPosition,
            transform: this.transform,
            metadata: this.metadata
        };
    }

    // إنشاء من JSON
    static fromJSON(json, sceneConnector) {
        const anchor = new SceneAnchor(
            { id: json.entityId, type: json.entityType },
            json.sceneId,
            json.localPosition
        );
        anchor.id = json.id;
        anchor.worldPosition = json.worldPosition;
        anchor.transform = json.transform;
        anchor.metadata = json.metadata;
        return anchor;
    }
}
