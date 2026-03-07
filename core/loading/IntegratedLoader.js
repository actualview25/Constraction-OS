// =======================================
// ACTUAL CONSTRUCTION OS - INTEGRATED LOADER FINAL
// =======================================
// نظام تحميل موحد مع تحسينات ذكية

export class IntegratedLoader {
    constructor(sceneGraph, storage, camera, analytics) {
        this.sceneGraph = sceneGraph;
        this.storage = storage;
        this.camera = camera;
        this.analytics = analytics;
        
        // أنظمة التحميل
        this.lazyLoader = new LazySceneLoader(sceneGraph, storage);
        this.segmentedLoader = new SegmentedSceneLoader();
        this.lodManager = new LODManager(camera);
        
        // أنظمة التخزين
        this.cache = new Map();
        this.pending = new Map();
        this.tileCache = new Map();
        
        // إحصائيات
        this.stats = {
            scenesLoaded: 0,
            tilesLoaded: 0,
            tilesCached: 0,
            cacheHits: 0,
            cacheMisses: 0,
            preloadCount: 0,
            memoryUsage: 0,
            fps: 60,
            avgLoadTime: 0
        };

        // إعدادات قابلة للتعديل
        this.settings = {
            maxLoadedScenes: 5,
            maxLoadedTiles: 20,
            preloadRadius: 2,
            lodDistances: { high: 10, medium: 30, low: 100 },
            enableCache: true,
            enablePreload: true,
            enableAnalytics: true
        };

        this.startMonitoring();
    }

    // ==================== التحميل الموحد ====================

    async loadScene(sceneId, options = {}) {
        const startTime = performance.now();
        console.log(`🎯 [Phase 1] بدء تحميل المشهد ${sceneId}...`);

        // Phase 1: التحقق من الكاش
        if (this.settings.enableCache && this.cache.has(sceneId)) {
            this.stats.cacheHits++;
            console.log(`✅ [Cache] المشهد ${sceneId} في الكاش`);
            return this.getCachedScene(sceneId);
        }

        this.stats.cacheMisses++;

        try {
            // Phase 2: تحميل بيانات المشهد (Lazy)
            console.log(`📥 [Phase 2] تحميل بيانات المشهد...`);
            const sceneData = await this.lazyLoader.loadScene(sceneId);
            
            // Phase 3: تحضير Tiles
            if (!sceneData.segmented) {
                console.log(`🔲 [Phase 3] تقسيم المشهد إلى Tiles...`);
                sceneData.tiles = this.segmentedLoader.segmentImage(
                    sceneData.image,
                    sceneData.width || 4096,
                    sceneData.height || 2048
                );
                sceneData.segmented = true;
                
                // تخزين في IndexedDB
                await this.storage.save(`scene_${sceneId}`, sceneData);
            }

            // Phase 4: تحميل Tiles مع LOD
            console.log(`📐 [Phase 4] تحميل Tiles مع LOD...`);
            await this.loadTilesWithLOD(sceneId, sceneData, options.viewport);

            // Phase 5: تخزين في الكاش
            this.cache.set(sceneId, sceneData);
            this.stats.scenesLoaded++;

            // Phase 6: تحميل مسبق للمشاهد المتصلة
            if (this.settings.enablePreload) {
                console.log(`🔮 [Phase 6] تحميل مسبق للمشاهد المتصلة...`);
                await this.preloadConnectedScenes(sceneId);
            }

            // تحديث الإحصائيات
            const loadTime = performance.now() - startTime;
            this.stats.avgLoadTime = (this.stats.avgLoadTime + loadTime) / 2;

            console.log(`✅ تم تحميل المشهد ${sceneId} في ${loadTime.toFixed(0)}ms`);
            
            // تسجيل في Analytics
            if (this.analytics) {
                this.analytics.logLoad(sceneId, loadTime);
            }

            return sceneData;

        } catch (error) {
            console.error(`❌ فشل تحميل المشهد ${sceneId}:`, error);
            throw error;
        }
    }

    // ==================== تحميل Tiles مع LOD ====================

