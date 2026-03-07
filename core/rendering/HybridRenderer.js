// =======================================
// ACTUAL CONSTRUCTION OS - HYBRID RENDERER
// =======================================
// يجمع بين WebGL و CSS حسب الحاجة

export class HybridRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.mode = 'webgl'; // webgl, css, auto
        
        this.webglRenderer = null;
        this.cssRenderer = null;
        
        this.threshold = {
            scenes: 50,      // بعد 50 مشهد → CSS
            performance: 30,  // أقل من 30 FPS → CSS
            memory: 500       // أكثر من 500MB → CSS
        };

        this.stats = {
            fps: 60,
            memory: 0,
            mode: this.mode,
            switches: 0
        };

        this.init();
    }

    // تهيئة
    init() {
        // WebGL Renderer
        this.webglRenderer = new THREE.WebGLRenderer({ antialias: true });
        this.webglRenderer.setSize(window.innerWidth, window.innerHeight);
        
        // CSS Renderer (بسيط)
        this.cssRenderer = document.createElement('div');
        this.cssRenderer.style.cssText = `
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
        `;

        this.startPerformanceMonitoring();
        this.chooseRenderer();
    }

    // اختيار الريندرر المناسب
    chooseRenderer() {
        const sceneCount = this.getSceneCount();
        const memory = this.getMemoryUsage();
        const fps = this.stats.fps;

        if (this.mode === 'auto') {
            if (sceneCount > this.threshold.scenes || 
                memory > this.threshold.memory || 
                fps < this.threshold.performance) {
                this.switchToCSS();
            } else {
                this.switchToWebGL();
            }
        }
    }

    // التبديل إلى WebGL
    switchToWebGL() {
        if (this.mode === 'webgl') return;

        this.mode = 'webgl';
        this.stats.switches++;
        
        // إزالة CSS
        while (this.cssRenderer.firstChild) {
            this.cssRenderer.removeChild(this.cssRenderer.firstChild);
        }
        
        // إضافة WebGL
        this.container.innerHTML = '';
        this.container.appendChild(this.webglRenderer.domElement);
        
        console.log('🎮 التبديل إلى WebGL');
    }

    // التبديل إلى CSS
    switchToCSS() {
        if (this.mode === 'css') return;

        this.mode = 'css';
        this.stats.switches++;
        
        // إزالة WebGL
        this.webglRenderer.domElement.remove();
        
        // إضافة CSS
        this.container.innerHTML = '';
        this.container.appendChild(this.cssRenderer);
        
        console.log('📱 التبديل إلى CSS (أخف)');
    }

    // عرض مشهد بـ WebGL
    renderWebGL(scene, camera) {
        if (this.mode !== 'webgl') return;
        
        this.webglRenderer.render(scene, camera);
    }

    // عرض مشهد بـ CSS (صورة 360)
    renderCSS(imageUrl, hotspots) {
        if (this.mode !== 'css') return;

        // صورة 360 بخلفية CSS
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.1s;
        `;

        // دوران بالماوس
        let rotation = 0;
        img.addEventListener('mousemove', (e) => {
            rotation = (e.clientX / window.innerWidth) * 360;
            img.style.transform = `rotateY(${rotation}deg)`;
        });

        this.cssRenderer.innerHTML = '';
        this.cssRenderer.appendChild(img);

        // إضافة hotspots (بسيطة)
        hotspots.forEach(h => {
            const div = document.createElement('div');
            div.style.cssText = `
                position: absolute;
                left: ${h.x}%;
                top: ${h.y}%;
                width: 20px;
                height: 20px;
                background: #ffaa44;
                border-radius: 50%;
                cursor: pointer;
                transform: translate(-50%, -50%);
            `;
            div.title = h.title;
            this.cssRenderer.appendChild(div);
        });
    }

    // مراقبة الأداء
    startPerformanceMonitoring() {
        let lastTime = performance.now();
        let frames = 0;

        const measure = () => {
            frames++;
            const now = performance.now();
            const delta = now - lastTime;

            if (delta >= 1000) {
                this.stats.fps = frames;
                frames = 0;
                lastTime = now;
                
                this.chooseRenderer();
            }

            requestAnimationFrame(measure);
        };

        requestAnimationFrame(measure);
    }

    // الحصول على استخدام الذاكرة
    getMemoryUsage() {
        if (window.performance && window.performance.memory) {
            return window.performance.memory.usedJSHeapSize / (1024 * 1024);
        }
        return 0;
    }

    // الحصول على عدد المشاهد
    getSceneCount() {
        // سيتم تعيينها من الخارج
        return window.sceneCount || 0;
    }

    // تحديث الحجم
    resize(width, height) {
        this.webglRenderer.setSize(width, height);
        this.cssRenderer.style.width = width + 'px';
        this.cssRenderer.style.height = height + 'px';
    }

    // الحصول على إحصائيات
    getStats() {
        return {
            ...this.stats,
            memory: this.getMemoryUsage().toFixed(2) + ' MB',
            sceneCount: this.getSceneCount()
        };
    }
}
