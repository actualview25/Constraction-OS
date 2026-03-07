// =======================================
// ACTUAL CONSTRUCTION OS - ANALYTICS DEBUGGER
// =======================================
// تتبع وتحليل كل شيء في الوقت الفعلي

export class AnalyticsDebugger {
    constructor(integratedLoader, realityBridge) {
        this.loader = integratedLoader;
        this.bridge = realityBridge;
        
        this.enabled = false;
        this.history = [];
        this.alerts = [];
        
        this.thresholds = {
            fps: 30,
            memory: 500,
            loadTime: 2000
        };

        this.init();
    }

    // تهيئة
    init() {
        this.createDashboard();
        this.startTracking();
        this.setupKeyboardShortcut();
    }

    // إنشاء لوحة التحكم
    createDashboard() {
        this.dashboard = document.createElement('div');
        this.dashboard.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 500px;
            background: rgba(0,0,0,0.9);
            color: #0f0;
            font-family: monospace;
            font-size: 11px;
            padding: 15px;
            border-radius: 8px;
            z-index: 10001;
            display: none;
            border: 2px solid #00f;
            max-height: 90vh;
            overflow-y: auto;
        `;

        document.body.appendChild(this.dashboard);
    }

    // بدء التتبع
    startTracking() {
        setInterval(() => {
            if (this.enabled) {
                this.collectData();
                this.renderDashboard();
            }
        }, 500);
    }

    // جمع البيانات
    collectData() {
        const loaderStats = this.loader.getDetailedStats();
        
        const data = {
            timestamp: Date.now(),
            performance: {
                fps: loaderStats.loader.fps,
                memory: loaderStats.loader.memoryUsage,
                loadTime: this.measureLoadTime()
            },
            scenes: {
                loaded: loaderStats.loader.scenesLoaded,
                cached: loaderStats.cache.size,
                tiles: loaderStats.loader.tilesLoaded
            },
            lod: loaderStats.lod,
            cache: loaderStats.cache,
            bridge: {
                anchors: this.bridge.anchors.size,
                markers: this.bridge.markers.size,
                syncQueue: this.bridge.syncManager?.syncQueue.length || 0
            }
        };

        this.history.push(data);
        if (this.history.length > 100) {
            this.history.shift();
        }

        this.checkAlerts(data);
    }

    // فحص التنبيهات
    checkAlerts(data) {
        if (data.performance.fps < this.thresholds.fps) {
            this.addAlert('⚠️ FPS منخفض', data.performance.fps + ' FPS');
        }

        if (data.performance.memory > this.thresholds.memory) {
            this.addAlert('⚠️ ذاكرة عالية', data.performance.memory.toFixed(2) + ' MB');
        }
    }

    // إضافة تنبيه
    addAlert(title, message) {
        this.alerts.push({
            title,
            message,
            time: new Date().toLocaleTimeString()
        });

        if (this.alerts.length > 10) {
            this.alerts.shift();
        }
    }

    // قياس وقت التحميل
    measureLoadTime() {
        // محاكاة
        return Math.random() * 1000;
    }

    // رسم لوحة التحكم
    renderDashboard() {
        const latest = this.history[this.history.length - 1];
        if (!latest) return;

        this.dashboard.innerHTML = `
            <div style="color:#00f; font-weight:bold; margin-bottom:15px; font-size:14px;">
                📊 ACTUAL CONSTRUCTION OS ANALYTICS
            </div>

            <div style="border-bottom:1px solid #00f; margin:10px 0;"></div>

            <div style="color:#88aaff;">⚡ الأداء</div>
            <div style="margin-left:10px; margin-bottom:10px;">
                <div>FPS: ${latest.performance.fps} ${latest.performance.fps < 30 ? '🔴' : '🟢'}</div>
                <div>الذاكرة: ${latest.performance.memory.toFixed(2)} MB</div>
                <div>وقت التحميل: ${latest.performance.loadTime.toFixed(0)} ms</div>
            </div>

            <div style="border-bottom:1px solid #00f; margin:10px 0;"></div>

            <div style="color:#88aaff;">📦 المشاهد</div>
            <div style="margin-left:10px; margin-bottom:10px;">
                <div>محملة: ${latest.scenes.loaded}</div>
                <div>مخبأة: ${latest.scenes.cached}</div>
                <div>Tiles: ${latest.scenes.tiles}</div>
            </div>

            <div style="border-bottom:1px solid #00f; margin:10px 0;"></div>

            <div style="color:#88aaff;">🔄 LOD</div>
            <div style="margin-left:10px; margin-bottom:10px;">
                <div>High: ${latest.lod.high || 0}</div>
                <div>Medium: ${latest.lod.medium || 0}</div>
                <div>Low: ${latest.lod.low || 0}</div>
                <div>Culled: ${latest.lod.culled || 0}</div>
            </div>

            <div style="border-bottom:1px solid #00f; margin:10px 0;"></div>

            <div style="color:#88aaff;">💾 الكاش</div>
            <div style="margin-left:10px; margin-bottom:10px;">
                <div>الحجم: ${latest.cache.size}</div>
                <div>إصابات: ${latest.cache.hits}</div>
                <div>أخطاء: ${latest.cache.misses}</div>
                <div>الدقة: ${latest.cache.hitRate}</div>
            </div>

            <div style="border-bottom:1px solid #00f; margin:10px 0;"></div>

            <div style="color:#88aaff;">🌉 RealityBridge</div>
            <div style="margin-left:10px; margin-bottom:10px;">
                <div>مرتكزات: ${latest.bridge.anchors}</div>
                <div>علامات: ${latest.bridge.markers}</div>
                <div>قائمة المزامنة: ${latest.bridge.syncQueue}</div>
            </div>

            <div style="border-bottom:1px solid #00f; margin:10px 0;"></div>

            <div style="color:#ffaa44;">🚨 التنبيهات (${this.alerts.length})</div>
            <div style="margin-left:10px; max-height:100px; overflow-y:auto;">
                ${this.alerts.slice().reverse().map(a => `
                    <div style="color:#f00; margin:2px 0;">
                        ${a.time} - ${a.title}: ${a.message}
                    </div>
                `).join('')}
            </div>

            <div style="border-bottom:1px solid #00f; margin:10px 0;"></div>

            <div style="display:flex; gap:5px; margin-top:10px;">
                <button onclick="toggleAnalytics()" style="background:#00f; color:white; border:none; padding:3px 8px;">إخفاء</button>
                <button onclick="clearAlerts()" style="background:#f00; color:white; border:none; padding:3px 8px;">مسح التنبيهات</button>
                <button onclick="exportAnalytics()" style="background:#0f0; color:black; border:none; padding:3px 8px;">تصدير</button>
            </div>

            <div style="color:#888; font-size:9px; margin-top:10px;">
                آخر تحديث: ${new Date().toLocaleTimeString()}
            </div>
        `;

        // إضافة الدوال
        window.toggleAnalytics = () => this.toggle();
        window.clearAlerts = () => { this.alerts = []; };
        window.exportAnalytics = () => this.exportData();
    }

    // تصدير البيانات
    exportData() {
        const data = {
            history: this.history,
            alerts: this.alerts,
            thresholds: this.thresholds,
            stats: this.loader.getDetailedStats()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_${Date.now()}.json`;
        a.click();
    }

