// =======================================
// ACTUAL CONSTRUCTION OS - PRIORITY QUEUE
// =======================================
// طابور أولويات ذكي للتحميل

export class PriorityQueue {
    constructor(integratedLoader) {
        this.loader = integratedLoader;
        this.queue = [];
        this.processing = false;
        this.maxConcurrent = 3;
        this.currentProcessing = 0;
        
        // أولويات
        this.PRIORITY = {
            CRITICAL: 100,    // Tile في مجال الرؤية مباشرة
            HIGH: 70,         // Tile قريب من مجال الرؤية
            MEDIUM: 40,       // مشاهد متصلة
            LOW: 10,          // تحميل مسبق بعيد
            BACKGROUND: 1     // خلفية
        };

        // إحصائيات
        this.stats = {
            queued: 0,
            processed: 0,
            avgWaitTime: 0,
            priorityBreakdown: {}
        };
    }

    // إضافة مهمة للطابور
    addTask(task) {
        const taskWithPriority = {
            ...task,
            priority: this.calculatePriority(task),
            addedAt: Date.now(),
            id: `task_${Date.now()}_${Math.random()}`
        };

        // إدراج حسب الأولوية
        const index = this.queue.findIndex(t => t.priority < taskWithPriority.priority);
        if (index === -1) {
            this.queue.push(taskWithPriority);
        } else {
            this.queue.splice(index, 0, taskWithPriority);
        }

        this.stats.queued++;
        this.stats.priorityBreakdown[task.type] = (this.stats.priorityBreakdown[task.type] || 0) + 1;

        // بدء المعالجة إذا لم تكن جارية
        if (!this.processing) {
            this.processQueue();
        }

        return taskWithPriority.id;
    }

    // حساب الأولوية بناءً على عدة عوامل
    calculatePriority(task) {
        let priority = 0;

        // 1. حسب نوع المهمة
        switch (task.type) {
            case 'tile':
                priority += 50;
                break;
            case 'scene':
                priority += 30;
                break;
            case 'preload':
                priority += 10;
                break;
        }

        // 2. حسب موقع المستخدم
        if (task.viewport) {
            const distance = this.calculateDistance(task.position, task.viewport);
            priority += Math.max(0, 100 - distance) * 0.5;
        }

        // 3. حسب اتجاه النظر
        if (task.direction && task.position) {
            const inView = this.isInView(task.position, task.direction);
            if (inView) priority += 30;
        }

        // 4. حسب الأهمية المحددة مسبقاً
        if (task.importance) {
            priority += task.importance * 10;
        }

        // 5. حسب LOD المطلوب
        if (task.lod) {
            const lodPriority = { high: 30, medium: 20, low: 10 };
            priority += lodPriority[task.lod] || 0;
        }

        return Math.min(100, Math.max(1, Math.floor(priority)));
    }

    // معالجة الطابور
    async processQueue() {
        if (this.processing) return;
        this.processing = true;

        while (this.queue.length > 0 && this.currentProcessing < this.maxConcurrent) {
            // أخذ المهمة ذات الأولوية القصوى
            const task = this.queue.shift();
            
            this.currentProcessing++;
            
            // معالجة المهمة
            this.processTask(task).finally(() => {
                this.currentProcessing--;
                this.stats.processed++;
                
                // تحديث متوسط وقت الانتظار
                const waitTime = Date.now() - task.addedAt;
                this.stats.avgWaitTime = (this.stats.avgWaitTime + waitTime) / 2;
            });
        }

        this.processing = false;

        // إذا بقي مهام، استمر
        if (this.queue.length > 0) {
            setTimeout(() => this.processQueue(), 100);
        }
    }

