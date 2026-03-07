// =======================================
// ACTUAL CONSTRUCTION OS - TILE LOD MANAGER
// =======================================
// إدارة LOD ديناميكية لكل Tile

export class TileLODManager {
    constructor(camera, options = {}) {
        this.camera = camera;
        
        this.lodLevels = {
            high: { distance: 10, quality: 1.0, priority: 3 },
            medium: { distance: 30, quality: 0.5, priority: 2 },
            low: { distance: 100, quality: 0.25, priority: 1 },
            culled: { distance: Infinity, quality: 0, priority: 0 }
        };

        this.tiles = new Map();
        this.updateQueue = [];
        this.updating = false;
    }

    // إضافة Tile للمراقبة
    addTile(tileId, tile, position) {
        this.tiles.set(tileId, {
            id: tileId,
            tile: tile,
            position: position.clone(),
            currentLOD: 'high',
            lastUpdate: Date.now(),
            priority: 1
        });
    }

    // تحديث LOD لجميع الـ Tiles
    update() {
        if (!this.camera) return;

        const updates = [];

        this.tiles.forEach((tileData, id) => {
            const distance = this.camera.position.distanceTo(tileData.position);
            const newLOD = this.getLODForDistance(distance);
            
            if (newLOD !== tileData.currentLOD) {
                tileData.currentLOD = newLOD;
                tileData.priority = this.lodLevels[newLOD].priority;
                updates.push(id);
            }
        });

        // معالجة التحديثات
        if (updates.length > 0) {
            this.queueUpdates(updates);
        }
    }

    // الحصول على LOD المناسب للمسافة
    getLODForDistance(distance) {
        for (const [level, config] of Object.entries(this.lodLevels)) {
            if (distance < config.distance) {
                return level;
            }
        }
        return 'culled';
    }

    // تحديث LOD لمجموعة من الـ Tiles
    async queueUpdates(tileIds) {
        this.updateQueue.push(...tileIds);
        
        if (!this.updating) {
            this.updating = true;
            await this.processUpdates();
            this.updating = false;
        }
    }

    async processUpdates() {
        while (this.updateQueue.length > 0) {
            const batch = this.updateQueue.splice(0, 5); // 5 تحديثات في المرة
            
            await Promise.all(batch.map(id => {
                const tileData = this.tiles.get(id);
                if (tileData) {
                    return this.applyLOD(tileData);
                }
            }));

            // تأخير بسيط لمنع تجميد المتصفح
            await new Promise(r => setTimeout(r, 50));
        }
    }

    async applyLOD(tileData) {
        const lod = tileData.currentLOD;
        const config = this.lodLevels[lod];

        if (lod === 'culled') {
            tileData.tile.visible = false;
            return;
        }

        // تغيير جودة الصورة
        if (tileData.tile.material) {
            const newQuality = config.quality;
            // تطبيق الجودة الجديدة
            tileData.tile.material.map.anisotropy = Math.floor(16 * newQuality);
        }

        tileData.tile.visible = true;
        tileData.lastUpdate = Date.now();

        console.log(`🔄 Tile ${tileData.id} → LOD: ${lod}`);
    }

    // حذف Tile
    removeTile(tileId) {
        this.tiles.delete(tileId);
        const index = this.updateQueue.indexOf(tileId);
        if (index > -1) {
            this.updateQueue.splice(index, 1);
        }
    }

    // ضبط مسافات LOD
    setLODDistances(high, medium, low) {
        this.lodLevels.high.distance = high;
        this.lodLevels.medium.distance = medium;
        this.lodLevels.low.distance = low;
    }

    // الحصول على إحصائيات
    getStats() {
        const stats = {
            high: 0,
            medium: 0,
            low: 0,
            culled: 0,
            total: this.tiles.size
        };

        this.tiles.forEach(tile => {
            stats[tile.currentLOD]++;
        });

        return stats;
    }
}
