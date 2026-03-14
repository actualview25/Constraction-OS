// =======================================
// ACTUAL CONSTRUCTION OS - INTEGRATED LOADER FINAL
// =======================================
// نظام تحميل موحد متكامل مع:
// - Lazy Loading
// - Segmented Loading
// - Dynamic Tile LOD
// - Priority Queue
// - Cache + IndexedDB
// - Analytics Feedback
// =======================================

import { LazySceneLoader } from './LazySceneLoader.js';
import { SegmentedSceneLoader } from './SegmentedSceneLoader.js';
import { LODManager } from '../rendering/LODManager.js';
import { PriorityQueue } from './PriorityQueue.js';
import { TileLODManager } from './TileLODManager.js';

export class IntegratedLoader {
    constructor(sceneGraph, storage, camera, analytics) {
        console.log('🚀 IntegratedLoader بدء التهيئة...');
        
        // الأنظمة الأساسية
        this.sceneGraph = sceneGraph;
        this.storage = storage;
        this.camera = camera;
        this.analytics = analytics;
        
        // أنظمة التحميل
        this.lazyLoader = new LazySceneLoader(sceneGraph, storage);
        this.segmentedLoader = new SegmentedSceneLoader();
        this.lodManager = new LODManager(camera);
        this.tileLODManager = new TileLODManager(camera);
        
        // طابور الأولويات
        this.priorityQueue = new PriorityQueue(this);
        
        // أنظمة التخزين المؤقت
        this.sceneCache = new Map();      // المشاهد المحملة
        this.tileCache = new Map();       // التايلات المحملة
        this.pendingLoads = new Map();    // المهام قيد التنفيذ
        
        // إعدادات قابلة للتعديل
        this.settings = {
            // حدود التحميل
            maxLoadedScenes: 5,           // حد أقصى للمشاهد في الذاكرة
            maxLoadedTiles: 50,            // حد أقصى للتايلات في الذاكرة
            maxConcurrentLoads: 3,         // تحميلات متزامنة
            
            // مسافات LOD
            lodDistances: {
                high: 10,                  // أقل من 10 متر
                medium: 30,                 // 10-30 متر
                low: 100,                   // 30-100 متر
                culled: 100                  // أكثر من 100 متر
            },
            
            // أولويات التحميل
            priorities: {
                critical: 100,              // أمام المستخدم مباشرة
                high: 70,                    // قريب من مجال الرؤية
                medium: 40,                   // مشاهد متصلة قريبة
                low: 10,                       // تحميل مسبق بعيد
                background: 1                   // خلفية
            },
            
            // تفعيل/تعطيل الميزات
            enableCache: true,
            enablePreload: true,
            enableAnalytics: true,
            enablePriorityQueue: true
        };

        // إحصائيات شاملة
        this.stats = {
            // مشاهد
            scenesLoaded: 0,
            scenesCached: 0,
            scenesPreloaded: 0,
            
            // تايلات
            tilesLoaded: 0,
            tilesCached: 0,
            tilesSkipped: 0,
            
            // أداء
            cacheHits: 0,
            cacheMisses: 0,
            averageLoadTime: 0,
            peakMemoryUsage: 0,
            currentMemoryUsage: 0,
            fps: 60,
            
            // طابور
            queueLength: 0,
            processedTasks: 0,
            failedTasks: 0
        };

        // بدء المراقبة
        this.startMonitoring();
        
        console.log('✅ IntegratedLoader جاهز');
    }

    // ==================== التحميل الموحد الرئيسي ====================

