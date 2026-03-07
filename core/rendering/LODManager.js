// =======================================
// ACTUAL CONSTRUCTION OS - LOD MANAGER
// =======================================
// مستويات تفاصيل متعددة للكيانات

export class LODManager {
    constructor(camera) {
        this.camera = camera;
        this.entities = new Map();        // الكيانات مع LODs
        this.distances = {
            high: 10,      // أقل من 10 متر → تفاصيل عالية
            medium: 30,    // 10-30 متر → تفاصيل متوسطة
            low: 100,      // 30-100 متر → تفاصيل منخفضة
            culled: 100    // أكثر من 100 متر → لا ترسم
        };
        
        this.stats = {
            high: 0,
            medium: 0,
            low: 0,
            culled: 0
        };
    }

    // إضافة كيان مع مستويات التفاصيل
    addEntity(entityId, meshes) {
        this.entities.set(entityId, {
            id: entityId,
            meshes: {
                high: meshes.high,      // عالي التفاصيل
                medium: meshes.medium,  // متوسط
                low: meshes.low,        // منخفض
                current: meshes.high
            },
            position: meshes.position,
            lastLOD: 'high',
            visible: true
        });
    }

    // تحديث LOD بناءً على المسافة
    update() {
        if (!this.camera) return;

        // إعادة تعيين الإحصائيات
        this.stats = { high: 0, medium: 0, low: 0, culled: 0 };

        this.entities.forEach((entity, id) => {
            // حساب المسافة من الكاميرا
            const distance = this.camera.position.distanceTo(entity.position);
            
            // اختيار المستوى المناسب
            let newLOD = 'culled';
            let mesh = null;

            if (distance < this.distances.high) {
                newLOD = 'high';
                mesh = entity.meshes.high;
                this.stats.high++;
            } else if (distance < this.distances.medium) {
                newLOD = 'medium';
                mesh = entity.meshes.medium;
                this.stats.medium++;
            } else if (distance < this.distances.low) {
                newLOD = 'low';
                mesh = entity.meshes.low;
                this.stats.low++;
            } else {
                newLOD = 'culled';
                this.stats.culled++;
            }

            // تطبيق التغيير
            if (newLOD !== entity.lastLOD) {
                this.switchLOD(entity, newLOD, mesh);
            }
        });
    }

    // التبديل بين المستويات
    switchLOD(entity, newLOD, newMesh) {
        // إخفاء القديم
        if (entity.meshes.current) {
            entity.meshes.current.visible = false;
        }

        // إظهار الجديد
        if (newMesh) {
            newMesh.visible = true;
            entity.meshes.current = newMesh;
        }

        entity.lastLOD = newLOD;
        
        console.log(`🔄 ${entity.id}: ${newLOD}`);
    }

    // إنشاء نسخ مختلفة التفاصيل لكيان
    static createLODVersions(originalMesh, options = {}) {
        const high = originalMesh.clone();
        
        // نسخة متوسطة (نصف التفاصيل)
        const medium = originalMesh.clone();
        if (medium.geometry) {
            // تقليل عدد المثلثات
            medium.geometry = this.simplifyGeometry(medium.geometry, 0.5);
        }

        // نسخة منخفضة (ربع التفاصيل)
        const low = originalMesh.clone();
        if (low.geometry) {
            low.geometry = this.simplifyGeometry(low.geometry, 0.25);
        }

        return { high, medium, low, position: originalMesh.position.clone() };
    }

    // تبسيط الهندسة (تقليل المثلثات)
    static simplifyGeometry(geometry, factor) {
        // هنا يمكن استخدام مكتبة مثل THREE.SimplifyModifier
        // للتبسيط، نعيد نفس الهندسة
        return geometry.clone();
    }

    // ضبط مسافات LOD
    setDistances(high, medium, low, culled) {
        this.distances = { high, medium, low, culled };
    }

    // الحصول على إحصائيات
    getStats() {
        return {
            ...this.stats,
            total: this.entities.size
        };
    }
}
