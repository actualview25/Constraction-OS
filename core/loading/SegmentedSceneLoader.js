// =======================================
// ACTUAL CONSTRUCTION OS - SEGMENTED SCENE LOADER
// =======================================
// تقسيم المشهد إلى مربعات (Tiles) وتحميل عند الحاجة فقط

export class SegmentedSceneLoader {
    constructor() {
        this.tiles = new Map();           // المربعات المحملة
        this.tileSize = 1024;             // حجم المربع بالبكسل
        this.maxLoadedTiles = 20;          // حد أقصى للذاكرة
        
        this.viewport = { x: 0, y: 0 };    // موقع الكاميرا
        this.currentScene = null;
        
        this.stats = {
            totalTiles: 0,
            loadedTiles: 0,
            memoryUsage: 0
        };
    }

    // تقسيم الصورة إلى مربعات
    segmentImage(image, width, height) {
        const cols = Math.ceil(width / this.tileSize);
        const rows = Math.ceil(height / this.tileSize);
        
        const tiles = [];
        
        // إنشاء Canvas للتقسيم
        const canvas = document.createElement('canvas');
        canvas.width = this.tileSize;
        canvas.height = this.tileSize;
        const ctx = canvas.getContext('2d');

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const id = `tile_${row}_${col}`;
                
                // قص الجزء المناسب
                ctx.clearRect(0, 0, this.tileSize, this.tileSize);
                ctx.drawImage(
                    image,
                    col * this.tileSize, row * this.tileSize,
                    this.tileSize, this.tileSize,
                    0, 0,
                    this.tileSize, this.tileSize
                );
                
                // تحويل إلى ImageData
                const imageData = canvas.toDataURL('image/jpeg', 0.8);
                
                tiles.push({
                    id,
                    row,
                    col,
                    imageData,
                    loaded: false,
                    distance: Infinity
                });
            }
        }

        console.log(`📦 تم تقسيم المشهد إلى ${tiles.length} مربع`);
        return tiles;
    }

    // تحميل المربعات القريبة من الكاميرا
    loadTilesAroundViewport(sceneId, viewportX, viewportY) {
        this.viewport = { x: viewportX, y: viewportY };
        this.currentScene = sceneId;
        
        const sceneTiles = this.tiles.get(sceneId);
        if (!sceneTiles) return;

        // حساب المسافات
        sceneTiles.forEach(tile => {
            const tileCenterX = (tile.col + 0.5) * this.tileSize;
            const tileCenterY = (tile.row + 0.5) * this.tileSize;
            
            const distance = Math.sqrt(
                Math.pow(tileCenterX - viewportX, 2) +
                Math.pow(tileCenterY - viewportY, 2)
            );
            
            tile.distance = distance;
        });

        // ترتيب حسب المسافة
        const sorted = [...sceneTiles].sort((a, b) => a.distance - b.distance);
        
        // تحميل أقرب المربعات
        const toLoad = sorted.slice(0, this.maxLoadedTiles);
        
        toLoad.forEach(tile => {
            if (!tile.loaded) {
                this.loadTile(sceneId, tile);
            }
        });

        // تفريغ البعيدة
        this.unloadDistantTiles(sceneId, sorted);
    }

    // تحميل مربع
    loadTile(sceneId, tile) {
        // إنشاء عنصر HTML للعرض
        const img = document.createElement('img');
        img.src = tile.imageData;
        img.style.position = 'absolute';
        img.style.left = `${tile.col * this.tileSize}px`;
        img.style.top = `${tile.row * this.tileSize}px`;
        img.style.width = `${this.tileSize}px`;
        img.style.height = `${this.tileSize}px`;
        
        tile.element = img;
        tile.loaded = true;
        
        this.stats.loadedTiles++;
        
        console.log(`✅ تحميل مربع ${tile.id}`);
    }

    // تفريغ المربعات البعيدة
    unloadDistantTiles(sceneId, sortedTiles) {
        const toKeep = new Set(sortedTiles.slice(0, this.maxLoadedTiles).map(t => t.id));
        
        const sceneTiles = this.tiles.get(sceneId);
        sceneTiles.forEach(tile => {
            if (tile.loaded && !toKeep.has(tile.id)) {
                if (tile.element) {
                    tile.element.remove();
                    delete tile.element;
                }
                tile.loaded = false;
                this.stats.loadedTiles--;
                
                console.log(`🧹 تفريغ مربع ${tile.id}`);
            }
        });
    }

    // تحديث بناءً على حركة الكاميرا
    onCameraMove(x, y) {
        this.loadTilesAroundViewport(this.currentScene, x, y);
    }

    // الحصول على إحصائيات
    getStats() {
        return {
            ...this.stats,
            memoryMB: (this.stats.loadedTiles * this.tileSize * this.tileSize * 3 / 1024 / 1024).toFixed(2)
        };
    }
}