    async loadScene(sceneId, options = {}) {
        const startTime = performance.now();
        console.log(`\n🎯 [IntegratedLoader] بدء تحميل المشهد ${sceneId}...`);

        // Phase 1: التحقق من الكاش
        if (this.settings.enableCache && this.sceneCache.has(sceneId)) {
            this.stats.cacheHits++;
            console.log(`✅ [Phase 1] المشهد ${sceneId} في الكاش`);
            return this.getCachedScene(sceneId);
        }

        this.stats.cacheMisses++;

        try {
            // Phase 2: تحميل بيانات المشهد (Lazy)
            console.log(`📥 [Phase 2] تحميل بيانات المشهد من LazyLoader...`);
            const sceneData = await this.lazyLoader.loadScene(sceneId);
            
            // تحديث الرسم البياني
            this.sceneGraph.addNode(sceneId, sceneData.position);

            // Phase 3: تجهيز Tiles
            if (!sceneData.segmented) {
                console.log(`🔲 [Phase 3] تقسيم المشهد إلى Tiles...`);
                sceneData.tiles = this.segmentedLoader.segmentImage(
                    sceneData.image,
                    sceneData.width || 4096,
                    sceneData.height || 2048
                );
                sceneData.segmented = true;
                sceneData.tileCount = sceneData.tiles.length;
                
                // تخزين في IndexedDB
                await this.storage.save(`scene_${sceneId}`, sceneData);
                console.log(`💾 تم تخزين المشهد في IndexedDB`);
            }

            // Phase 4: تحميل Tiles عبر Priority Queue
            console.log(`📊 [Phase 4] إضافة Tiles إلى طابور الأولويات...`);
            this.priorityQueue.queueNearbyTiles(
                sceneId,
                sceneData.tiles,
                options.viewport || { x: 0, y: 0 },
                this.getCameraDirection()
            );

            // Phase 5: تخزين في الكاش
            this.sceneCache.set(sceneId, {
                ...sceneData,
                lastUsed: Date.now(),
                accessCount: 0
            });
            this.stats.scenesLoaded++;
            this.stats.scenesCached = this.sceneCache.size;

            // Phase 6: تحميل مسبق للمشاهد المتصلة
            if (this.settings.enablePreload) {
                console.log(`🔮 [Phase 6] تحميل مسبق للمشاهد المتصلة...`);
                await this.preloadConnectedScenes(sceneId);
            }

            // تحديث إحصائيات
            const loadTime = performance.now() - startTime;
            this.stats.averageLoadTime = (this.stats.averageLoadTime + loadTime) / 2;

            console.log(`✅ تم تحميل المشهد ${sceneId} في ${loadTime.toFixed(0)}ms`);
            console.log(`📊 Tiles: ${sceneData.tileCount}, محملة: ${this.stats.tilesLoaded}`);

            // تسجيل في Analytics
            if (this.analytics) {
                this.analytics.logLoad(sceneId, loadTime, this.stats);
            }

            return sceneData;

        } catch (error) {
            console.error(`❌ فشل تحميل المشهد ${sceneId}:`, error);
            this.stats.failedTasks++;
            throw error;
        }
    }

    // ==================== تحميل Tiles مع LOD ====================

    async loadTileWithLOD(sceneId, tile, lodLevel = 'medium') {
        const tileId = `${sceneId}_${tile.id}`;

        // Phase 1: التحقق من الكاش
        if (this.settings.enableCache && this.tileCache.has(tileId)) {
            const cached = this.tileCache.get(tileId);
            if (cached.lod === lodLevel) {
                this.stats.tilesCached++;
                return cached;
            }
        }

        // Phase 2: التحقق من التحميلات الجارية
        if (this.pendingLoads.has(tileId)) {
            return this.pendingLoads.get(tileId);
        }

        // Phase 3: حساب المسافة لاختيار LOD
        const distance = this.calculateTileDistance(tile);
        const optimalLod = this.getOptimalLOD(distance);
        const finalLod = lodLevel || optimalLod;

        // Phase 4: إنشاء وعد التحميل
        const loadPromise = this.executeTileLoad(sceneId, tile, finalLod);
        this.pendingLoads.set(tileId, loadPromise);

        try {
            const tileData = await loadPromise;
            
            // إضافة إلى TileLODManager للمراقبة
            this.tileLODManager.addTile(tileId, tileData, tile.position);
            
            // تخزين في الكاش
            this.tileCache.set(tileId, tileData);
            this.stats.tilesLoaded++;
            
            // تحديث إحصائيات الذاكرة
            this.updateMemoryStats();

            return tileData;

        } finally {
            this.pendingLoads.delete(tileId);
        }
    }

