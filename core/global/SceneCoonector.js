// =======================================
// ACTUAL CONSTRUCTION OS - SCENE CONNECTOR
// =======================================

export class SceneConnector {
    constructor(geoRef) {
        this.geoRef = geoRef;
        this.scenes = new Map();
        this.connections = [];
        this.globalSystem = null;
    }

    // ربط مع النظام العالمي
    setGlobalSystem(globalSystem) {
        this.globalSystem = globalSystem;
    }

    // إضافة مشهد مع إحداثياته الحقيقية
    addScene(sceneId, realWorldPosition, rotation = 0, bounds = null) {
        const localOrigin = this.geoRef.worldToPhoto(realWorldPosition);
        
        this.scenes.set(sceneId, {
            id: sceneId,
            realWorldPosition: { ...realWorldPosition },
            rotation: rotation,
            localOrigin: localOrigin,
            bounds: bounds || {
                min: { x: -10, y: -10, z: -10 },
                max: { x: 10, y: 10, z: 10 }
            },
            globalEntities: new Set(),
            created: new Date().toISOString()
        });
        
        console.log(`📌 تم إضافة مشهد ${sceneId} بموقع (${realWorldPosition.x?.toFixed(2)}, ${realWorldPosition.y?.toFixed(2)}, ${realWorldPosition.z?.toFixed(2)})`);
        
        return this.scenes.get(sceneId);
    }

    // تحديث موقع مشهد
    updateScenePosition(sceneId, realWorldPosition) {
        const scene = this.scenes.get(sceneId);
        if (!scene) return false;
        
        scene.realWorldPosition = { ...realWorldPosition };
        scene.localOrigin = this.geoRef.worldToPhoto(realWorldPosition);
        scene.updated = new Date().toISOString();
        
        console.log(`🔄 تم تحديث موقع المشهد ${sceneId}`);
        return true;
    }

    // تحويل نقطة من مشهد إلى مشهد آخر
    transformPoint(point, fromSceneId, toSceneId) {
        const fromScene = this.scenes.get(fromSceneId);
        const toScene = this.scenes.get(toSceneId);
        
        if (!fromScene || !toScene) {
            console.warn('⚠️ مشهد غير موجود');
            return point;
        }

        // تحويل إلى العالم الحقيقي
        const worldPoint = {
            x: point.x + fromScene.realWorldPosition.x,
            y: point.y + fromScene.realWorldPosition.y,
            z: point.z + fromScene.realWorldPosition.z
        };

        // تحويل إلى المشهد الآخر
        return {
            x: worldPoint.x - toScene.realWorldPosition.x,
            y: worldPoint.y - toScene.realWorldPosition.y,
            z: worldPoint.z - toScene.realWorldPosition.z
        };
    }

    // تحويل نقطة من إحداثيات محلية إلى عالمية
    localToWorld(sceneId, localPoint) {
        const scene = this.scenes.get(sceneId);
        if (!scene) return localPoint;

        return {
            x: localPoint.x + scene.realWorldPosition.x,
            y: localPoint.y + scene.realWorldPosition.y,
            z: localPoint.z + scene.realWorldPosition.z
        };
    }

    // تحويل نقطة من عالمية إلى محلية
    worldToLocal(sceneId, worldPoint) {
        const scene = this.scenes.get(sceneId);
        if (!scene) return worldPoint;

        return {
            x: worldPoint.x - scene.realWorldPosition.x,
            y: worldPoint.y - scene.realWorldPosition.y,
            z: worldPoint.z - scene.realWorldPosition.z
        };
    }

    // حساب المسافة بين مشهدين
    getDistanceBetweenScenes(sceneId1, sceneId2) {
        const s1 = this.scenes.get(sceneId1);
        const s2 = this.scenes.get(sceneId2);
        
        if (!s1 || !s2) return 0;

        return Math.sqrt(
            Math.pow(s2.realWorldPosition.x - s1.realWorldPosition.x, 2) +
            Math.pow(s2.realWorldPosition.y - s1.realWorldPosition.y, 2) +
            Math.pow(s2.realWorldPosition.z - s1.realWorldPosition.z, 2)
        );
    }

