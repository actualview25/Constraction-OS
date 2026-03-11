// =======================================
// ACTUAL VIEW CONSTRUCTION OS - WORKER MARKERS
// =======================================

import * as THREE from 'three';

export class WorkerMarkers {
    constructor(scene) {
        this.scene = scene;
        this.markers = new Map();
        this.materials = {
            active: new THREE.MeshStandardMaterial({ color: 0x44ff44 }),
            idle: new THREE.MeshStandardMaterial({ color: 0xffaa44 }),
            busy: new THREE.MeshStandardMaterial({ color: 0xff4444 }),
            offline: new THREE.MeshStandardMaterial({ color: 0x888888 })
        };
        console.log('✅ WorkerMarkers initialized');
    }

    // إنشاء علامة لعامل
    createMarker(workerId, position, status = 'idle') {
        // جسم العلامة (مكعب)
        const geometry = new THREE.BoxGeometry(0.5, 1, 0.5);
        const material = this.getMaterialForStatus(status);
        const marker = new THREE.Mesh(geometry, material);
        
        marker.position.set(position.x, position.y + 0.5, position.z);
        marker.castShadow = true;
        marker.receiveShadow = true;
        
        // إضافة رأس (كرة)
        const headGeo = new THREE.SphereGeometry(0.25);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xffaa44 });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 0.75;
        marker.add(head);
        
        // إضافة علامة النشاط
        this.addActivityIndicator(marker, status);
        
        // تخزين البيانات
        marker.userData = {
            type: 'worker',
            workerId,
            status,
            createdAt: new Date().toISOString()
        };
        
        this.markers.set(workerId, marker);
        this.scene.add(marker);
        
        return marker;
    }

    // إضافة مؤشر النشاط
    addActivityIndicator(marker, status) {
        let color;
        switch(status) {
            case 'active': color = 0x44ff44; break;
            case 'busy': color = 0xff4444; break;
            case 'idle': color = 0xffaa44; break;
            default: color = 0x888888;
        }
        
        const indicatorGeo = new THREE.SphereGeometry(0.1);
        const indicatorMat = new THREE.MeshStandardMaterial({ color, emissive: color });
        const indicator = new THREE.Mesh(indicatorGeo, indicatorMat);
        indicator.position.y = 1.2;
        marker.add(indicator);
    }

    // تحديث موقع العامل
    updateWorkerPosition(workerId, newPosition) {
        const marker = this.markers.get(workerId);
        if (!marker) return false;
        
        marker.position.set(newPosition.x, newPosition.y + 0.5, newPosition.z);
        return true;
    }

    // تحديث حالة العامل
    updateWorkerStatus(workerId, newStatus) {
        const marker = this.markers.get(workerId);
        if (!marker) return false;
        
        // تحديث لون العلامة
        marker.material = this.getMaterialForStatus(newStatus);
        
        // تحديث مؤشر النشاط
        this.updateActivityIndicator(marker, newStatus);
        
        marker.userData.status = newStatus;
        return true;
    }

    // تحديث مؤشر النشاط
    updateActivityIndicator(marker, status) {
        const indicator = marker.children[1]; // المؤشر هو الطفل الثاني
        if (!indicator) return;
        
        let color;
        switch(status) {
            case 'active': color = 0x44ff44; break;
            case 'busy': color = 0xff4444; break;
            case 'idle': color = 0xffaa44; break;
            default: color = 0x888888;
        }
        
        indicator.material.color.setHex(color);
        indicator.material.emissive.setHex(color);
    }

    // الحصول على المادة المناسبة للحالة
    getMaterialForStatus(status) {
        switch(status) {
            case 'active': return this.materials.active;
            case 'busy': return this.materials.busy;
            case 'idle': return this.materials.idle;
            default: return this.materials.offline;
        }
    }

    // إزالة علامة عامل
    removeMarker(workerId) {
        const marker = this.markers.get(workerId);
        if (!marker) return false;
        
        this.scene.remove(marker);
        this.markers.delete(workerId);
        return true;
    }

    // إضافة مسار حركة
    addPath(workerId, points, color = 0xffaa44) {
        const pathGeometry = new THREE.BufferGeometry().setFromPoints(
            points.map(p => new THREE.Vector3(p.x, p.y, p.z))
        );
        
        const pathMaterial = new THREE.LineBasicMaterial({ color });
        const pathLine = new THREE.Line(pathGeometry, pathMaterial);
        
        pathLine.userData = {
            type: 'workerPath',
            workerId
        };
        
        this.scene.add(pathLine);
        return pathLine;
    }

    // إضافة منطقة عمل
    addWorkArea(center, radius, color = 0x44aaff) {
        const segments = 32;
        const points = [];
        
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(
                center.x + Math.cos(angle) * radius,
                center.y,
                center.z + Math.sin(angle) * radius
            ));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color });
        const circle = new THREE.LineLoop(geometry, material);
        
        circle.userData = {
            type: 'workArea',
            center,
            radius
        };
        
        this.scene.add(circle);
        return circle;
    }

    // إضافة علامة موقع مهم
    addImportantMarker(position, type = 'material', color = 0xffaa44) {
        const geometry = new THREE.ConeGeometry(0.3, 0.8, 8);
        const material = new THREE.MeshStandardMaterial({ color, emissive: color });
        const marker = new THREE.Mesh(geometry, material);
        
        marker.position.set(position.x, position.y + 0.4, position.z);
        marker.userData = {
            type: 'important',
            markerType: type
        };
        
        this.scene.add(marker);
        
        // إضافة تأثير وميض
        this.addBlinkingEffect(marker);
        
        return marker;
    }

    // إضافة تأثير وميض
    addBlinkingEffect(marker) {
        // يمكن تطويره لاحقاً
    }

    // الحصول على جميع العلامات
    getAllMarkers() {
        return Array.from(this.markers.values());
    }

    // الحصول على علامات حسب الحالة
    getMarkersByStatus(status) {
        return Array.from(this.markers.values())
            .filter(m => m.userData.status === status);
    }

    // عرض إحصائيات
    getStats() {
        return {
            total: this.markers.size,
            active: this.getMarkersByStatus('active').length,
            busy: this.getMarkersByStatus('busy').length,
            idle: this.getMarkersByStatus('idle').length,
            offline: this.getMarkersByStatus('offline').length
        };
    }

    // مسح جميع العلامات
    clearAllMarkers() {
        for (const [workerId, marker] of this.markers) {
            this.scene.remove(marker);
        }
        this.markers.clear();
    }
}