    // معالجة مهمة واحدة
    async processTask(task) {
        try {
            console.log(`🔄 معالجة: ${task.type} (أولوية ${task.priority})`);

            switch (task.type) {
                case 'tile':
                    await this.loader.loadTileWithLOD(task.sceneId, task.tile, task.lod);
                    break;
                case 'scene':
                    await this.loader.loadScene(task.sceneId, { priority: 'high' });
                    break;
                case 'preload':
                    await this.loader.preloadScene(task.sceneId);
                    break;
            }

            // تسجيل النجاح
            if (this.loader.analytics) {
                this.loader.analytics.logTaskSuccess(task);
            }

        } catch (error) {
            console.error(`❌ فشل معالجة ${task.type}:`, error);
            
            // إعادة المحاولة بأولوية أقل
            if (task.retries < 3) {
                this.addTask({
                    ...task,
                    retries: (task.retries || 0) + 1,
                    priority: task.priority - 10
                });
            }
        }
    }

    // حساب المسافة
    calculateDistance(pos1, pos2) {
        return Math.sqrt(
            Math.pow(pos2.x - pos1.x, 2) +
            Math.pow(pos2.y - pos1.y, 2)
        );
    }

    // هل النقطة في مجال الرؤية
    isInView(position, direction) {
        if (!direction || !position) return false;

        // حساب الزاوية بين اتجاه النظر وموقع النقطة
        const dx = position.x - direction.x;
        const dy = position.y - direction.y;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const viewAngle = direction.angle || 0;
        
        // مجال رؤية 60 درجة
        const diff = Math.abs(angle - viewAngle);
        return diff < 30 || diff > 330;
    }

    // إضافة Tiles قريبة للطابور
    queueNearbyTiles(sceneId, tiles, viewport, direction) {
        tiles.forEach(tile => {
            const distance = this.calculateDistance(
                { x: tile.col * tile.size, y: tile.row * tile.size },
                viewport
            );

            // تحديد الأولوية
            let priority = this.PRIORITY.BACKGROUND;
            if (distance < 500) {
                priority = this.PRIORITY.CRITICAL;
            } else if (distance < 1000) {
                priority = this.PRIORITY.HIGH;
            } else if (distance < 2000) {
                priority = this.PRIORITY.MEDIUM;
            }

            // إضافة للطابور
            this.addTask({
                type: 'tile',
                sceneId,
                tile,
                lod: distance < 500 ? 'high' : (distance < 1000 ? 'medium' : 'low'),
                priority,
                position: { x: tile.col * tile.size, y: tile.row * tile.size },
                viewport,
                direction,
                importance: tile.importance || 1
            });
        });
    }

    // إضافة مشاهد متصلة للطابور
    queueConnectedScenes(currentSceneId, connectedScenes, currentPosition) {
        connectedScenes.forEach(scene => {
            const distance = this.calculateDistance(
                scene.position,
                currentPosition
            );

            let priority = this.PRIORITY.BACKGROUND;
            if (distance < 20) {
                priority = this.PRIORITY.HIGH;
            } else if (distance < 50) {
                priority = this.PRIORITY.MEDIUM;
            }

            this.addTask({
                type: 'preload',
                sceneId: scene.id,
                priority,
                position: scene.position,
                importance: scene.importance || 1
            });
        });
    }

    // إلغاء مهمة
    cancelTask(taskId) {
        const index = this.queue.findIndex(t => t.id === taskId);
        if (index !== -1) {
            this.queue.splice(index, 1);
            this.stats.queued--;
            return true;
        }
        return false;
    }

    // إلغاء جميع المهام لنوع معين
    cancelTasksByType(type) {
        const before = this.queue.length;
        this.queue = this.queue.filter(t => t.type !== type);
        this.stats.queued -= (before - this.queue.length);
    }

    // الحصول على إحصائيات
    getStats() {
        return {
            queueLength: this.queue.length,
            processing: this.currentProcessing,
            ...this.stats,
            priorityBreakdown: this.stats.priorityBreakdown,
            nextPriority: this.queue[0]?.priority || 0
        };
    }
}