    // إنشاء نقاط انتقال تلقائية
    createAutomaticHotspots(threshold = 15) {
        const hotspots = [];
        const sceneArray = Array.from(this.scenes.entries());
        
        for (let i = 0; i < sceneArray.length; i++) {
            const [id1, scene1] = sceneArray[i];
            
            for (let j = i + 1; j < sceneArray.length; j++) {
                const [id2, scene2] = sceneArray[j];
                
                const distance = this.getDistanceBetweenScenes(id1, id2);
                
                // إذا كانت المسافة أقل من threshold، أنشئ نقاط انتقال
                if (distance < threshold) {
                    // نقطة انتقال من 1 إلى 2
                    hotspots.push({
                        id: `hotspot_${id1}_to_${id2}`,
                        type: 'SCENE',
                        position: this.calculateMidPoint(scene1.realWorldPosition, scene2.realWorldPosition),
                        localPosition: this.worldToLocal(id1, this.calculateMidPoint(scene1.realWorldPosition, scene2.realWorldPosition)),
                        data: {
                            targetSceneId: id2,
                            targetSceneName: `المشهد ${id2}`,
                            distance: distance.toFixed(2),
                            description: `انتقال إلى المشهد ${id2} (${distance.toFixed(2)} م)`
                        }
                    });
                    
                    // نقطة انتقال من 2 إلى 1
                    hotspots.push({
                        id: `hotspot_${id2}_to_${id1}`,
                        type: 'SCENE',
                        position: this.calculateMidPoint(scene2.realWorldPosition, scene1.realWorldPosition),
                        localPosition: this.worldToLocal(id2, this.calculateMidPoint(scene2.realWorldPosition, scene1.realWorldPosition)),
                        data: {
                            targetSceneId: id1,
                            targetSceneName: `المشهد ${id1}`,
                            distance: distance.toFixed(2),
                            description: `انتقال إلى المشهد ${id1} (${distance.toFixed(2)} م)`
                        }
                    });
                    
                    console.log(`🔗 تم إنشاء نقاط انتقال بين ${id1} و ${id2} (${distance.toFixed(2)} م)`);
                }
            }
        }
        
        return hotspots;
    }

    calculateMidPoint(p1, p2) {
        return {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2,
            z: (p1.z + p2.z) / 2
        };
    }

    // ربط مشهدين بنقطة اتصال محددة
    connectScenes(sceneId1, sceneId2, connectionPoint, type = 'door') {
        const scene1 = this.scenes.get(sceneId1);
        const scene2 = this.scenes.get(sceneId2);
        
        if (!scene1 || !scene2) {
            console.error('❌ مشهد غير موجود');
            return null;
        }

        const connection = {
            id: `conn_${sceneId1}_${sceneId2}_${Date.now()}`,
            from: sceneId1,
            to: sceneId2,
            point: { ...connectionPoint },
            localPoint1: this.worldToLocal(sceneId1, connectionPoint),
            localPoint2: this.worldToLocal(sceneId2, connectionPoint),
            type: type,
            distance: this.getDistanceBetweenScenes(sceneId1, sceneId2),
            createdAt: new Date().toISOString()
        };

        this.connections.push(connection);
        
        console.log(`🔗 تم ربط المشاهد ${sceneId1} و ${sceneId2} عبر ${type}`);
        
        return connection;
    }

    // الحصول على جميع المشاهد المتصلة بمشهد معين
    getConnectedScenes(sceneId) {
        const connected = [];
        
        this.connections.forEach(conn => {
            if (conn.from === sceneId) {
                connected.push({
                    sceneId: conn.to,
                    connection: conn
                });
            }
            if (conn.to === sceneId) {
                connected.push({
                    sceneId: conn.from,
                    connection: conn
                });
            }
        });
        
        return connected;
    }

    // الحصول على موقع المشهد
    getScenePosition(sceneId) {
        return this.scenes.get(sceneId)?.realWorldPosition || null;
    }

    // الحصول على جميع المشاهد
    getAllScenes() {
        return Array.from(this.scenes.entries()).map(([id, scene]) => ({
            id,
            position: scene.realWorldPosition,
            rotation: scene.rotation,
            bounds: scene.bounds,
            globalEntities: Array.from(scene.globalEntities)
        }));
    }

    // ربط كيان عالمي بمشهد
    addGlobalEntityToScene(sceneId, entityId) {
        const scene = this.scenes.get(sceneId);
        if (!scene) return false;
        
        scene.globalEntities.add(entityId);
        return true;
    }

    // إزالة كيان عالمي من مشهد
    removeGlobalEntityFromScene(sceneId, entityId) {
        const scene = this.scenes.get(sceneId);
        if (!scene) return false;
        
        return scene.globalEntities.delete(entityId);
    }

    // الحصول على الكيانات العالمية في مشهد
    getGlobalEntitiesInScene(sceneId) {
        const scene = this.scenes.get(sceneId);
        if (!scene) return [];
        
        return Array.from(scene.globalEntities);
    }

    // إنشاء خريطة المشاهد
    createSceneMap() {
        const map = {
            scenes: [],
            connections: []
        };
        
        this.scenes.forEach((scene, id) => {
            map.scenes.push({
                id: id,
                position: scene.realWorldPosition,
                rotation: scene.rotation
            });
        });
        
        this.connections.forEach(conn => {
            map.connections.push({
                from: conn.from,
                to: conn.to,
                type: conn.type,
                distance: conn.distance
            });
        });
        
        return map;
    }

    // تصدير للاستخدام في ACTUAL VIEW STUDIO
    exportForViewer() {
        const hotspots = this.createAutomaticHotspots();
        
        return {
            scenes: Array.from(this.scenes.entries()).map(([id, scene]) => ({
                id: id,
                name: `مشهد ${id}`,
                position: scene.realWorldPosition,
                rotation: scene.rotation,
                bounds: scene.bounds,
                hotspots: hotspots.filter(h => h.data.targetSceneId === id || h.data.targetSceneId === id)
            })),
            connections: this.connections.map(conn => ({
                from: conn.from,
                to: conn.to,
                point: conn.point,
                type: conn.type,
                distance: conn.distance
            }))
        };
    }
}