    async loadTilesWithLOD(sceneId, sceneData, viewport = { x: 0, y: 0 }) {
        if (!sceneData.tiles) return;

        // تحديد Tiles القريبة
        const nearbyTiles = this.segmentedLoader.getTilesAround(
            sceneData.tiles,
            viewport.x,
            viewport.y,
            this.settings.maxLoadedTiles
        );

        // تحميل كل Tile بمستوى LOD مناسب
        for (const tile of nearbyTiles) {
            await this.loadTileWithLOD(sceneId, tile);
        }

        // تفريغ Tiles البعيدة
        this.unloadDistantTiles(sceneId, nearbyTiles);
    }

    async loadTileWithLOD(sceneId, tile) {
        const tileId = `${sceneId}_${tile.id}`;

        // التحقق من كاش التايل
        if (this.tileCache.has(tileId)) {
            this.stats.tilesCached++;
            return this.tileCache.get(tileId);
        }

        if (this.pending.has(tileId)) {
            return this.pending.get(tileId);
        }

        // حساب المسافة من الكاميرا
        const distance = this.calculateTileDistance(tile);
        
        // تحديد LOD المناسب
        const lodLevel = this.getOptimalLOD(distance);
        
        // تحميل التايل
        const loadPromise = this.loadTileWithRetry(sceneId, tile, lodLevel);
        this.pending.set(tileId, loadPromise);
        
        try {
            const tileData = await loadPromise;
            this.tileCache.set(tileId, tileData);
            this.stats.tilesLoaded++;
            
            return tileData;
        } finally {
            this.pending.delete(tileId);
        }
    }

