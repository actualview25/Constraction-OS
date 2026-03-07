// =======================================
// ACTUAL CONSTRUCTION OS - REALITY BRIDGE
// =======================================
// ربط المشاهد بالكيانات العالمية

export class RealityBridge {
    constructor(globalSystem, sceneConnector, sceneGraph) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        this.sceneGraph = sceneGraph;
        
        this.anchors = new Map();      // SceneAnchor
        this.markers = new Map();       // EntityMarker
        this.links = new Map();         // SceneLink
        
        this.syncManager = new SyncManager(this);
        this.loader = null; // سيتم ربط LazyLoader لاحقاً
        
        console.log('🌉 RealityBridge جاهز');
    }

    // ربط LazyLoader
    setLoader(loader) {
        this.loader = loader;
    }

    // إنشاء مرتكز لكيان في مشهد
    createAnchor(entityId, sceneId, localPosition) {
        const anchor = new SceneAnchor(entityId, sceneId, localPosition);
        const id = `${entityId}_${sceneId}`;
        
        this.anchors.set(id, anchor);
        
        // إنشاء علامة تلقائياً
        this.createMarker(entityId, sceneId, localPosition);
        
        // تحديث الرسم البياني
        this.sceneGraph.addEntityToScene(sceneId, entityId);
        
        console.log(`🔗 تم إنشاء مرتكز: ${id}`);
        return anchor;
    }

    // إنشاء علامة لكيان في مشهد
    createMarker(entityId, sceneId, localPosition) {
        const marker = new EntityMarker(entityId, sceneId, localPosition);
        const id = `${entityId}_${sceneId}`;
        
        this.markers.set(id, marker);
        
        // ربط بالتحميل
        if (this.loader) {
            this.loader.registerMarker(sceneId, marker);
        }
        
        return marker;
    }

    // إنشاء رابط بين مشهدين
    createLink(fromSceneId, toSceneId, connectionPoint, type = 'door') {
        const link = new SceneLink(fromSceneId, toSceneId, connectionPoint, type);
        const id = `${fromSceneId}_${toSceneId}`;
        
        this.links.set(id, link);
        
        // تحديث الرسم البياني
        this.sceneGraph.addEdge(fromSceneId, toSceneId, link.getDistance(), type);
        
        // إنشاء نقاط انتقال تلقائية
        this.createHotspotsFromLink(link);
        
        return link;
    }

    // إنشاء نقاط انتقال من الرابط
    createHotspotsFromLink(link) {
        const fromPos = this.sceneGraph.scenePositions.get(link.fromSceneId);
        const toPos = this.sceneGraph.scenePositions.get(link.toSceneId);
        
        if (!fromPos || !toPos) return;

        // نقطة انتقال من الأول إلى الثاني
        const hotspot1 = {
            id: `hotspot_${link.id}_to_${link.toSceneId}`,
            type: 'SCENE',
            position: link.connectionPoint,
            data: {
                targetSceneId: link.toSceneId,
                targetSceneName: `المشهد ${link.toSceneId}`,
                description: `انتقال عبر ${link.type}`
            }
        };

        // نقطة انتقال من الثاني إلى الأول
        const hotspot2 = {
            id: `hotspot_${link.id}_to_${link.fromSceneId}`,
            type: 'SCENE',
            position: link.connectionPoint,
            data: {
                targetSceneId: link.fromSceneId,
                targetSceneName: `المشهد ${link.fromSceneId}`,
                description: `انتقال عبر ${link.type}`
            }
        };

        // إضافة النقاط للمشاهد
        this.addHotspotToScene(link.fromSceneId, hotspot1);
        this.addHotspotToScene(link.toSceneId, hotspot2);
    }

    // إضافة نقطة لمشهد
    addHotspotToScene(sceneId, hotspot) {
        const scene = this.sceneConnector.scenes.get(sceneId);
        if (!scene) return;

        if (!scene.hotspots) scene.hotspots = [];
        scene.hotspots.push(hotspot);
        
        // تحديث الرسم البياني
        this.sceneGraph.addHotspot(sceneId, hotspot);
    }

    // مزامنة كيان مع جميع المشاهد
    async syncEntity(entityId) {
        const entity = this.globalSystem.getCompleteEntity(entityId);
        if (!entity) return;

        // مزامنة جميع المرتكزات
        entity.segments.forEach((segment, sceneId) => {
            const id = `${entityId}_${sceneId}`;
            const anchor = this.anchors.get(id);
            
            if (anchor) {
                anchor.updateFromEntity(entity);
            }
        });

        // مزامنة مع SyncManager
        await this.syncManager.syncEntity(entityId);
    }

    // الحصول على كيان في مشهد معين
    getEntityInScene(entityId, sceneId) {
        const id = `${entityId}_${sceneId}`;
        return {
            anchor: this.anchors.get(id),
            marker: this.markers.get(id)
        };
    }

    // الحصول على جميع الكيانات في مشهد
    getEntitiesInScene(sceneId) {
        const entities = [];
        
        this.anchors.forEach((anchor, id) => {
            if (id.endsWith(`_${sceneId}`)) {
                entities.push({
                    entityId: anchor.entityId,
                    anchor: anchor,
                    marker: this.markers.get(id)
                });
            }
        });
        
        return entities;
    }

    // تحديث موقع كيان
    updateEntityPosition(entityId, sceneId, newPosition) {
        const id = `${entityId}_${sceneId}`;
        const anchor = this.anchors.get(id);
        const marker = this.markers.get(id);
        
        if (anchor) {
            anchor.updatePosition(newPosition, this.sceneConnector);
        }
        
        if (marker) {
            marker.updatePosition(newPosition, this.sceneConnector);
        }
        
        // طلب مزامنة
        this.syncManager.queueSync(entityId);
    }

    // حذف كيان من مشهد
    removeEntityFromScene(entityId, sceneId) {
        const id = `${entityId}_${sceneId}`;
        
        this.anchors.delete(id);
        this.markers.delete(id);
        this.sceneGraph.removeEntityFromScene(sceneId, entityId);
        
        console.log(`🗑️ تم حذف الكيان ${entityId} من المشهد ${sceneId}`);
    }

    // تصدير للعرض
    exportForViewer() {
        return {
            anchors: Array.from(this.anchors.values()).map(a => a.toJSON()),
            markers: Array.from(this.markers.values()).map(m => m.toJSON()),
            links: Array.from(this.links.values()).map(l => l.toJSON()),
            syncStatus: this.syncManager.getStatus()
        };
    }
}
