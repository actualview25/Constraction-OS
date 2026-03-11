// =======================================
// ACTUAL VIEW CONSTRUCTION OS - CLASH DETECTION
// =======================================

export class ClashDetection {
    constructor(globalSystem, sceneConnector) {
        this.globalSystem = globalSystem;
        this.sceneConnector = sceneConnector;
        this.clashes = [];
        console.log('✅ ClashDetection initialized');
    }

    // فحص التعارضات في مشهد معين
    detectInScene(sceneId) {
        console.log(`🔍 فحص التعارضات في المشهد ${sceneId}`);
        
        const elements = this.sceneConnector.getElementsInScene(sceneId) || [];
        const sceneClashes = [];
        
        // فحص كل زوج من العناصر
        for (let i = 0; i < elements.length; i++) {
            for (let j = i + 1; j < elements.length; j++) {
                const clash = this.checkClash(elements[i], elements[j]);
                if (clash) {
                    sceneClashes.push(clash);
                }
            }
        }
        
        this.clashes = [...this.clashes, ...sceneClashes];
        return sceneClashes;
    }

    // فحص تعارض بين عنصرين
    checkClash(elementA, elementB) {
        if (!elementA.boundingBox || !elementB.boundingBox) return null;
        
        const boxA = elementA.boundingBox;
        const boxB = elementB.boundingBox;
        
        // فحص تقاطع الصناديق المحيطة
        if (this.boxesIntersect(boxA, boxB)) {
            return {
                id: `clash-${Date.now()}-${Math.random()}`,
                elements: [elementA.id, elementB.id],
                type: 'hard',
                severity: this.calculateSeverity(boxA, boxB),
                location: this.getIntersectionPoint(boxA, boxB),
                penetration: this.calculatePenetration(boxA, boxB),
                timestamp: new Date().toISOString()
            };
        }
        
        return null;
    }

    // فحص تقاطع صندوقين
    boxesIntersect(boxA, boxB) {
        return !(boxA.max.x < boxB.min.x ||
                boxA.min.x > boxB.max.x ||
                boxA.max.y < boxB.min.y ||
                boxA.min.y > boxB.max.y ||
                boxA.max.z < boxB.min.z ||
                boxA.min.z > boxB.max.z);
    }

    // حساب شدة التعارض
    calculateSeverity(boxA, boxB) {
        const volumeA = (boxA.max.x - boxA.min.x) * 
                       (boxA.max.y - boxA.min.y) * 
                       (boxA.max.z - boxA.min.z);
        
        const volumeB = (boxB.max.x - boxB.min.x) * 
                       (boxB.max.y - boxB.min.y) * 
                       (boxB.max.z - boxB.min.z);
        
        const intersection = this.getIntersectionVolume(boxA, boxB);
        const ratio = intersection / Math.min(volumeA, volumeB);
        
        if (ratio > 0.3) return 'high';
        if (ratio > 0.1) return 'medium';
        return 'low';
    }

    // حساب حجم التقاطع
    getIntersectionVolume(boxA, boxB) {
        const xOverlap = Math.max(0, Math.min(boxA.max.x, boxB.max.x) - Math.max(boxA.min.x, boxB.min.x));
        const yOverlap = Math.max(0, Math.min(boxA.max.y, boxB.max.y) - Math.max(boxA.min.y, boxB.min.y));
        const zOverlap = Math.max(0, Math.min(boxA.max.z, boxB.max.z) - Math.max(boxA.min.z, boxB.min.z));
        
        return xOverlap * yOverlap * zOverlap;
    }

    // حساب عمق الاختراق
    calculatePenetration(boxA, boxB) {
        return {
            x: Math.min(boxA.max.x, boxB.max.x) - Math.max(boxA.min.x, boxB.min.x),
            y: Math.min(boxA.max.y, boxB.max.y) - Math.max(boxA.min.y, boxB.min.y),
            z: Math.min(boxA.max.z, boxB.max.z) - Math.max(boxA.min.z, boxB.min.z)
        };
    }

    // نقطة التقاطع
    getIntersectionPoint(boxA, boxB) {
        return {
            x: (Math.max(boxA.min.x, boxB.min.x) + Math.min(boxA.max.x, boxB.max.x)) / 2,
            y: (Math.max(boxA.min.y, boxB.min.y) + Math.min(boxA.max.y, boxB.max.y)) / 2,
            z: (Math.max(boxA.min.z, boxB.min.z) + Math.min(boxA.max.z, boxB.max.z)) / 2
        };
    }

    // الحصول على تقرير
    getReport() {
        return {
            total: this.clashes.length,
            bySeverity: {
                high: this.clashes.filter(c => c.severity === 'high').length,
                medium: this.clashes.filter(c => c.severity === 'medium').length,
                low: this.clashes.filter(c => c.severity === 'low').length
            },
            clashes: this.clashes
        };
    }

    // تصدير بصيغة JSON
    toJSON() {
        return JSON.stringify(this.getReport(), null, 2);
    }
}