    async loadTileWithRetry(sceneId, tile, lodLevel, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                // التحقق من IndexedDB
                let tileData = await this.storage.load(`${sceneId}_${tile.id}_${lodLevel}`);
                
                if (!tileData) {
                    // تحميل الصورة
                    tileData = await this.loadTileImage(tile, lodLevel);
                    await this.storage.save(`${sceneId}_${tile.id}_${lodLevel}`, tileData);
                }

                tileData.lod = lodLevel;
                tileData.loadTime = Date.now();

                return tileData;

            } catch (error) {
                console.warn(`⚠️ محاولة ${i + 1} فشلت لـ ${tile.id}`);
                if (i === retries - 1) throw error;
                await new Promise(r => setTimeout(r, 100 * Math.pow(2, i)));
            }
        }
    }

    // ==================== LOD الذكي ====================

    getOptimalLOD(distance) {
        const d = this.settings.lodDistances;
        
        if (distance < d.high) return 'high';
        if (distance < d.medium) return 'medium';
        if (distance < d.low) return 'low';
        return 'culled';
    }

    calculateTileDistance(tile) {
        if (!this.camera) return 0;
        
        // تحويل إحداثيات التايل إلى موقع افتراضي
        const tileWorldPos = new THREE.Vector3(
            tile.col * tile.size,
            0,
            tile.row * tile.size
        );
        
        return this.camera.position.distanceTo(tileWorldPos);
    }

    // ==================== تحميل مسبق ذكي ====================

    async preloadConnectedScenes(sceneId) {
        const connected = this.sceneGraph.getConnectedScenes(sceneId);
        
        // ترتيب حسب الأهمية
        const toPreload = connected
            .sort((a, b) => b.importance - a.importance)
            .slice(0, this.settings.preloadRadius);

        for (const conn of toPreload) {
            // تحميل في الخلفية بأولوية منخفضة
            setTimeout(() => {
                this.loadScene(conn.sceneId, { preload: true, priority: 'low' })
                    .catch(() => {});
            }, 2000);
            
            this.stats.preloadCount++;
        }
    }

    // ==================== تفريغ ذكي ====================

    unloadDistantTiles(sceneId, keepTiles) {
        const keepIds = new Set(keepTiles.map(t => t.id));
        
        // إزالة التايلات البعيدة من الكاش
        for (const [id, data] of this.tileCache) {
            if (id.startsWith(sceneId) && !keepIds.has(id.split('_').pop())) {
                if (data.element) {
                    data.element.remove();
                }
                this.tileCache.delete(id);
                this.stats.tilesLoaded--;
            }
        }
    }

    unloadScene(sceneId) {
        // تفريغ المشهد من الكاش
        this.cache.delete(sceneId);
        
        // تفريغ جميع تايلاته
        for (const [id] of this.tileCache) {
            if (id.startsWith(sceneId)) {
                this.tileCache.delete(id);
            }
        }
        
        this.lazyLoader.unloadScene(sceneId);
        this.stats.scenesLoaded--;
    }

    // ==================== حلقة التغذية الراجعة من Analytics ====================

    startMonitoring() {
        setInterval(() => {
            this.updateStats();
            
            if (this.settings.enableAnalytics && this.analytics) {
                this.analyticsFeedback();
            }
        }, 2000);
    }

    analyticsFeedback() {
        const analytics = this.analytics.getPerformanceReport();
        if (!analytics) return;

        // ضبط بناءً على FPS
        if (analytics.averageFps < 30) {
            console.log('⚠️ FPS منخفض - تخفيض جودة LOD');
            this.settings.lodDistances.high *= 0.8;
            this.settings.lodDistances.medium *= 0.8;
            this.settings.maxLoadedTiles = Math.max(5, this.settings.maxLoadedTiles - 2);
        }

        // ضبط بناءً على الذاكرة
        if (analytics.averageMemory > 400) {
            console.log('⚠️ ذاكرة عالية - تقليل Preload');
            this.settings.preloadRadius = Math.max(1, this.settings.preloadRadius - 1);
            this.settings.maxLoadedScenes = Math.max(3, this.settings.maxLoadedScenes - 1);
        }

        // ضبط بناءً على Cache Hit Rate
        if (analytics.cacheHitRate < 50) {
            console.log('⚠️ Cache Hit Rate منخفض - زيادة حجم الكاش');
            this.settings.maxLoadedScenes++;
            this.settings.maxLoadedTiles += 5;
        }

        // تسجيل التغييرات
        this.analytics.logSettings(this.settings);
    }

    // ==================== واجهة الكاش ====================

    getCachedScene(sceneId) {
        const scene = this.cache.get(sceneId);
        if (!scene) return null;

        // تحديث وقت الاستخدام
        scene.lastUsed = Date.now();
        
        return scene;
    }

    clearCache() {
        this.cache.clear();
        this.tileCache.clear();
        this.stats = {
            ...this.stats,
            scenesLoaded: 0,
            tilesLoaded: 0,
            tilesCached: 0
        };
    }

    // ==================== إحصائيات ====================

    updateStats() {
        this.stats.memoryUsage = this.calculateMemoryUsage();
        this.stats.fps = this.calculateFPS();
    }

    calculateMemoryUsage() {
        let total = this.cache.size * 5; // تقدير 5MB لكل مشهد
        total += this.tileCache.size * 0.5; // 0.5MB لكل تايل
        return total;
    }

    calculateFPS() {
        if (!window.performance) return 60;
        return Math.round(60 - (performance.now() % 60));
    }

    getDetailedStats() {
        return {
            scenes: {
                loaded: this.stats.scenesLoaded,
                cached: this.cache.size,
                preloaded: this.stats.preloadCount
            },
            tiles: {
                loaded: this.stats.tilesLoaded,
                cached: this.tileCache.size,
                hitRate: (this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses) * 100).toFixed(2) + '%'
            },
            performance: {
                fps: this.stats.fps,
                memory: this.stats.memoryUsage.toFixed(2) + ' MB',
                avgLoadTime: this.stats.avgLoadTime.toFixed(0) + ' ms'
            },
            settings: this.settings
        };
    }

    // ==================== تحديثات الكاميرا ====================

    onCameraMove(viewportX, viewportY) {
        if (!this.currentScene) return;

        // إعادة تحميل Tiles حسب الموقع الجديد
        this.loadTilesWithLOD(this.currentScene.id, this.currentScene, { x: viewportX, y: viewportY });
        
        // تحديث LOD
        this.lodManager.update();
    }

    setCamera(camera) {
        this.camera = camera;
        this.lodManager.camera = camera;
    }
}