    // إظهار/إخفاء
    toggle() {
        this.enabled = !this.enabled;
        this.dashboard.style.display = this.enabled ? 'block' : 'none';
        
        if (this.enabled) {
            this.collectData();
        }
    }

    // إضافة اختصار لوحة المفاتيح
    setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F3') {
                this.toggle();
            }
        });
    }

    // الحصول على تقرير الأداء
    getPerformanceReport() {
        if (this.history.length === 0) return null;

        const avgFps = this.history.reduce((sum, h) => sum + h.performance.fps, 0) / this.history.length;
        const avgMemory = this.history.reduce((sum, h) => sum + h.performance.memory, 0) / this.history.length;
        
        return {
            averageFps: avgFps.toFixed(2),
            averageMemory: avgMemory.toFixed(2) + ' MB',
            peakMemory: Math.max(...this.history.map(h => h.performance.memory)).toFixed(2) + ' MB',
            totalAlerts: this.alerts.length,
            recommendations: this.generateRecommendations()
        };
    }

    // توليد توصيات للتحسين
    generateRecommendations() {
        const recs = [];
        const latest = this.history[this.history.length - 1];

        if (latest.performance.fps < 30) {
            recs.push('🔧 قلل عدد Tiles المحملة أو اخفض LOD');
        }

        if (latest.cache.hitRate < 50) {
            recs.push('💾 زود حجم الكاش أو حسّن استراتيجية التخزين');
        }

        if (latest.lod.culled > latest.lod.high * 10) {
            recs.push('📏 هناك عناصر كثيرة خارج النطاق - راجع مسافات LOD');
        }

        if (this.alerts.length > 5) {
            recs.push('⚠️ تنبيهات كثيرة - راجع استقرار النظام');
        }

        return recs;
    }
}
