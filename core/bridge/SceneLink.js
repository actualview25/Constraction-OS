// =======================================
// ACTUAL CONSTRUCTION OS - SCENE LINK
// =======================================
// رابط بين مشهدين - يمثل اتصالاً حقيقياً

export class SceneLink {
    constructor(fromSceneId, toSceneId, connectionPoint, type = 'door') {
        this.id = `link_${fromSceneId}_${toSceneId}_${Date.now()}`;
        this.fromSceneId = fromSceneId;
        this.toSceneId = toSceneId;
        
        this.connectionPoint = { ...connectionPoint };
        this.type = type; // door, window, hallway, stair
        
        this.properties = {
            bidirectional: true,
            passable: true,
            width: type === 'door' ? 0.9 : (type === 'window' ? 1.5 : 2.0),
            height: type === 'door' ? 2.1 : (type === 'window' ? 1.5 : 2.4)
        };
        
        this.metadata = {
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            description: this.getDefaultDescription()
        };
    }

    getDefaultDescription() {
        const descriptions = {
            door: 'باب',
            window: 'شباك',
            hallway: 'ممر',
            stair: 'درج'
        };
        return descriptions[this.type] || 'اتصال';
    }

    // حساب المسافة بين المشهدين
    calculateDistance(sceneConnector) {
        const fromScene = sceneConnector.scenes.get(this.fromSceneId);
        const toScene = sceneConnector.scenes.get(this.toSceneId);
        
        if (!fromScene || !toScene) return 0;
        
        return Math.sqrt(
            Math.pow(toScene.realWorldPosition.x - fromScene.realWorldPosition.x, 2) +
            Math.pow(toScene.realWorldPosition.y - fromScene.realWorldPosition.y, 2) +
            Math.pow(toScene.realWorldPosition.z - fromScene.realWorldPosition.z, 2)
        );
    }

    // إنشاء نقاط انتقال
    createHotspots(sceneConnector) {
        const hotspots = [];
        
        // نقطة انتقال من الأول إلى الثاني
        hotspots.push({
            id: `hotspot_${this.id}_to_${this.toSceneId}`,
            type: 'SCENE',
            position: this.connectionPoint,
            localPosition: sceneConnector.worldToLocal(this.fromSceneId, this.connectionPoint),
            data: {
                targetSceneId: this.toSceneId,
                targetSceneName: `المشهد ${this.toSceneId}`,
                description: `انتقال عبر ${this.metadata.description}`
            }
        });

        // إذا كان الرابط ثنائي الاتجاه
        if (this.properties.bidirectional) {
            hotspots.push({
                id: `hotspot_${this.id}_to_${this.fromSceneId}`,
                type: 'SCENE',
                position: this.connectionPoint,
                localPosition: sceneConnector.worldToLocal(this.toSceneId, this.connectionPoint),
                data: {
                    targetSceneId: this.fromSceneId,
                    targetSceneName: `المشهد ${this.fromSceneId}`,
                    description: `انتقال عبر ${this.metadata.description}`
                }
            });
        }

        return hotspots;
    }

    // تحديث خصائص الرابط
    updateProperties(properties) {
        this.properties = { ...this.properties, ...properties };
        this.metadata.updated = new Date().toISOString();
    }

    // تحويل إلى JSON
    toJSON() {
        return {
            id: this.id,
            fromSceneId: this.fromSceneId,
            toSceneId: this.toSceneId,
            connectionPoint: this.connectionPoint,
            type: this.type,
            properties: this.properties,
            metadata: this.metadata
        };
    }

    // إنشاء من JSON
    static fromJSON(json) {
        const link = new SceneLink(
            json.fromSceneId,
            json.toSceneId,
            json.connectionPoint,
            json.type
        );
        link.id = json.id;
        link.properties = json.properties;
        link.metadata = json.metadata;
        return link;
    }
}