    async executeTileLoad(sceneId, tile, lodLevel) {
        const tileId = `${sceneId}_${tile.id}_${lodLevel}`;
        
        // محاولة من IndexedDB
        let tileData = await this.storage.load(tileId);
        
        if (!tileData) {
            // تحميل الصورة
            tileData = await this.loadTileImage(tile, lodLevel);
            
            // تخزين للمستقبل
            await this.storage.save(tileId, tileData);
        }

    // إضافة معلومات إضافية
        tileData.id = tile.id;
        tileData.lod = lodLevel;
        tileData.loadedAt = Date.now();
        tileData.size = tile.size;
        tileData.position = tile.position;

        return tileData;
    }

    async loadTileImage(tile, lodLevel) {
        const qualities = {
            high: { scale: 1.0, quality: 1.0 },
            medium: { scale: 0.5, quality: 0.7 },
            low: { scale: 0.25, quality: 0.4 }
        };

        const q = qualities[lodLevel] || qualities.medium;

        // محاكاة تحميل الصورة
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: tile.imageData,
                    quality: q.quality,
                    scale: q.scale,
                    size: tile.size * q.scale
                });
            }, 50);
        });
    }

    // ==================== LOD وإدارة المسافات ====================

    getOptimalLOD(distance) {
        const d = this.settings.lodDistances;
        
        if (distance < d.high) return 'high';
        if (distance < d.medium) return 'medium';
        if (distance < d.low) return 'low';
        return 'culled';
    }

    calculateTileDistance(tile) {
        if (!this.camera) return 0;
        
        const tileWorldPos = new THREE.Vector3(
            tile.col * tile.size,
            0,
            tile.row * tile.size
        );
        
        return this.camera.position.distanceTo(tileWorldPos);
    }

    getCameraDirection() {
        if (!this.camera) return null;
        
        return {
            x: this.camera.position.x,
            y: this.camera.position.y,
            angle: this.camera.rotation?.y || 0
        };
    }

    // ==================== تحميل مسبق ====================

    async preloadConnectedScenes(sceneId) {
        const connected = this.sceneGraph.getConnectedScenes(sceneId);
        const currentPos = this.sceneGraph.scenePositions.get(sceneId);

        // ترتيب حسب المسافة
        const scenesWithDistance = connected.map(scene => ({
            ...scene,
            distance: this.calculateDistance(scene.position, currentPos)
        }));

        scenesWithDistance.sort((a, b) => a.distance - b.distance);

        // تحميل أقرب مشهدين فقط
        for (const scene of scenesWithDistance.slice(0, 2)) {
            let priority = this.settings.priorities.medium;
            
            if (scene.distance < 20) {
                priority = this.settings.priorities.high;
            } else if (scene.distance < 50) {
                priority = this.settings.priorities.medium;
            } else {
                priority = this.settings.priorities.low;
            }

            this.priorityQueue.addTask({
                type: 'preload',
                sceneId: scene.id,
                priority,
                position: scene.position,
                importance: scene.importance || 1,
                retries: 0
            });

            this.stats.scenesPreloaded++;
        }
    }

    calculateDistance(pos1, pos2) {
        if (!pos1 || !pos2) return Infinity;
        return Math.sqrt(
            Math.pow(pos2.x - pos1.x, 2) +
            Math.pow(pos2.y - pos1.y, 2) +
            Math.pow(pos2.z - pos1.z, 2)
        );
    }

    // ==================== إدارة الكاش ====================

    getCachedScene(sceneId) {
        const scene = this.sceneCache.get(sceneId);
        if (!scene) return null;

        // تحديث إحصائيات الاستخدام
        scene.lastUsed = Date.now();
        scene.accessCount = (scene.accessCount || 0) + 1;

        return scene;
    }

    unloadScene(sceneId) {
        // إزالة من الكاش
        this.sceneCache.delete(sceneId);
        
        // إزالة جميع تايلاته من الكاش
        for (const [id] of this.tileCache) {
            if (id.startsWith(sceneId)) {
                this.tileCache.delete(id);
            }
        }

        // إزالة من TileLODManager
        this.tileLODManager.tiles.forEach((_, id) => {
            if (id.startsWith(sceneId)) {
                this.tileLODManager.removeTile(id);
            }
        });

        // تحديث إحصائيات
        this.stats.scenesLoaded--;
        this.updateMemoryStats();

        console.log(`🧹 تم تفريغ المشهد ${sceneId}`);
    }

    unloadOldestScenes() {
        if (this.sceneCache.size <= this.settings.maxLoadedScenes) return;

        // ترتيب المشاهد حسب آخر استخدام
        const scenes = Array.from(this.sceneCache.entries())
            .map(([id, data]) => ({ id, lastUsed: data.lastUsed || 0 }))
            .sort((a, b) => a.lastUsed - b.lastUsed);

        // إزالة الأقدم
        const toRemove = scenes.slice(0, this.sceneCache.size - this.settings.maxLoadedScenes);
        toRemove.forEach(s => this.unloadScene(s.id));
    }

    clearCache() {
        this.sceneCache.clear();
        this.tileCache.clear();
        this.tileLODManager.tiles.clear();
        
        this.stats.scenesLoaded = 0;
        this.stats.tilesLoaded = 0;
        this.stats.tilesCached = 0;
        
        console.log('🧹 تم مسح الكاش بالكامل');
    }

    // ==================== تحديثات الكاميرا ====================

    onCameraMove(viewportX, viewportY) {
        if (!this.currentScene) return;

        // إعادة تقييم أولويات التايلات
        if (this.settings.enablePriorityQueue) {
            this.priorityQueue.cancelTasksByType('tile');
            
            this.priorityQueue.queueNearbyTiles(
                this.currentScene.id,
                this.currentScene.tiles,
                { x: viewportX, y: viewportY },
                this.getCameraDirection()
            );
        }

        // تحديث LOD
        this.tileLODManager.update();
    }

    setCamera(camera) {
        this.camera = camera;
        this.lodManager.camera = camera;
        this.tileLODManager.camera = camera;
    }

    setCurrentScene(sceneId) {
        this.currentScene = this.sceneCache.get(sceneId);
    }

    // ==================== مراقبة وإحصائيات ====================

    startMonitoring() {
        setInterval(() => {
            this.updateStats();
            
            if (this.settings.enableAnalytics && this.analytics) {
                this.analyticsFeedback();
            }

            // تفريغ المشاهد القديمة إذا لزم الأمر
            this.unloadOldestScenes();

        }, 2000);
    }

    updateStats() {
        // تحديث استخدام الذاكرة
        this.stats.currentMemoryUsage = this.calculateMemoryUsage();
        this.stats.peakMemoryUsage = Math.max(
            this.stats.peakMemoryUsage,
            this.stats.currentMemoryUsage
        );

        // تحديث FPS
        this.stats.fps = this.calculateFPS();

        // تحديث إحصائيات الطابور
        const queueStats = this.priorityQueue.getStats();
        this.stats.queueLength = queueStats.queueLength;
        this.stats.processedTasks = queueStats.processed;
    }

    calculateMemoryUsage() {
        // تقدير استخدام الذاكرة
        let total = 0;
        
        // مشاهد: ~5MB لكل مشهد
        total += this.sceneCache.size * 5;
        
        // تايلات: ~0.5MB لكل تايل
        total += this.tileCache.size * 0.5;
        
        return total;
    }

    calculateFPS() {
        if (!window.performance) return 60;
        // FPS تقريبي
        return Math.round(60 - (performance.now() % 60));
    }

    analyticsFeedback() {
        const report = this.analytics.getPerformanceReport();
        if (!report) return;

        // ضبط بناءً على FPS
        if (report.averageFps < 30) {
            console.log('⚠️ [Analytics] FPS منخفض - تخفيض جودة LOD');
            this.settings.lodDistances.high *= 0.8;
            this.settings.lodDistances.medium *= 0.8;
            this.settings.maxLoadedTiles = Math.max(20, this.settings.maxLoadedTiles - 5);
        }

        // ضبط بناءً على الذاكرة
        if (report.averageMemory > 400) {
            console.log('⚠️ [Analytics] ذاكرة عالية - تقليل Preload');
            this.settings.maxLoadedScenes = Math.max(3, this.settings.maxLoadedScenes - 1);
            this.settings.maxLoadedTiles = Math.max(30, this.settings.maxLoadedTiles - 10);
        }

        // ضبط بناءً على Cache Hit Rate
        const hitRate = (this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses)) * 100;
        if (hitRate < 50) {
            console.log('⚠️ [Analytics] Cache Hit Rate منخفض - زيادة حجم الكاش');
            this.settings.maxLoadedScenes++;
            this.settings.maxLoadedTiles += 10;
        }

        // تسجيل التغييرات
        if (this.analytics) {
            this.analytics.logSettings(this.settings);
        }
    }

    // ==================== إحصائيات مفصلة ====================

    getDetailedStats() {
        const hitRate = (this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses)) * 100;
        const queueStats = this.priorityQueue.getStats();

        return {
            // المشاهد
            scenes: {
                loaded: this.stats.scenesLoaded,
                cached: this.sceneCache.size,
                preloaded: this.stats.scenesPreloaded,
                maxAllowed: this.settings.maxLoadedScenes
            },

            // التايلات
            tiles: {
                loaded: this.stats.tilesLoaded,
                cached: this.tileCache.size,
                skipped: this.stats.tilesSkipped,
                maxAllowed: this.settings.maxLoadedTiles,
                byLod: this.tileLODManager.getStats()
            },

            // الأداء
            performance: {
                fps: this.stats.fps,
                memory: {
                    current: this.stats.currentMemoryUsage.toFixed(2) + ' MB',
                    peak: this.stats.peakMemoryUsage.toFixed(2) + ' MB',
                    estimated: this.calculateMemoryUsage().toFixed(2) + ' MB'
                },
                averageLoadTime: this.stats.averageLoadTime.toFixed(0) + ' ms'
            },

            // الكاش
            cache: {
                hits: this.stats.cacheHits,
                misses: this.stats.cacheMisses,
                hitRate: hitRate.toFixed(2) + '%',
                size: this.sceneCache.size + this.tileCache.size
            },

            // الطابور
            queue: {
                length: queueStats.queueLength,
                processed: queueStats.processed,
                avgWait: queueStats.avgWaitTime?.toFixed(0) + ' ms',
                breakdown: queueStats.priorityBreakdown
            },

            // الإعدادات الحالية
            settings: { ...this.settings }
        };
    }

    // ==================== أدوات التحكم ====================

    updateSettings(newSettings) {
        this.settings = {
            ...this.settings,
            ...newSettings
        };
        
        console.log('⚙️ تم تحديث الإعدادات:', this.settings);
    }

    pauseLoading() {
        this.priorityQueue.pause();
        console.log('⏸️ تم إيقاف التحميل مؤقتاً');
    }

    resumeLoading() {
        this.priorityQueue.resume();
        console.log('▶️ تم استئناف التحميل');
    }

    getStatus() {
        return {
            isReady: true,
            currentScene: this.currentScene?.id,
            loading: this.pendingLoads.size,
            queueLength: this.priorityQueue.queue.length,
            stats: this.getDetailedStats()
        };
    }
}

export default IntegratedLoader;
