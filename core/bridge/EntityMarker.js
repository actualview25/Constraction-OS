// =======================================
// ACTUAL CONSTRUCTION OS - ENTITY MARKER
// =======================================
// علامة الكيان في المشهد - للعرض والتفاعل

export class EntityMarker {
    constructor(entity, sceneId, localPosition) {
        this.id = `marker_${entity.id}_${sceneId}_${Date.now()}`;
        this.entityId = entity.id;
        this.entityType = entity.type;
        this.sceneId = sceneId;
        
        this.localPosition = { ...localPosition };
        this.worldPosition = null;
        
        this.properties = {
            visible: true,
            selected: false,
            highlighted: false
        };
        
        this.display = {
            color: this.getDefaultColor(entity.type),
            size: 1.0,
            opacity: 1.0
        };
        
        this.metadata = {
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };
    }

    getDefaultColor(type) {
        const colors = {
            wall: 0x888888,
            column: 0x7a7a7a,
            beam: 0x999999,
            slab: 0xaaaaaa,
            foundation: 0x666666,
            excavation: 0x8B4513,
            electrical: 0xffaa00,
            plumbing: 0x0066cc,
            hvac: 0x00aaff
        };
        return colors[type] || 0xcccccc;
    }

    // تحديث الموقع
    updatePosition(localPosition, sceneConnector) {
        this.localPosition = { ...localPosition };
        this.worldPosition = sceneConnector.localToWorld(this.sceneId, localPosition);
        this.metadata.updated = new Date().toISOString();
    }

    // تحديث من الكيان العالمي
    updateFromEntity(entity) {
        // تحديث خصائص العرض إذا تغيرت خصائص الكيان
        if (entity.data?.color) {
            this.display.color = entity.data.color;
        }
        this.metadata.updated = new Date().toISOString();
    }

    // تفعيل/إلغاء التحديد
    setSelected(selected) {
        this.properties.selected = selected;
        this.display.size = selected ? 1.2 : 1.0;
        this.display.opacity = selected ? 1.0 : 0.8;
    }

    // تفعيل/إلغاء الإضاءة
    setHighlighted(highlighted) {
        this.properties.highlighted = highlighted;
        this.display.size = highlighted ? 1.1 : 1.0;
    }

    // إظهار/إخفاء
    setVisible(visible) {
        this.properties.visible = visible;
    }

    // إنشاء عنصر HTML للعرض
    createHTMLElement() {
        const div = document.createElement('div');
        div.className = 'entity-marker';
        div.setAttribute('data-entity-id', this.entityId);
        div.setAttribute('data-marker-id', this.id);
        
        div.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: #${this.display.color.toString(16).padStart(6, '0')};
            border: 2px solid white;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            cursor: pointer;
            pointer-events: all;
            box-shadow: 0 0 10px currentColor;
            opacity: ${this.display.opacity};
            transition: all 0.2s;
        `;

        div.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log(`📍 تم النقر على العلامة ${this.id}`);
        });

        return div;
    }

    // إنشاء عنصر Three.js للعرض
    createThreeMesh(scene) {
        const geometry = new THREE.SphereGeometry(0.5, 16);
        const material = new THREE.MeshStandardMaterial({
            color: this.display.color,
            emissive: 0x222222,
            transparent: true,
            opacity: this.display.opacity
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(this.localPosition.x, this.localPosition.y, this.localPosition.z);
        mesh.userData = {
            type: 'entity-marker',
            entityId: this.entityId,
            markerId: this.id
        };
        
        return mesh;
    }

    // تحويل إلى JSON
    toJSON() {
        return {
            id: this.id,
            entityId: this.entityId,
            entityType: this.entityType,
            sceneId: this.sceneId,
            localPosition: this.localPosition,
            worldPosition: this.worldPosition,
            properties: this.properties,
            display: this.display,
            metadata: this.metadata
        };
    }

    // إنشاء من JSON
    static fromJSON(json) {
        const marker = new EntityMarker(
            { id: json.entityId, type: json.entityType },
            json.sceneId,
            json.localPosition
        );
        marker.id = json.id;
        marker.worldPosition = json.worldPosition;
        marker.properties = json.properties;
        marker.display = json.display;
        marker.metadata = json.metadata;
        return marker;
    }
}
