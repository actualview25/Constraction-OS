// =======================================
// ACTUAL VIEW CONSTRUCTION OS - VOLUME TOOL
// =======================================
// أداة قياس حجم المواد والأحجام ثلاثية الأبعاد

import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export class VolumeTool {
    constructor(app) {
        this.app = app;
        this.active = false;
        this.points = [];
        this.mesh = null;
        this.volume = 0;
        this.surfaceArea = 0;
        
        // إعدادات العرض
        this.fillColor = 0x44ffaa;
        this.borderColor = 0xffaa44;
        this.opacity = 0.4;
        
        // عناصر الواجهة
        this.label = null;
        this.borderLines = [];
        this.measurements = [];
        
        console.log('✅ VolumeTool initialized');
    }

    /**
     * تفعيل الأداة
     */
    activate() {
        this.active = true;
        this.points = [];
        this.clearVisuals();
        this.app.updateStatus('📦 Volume tool activated - Click points to define shape (minimum 4 points)', 'info');
        this.setupEventListeners();
    }

    /**
     * تعطيل الأداة
     */
    deactivate() {
        this.active = false;
        this.clearVisuals();
        this.app.updateStatus('📦 Volume tool deactivated', 'info');
        this.removeEventListeners();
    }

    /**
     * إضافة نقطة
     * @param {THREE.Vector3} position - موقع النقطة
     */
    addPoint(position) {
        if (!this.active) return;
        
        this.points.push(position.clone());
        this.addPointMarker(position);
        this.updateVisuals();
        
        if (this.points.length >= 4) {
            this.calculateVolume();
            this.app.updateStatus(`📦 Volume: ${this.volume.toFixed(2)} m³ (${this.points.length} points)`, 'success');
        } else {
            this.app.updateStatus(`📦 Added point ${this.points.length}/4 - need ${4 - this.points.length} more points`, 'info');
        }
    }

    /**
     * حساب الحجم والمساحة السطحية
     */
    calculateVolume() {
        if (this.points.length < 4) {
            this.volume = 0;
            this.surfaceArea = 0;
            return;
        }

        // حساب مركز النقاط
        const center = new THREE.Vector3();
        this.points.forEach(p => center.add(p));
        center.divideScalar(this.points.length);

        // حساب الحجم بتقسيم المضلع إلى مثلثات
        let volume = 0;
        let surfaceArea = 0;

        for (let i = 0; i < this.points.length; i++) {
            const j = (i + 1) % this.points.length;
            const k = (i + 2) % this.points.length;
            
            // حساب حجم الهرم
            const p1 = this.points[i];
            const p2 = this.points[j];
            const p3 = this.points[k];
            
            // مساحة المثلث
            const v1 = new THREE.Vector3().subVectors(p2, p1);
            const v2 = new THREE.Vector3().subVectors(p3, p1);
            const cross = new THREE.Vector3().crossVectors(v1, v2);
            const area = cross.length() / 2;
            surfaceArea += area;
            
            // ارتفاع الهرم (المسافة من المركز إلى مستوى المثلث)
            const normal = cross.clone().normalize();
            const distanceToPlane = Math.abs(normal.dot(p1.clone().sub(center)));
            volume += area * distanceToPlane / 3;
        }

        this.volume = volume;
        this.surfaceArea = surfaceArea;
        
        // إضافة القياس للسجل
        this.measurements.push({
            id: `volume-${Date.now()}`,
            points: this.points.map(p => p.clone()),
            volume: this.volume,
            surfaceArea: this.surfaceArea,
            timestamp: new Date().toISOString()
        });
        
        // تحديث واجهة المستخدم
        this.updateUI();
        
        return { volume: this.volume, surfaceArea: this.surfaceArea };
    }

    /**
     * إنشاء المجسم المرئي
     */
    updateVisuals() {
        this.clearVisuals();
        
        if (this.points.length < 3) return;
        
        // إنشاء الشكل
        const shape = new THREE.Shape();
        shape.moveTo(this.points[0].x, this.points[0].z);
        for (let i = 1; i < this.points.length; i++) {
            shape.lineTo(this.points[i].x, this.points[i].z);
        }
        shape.closePath();
        
        // حساب متوسط الارتفاع
        let avgHeight = 0;
        this.points.forEach(p => avgHeight += p.y);
        avgHeight /= this.points.length;
        
        // إنشاء الهندسة البثق
        const extrudeSettings = {
            steps: 1,
            depth: avgHeight,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 3
        };
        
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geometry.computeVertexNormals();
        
        // إنشاء المادة
        const material = new THREE.MeshStandardMaterial({
            color: this.fillColor,
            transparent: true,
            opacity: this.opacity,
            side: THREE.DoubleSide,
            roughness: 0.4,
            metalness: 0.1
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.y = 0;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.userData = {
            type: 'volume',
            volume: this.volume,
            points: this.points.length
        };
        this.app.engine.scene.add(this.mesh);
        
        // رسم الحدود
        this.drawBoundary();
        
        // إضافة نص الحجم
        this.addVolumeLabel();
    }

    /**
     * رسم حدود المجسم
     */
    drawBoundary() {
        if (this.points.length < 2) return;
        
        // نقاط القاعدة
        const basePoints = this.points.map(p => new THREE.Vector3(p.x, 0, p.z));
        
        // الخط السفلي
        const bottomLineGeo = new THREE.BufferGeometry().setFromPoints(basePoints);
        const lineMat = new THREE.LineBasicMaterial({ color: this.borderColor });
        const bottomLine = new THREE.LineLoop(bottomLineGeo, lineMat);
        this.app.engine.scene.add(bottomLine);
        this.borderLines.push(bottomLine);
        
        // الأعمدة الرأسية
        for (let i = 0; i < this.points.length; i++) {
            const p = this.points[i];
            const verticalPoints = [
                new THREE.Vector3(p.x, 0, p.z),
                new THREE.Vector3(p.x, p.y, p.z)
            ];
            const verticalGeo = new THREE.BufferGeometry().setFromPoints(verticalPoints);
            const verticalLine = new THREE.Line(verticalGeo, lineMat);
            this.app.engine.scene.add(verticalLine);
            this.borderLines.push(verticalLine);
        }
        
        // الخط العلوي
        const topPoints = this.points.map(p => new THREE.Vector3(p.x, p.y, p.z));
        const topLineGeo = new THREE.BufferGeometry().setFromPoints(topPoints);
        const topLine = new THREE.LineLoop(topLineGeo, lineMat);
        this.app.engine.scene.add(topLine);
        this.borderLines.push(topLine);
    }

    /**
     * إضافة نقطة مرئية
     * @param {THREE.Vector3} position - موقع النقطة
     */
    addPointMarker(position) {
        const geometry = new THREE.SphereGeometry(0.15, 16, 16);
        const material = new THREE.MeshStandardMaterial({ color: 0xffaa44, emissive: 0x442200 });
        const marker = new THREE.Mesh(geometry, material);
        marker.position.copy(position);
        marker.position.y += 0.05;
        marker.userData = { type: 'volumePoint', index: this.points.length - 1 };
        this.app.engine.scene.add(marker);
        this.borderLines.push(marker);
    }

    /**
     * إضافة نص الحجم
     */
    addVolumeLabel() {
        if (this.label) {
            this.app.engine.scene.remove(this.label);
        }
        
        // حساب مركز المجسم
        const center = new THREE.Vector3();
        this.points.forEach(p => center.add(p));
        center.divideScalar(this.points.length);
        center.y += 0.5;
        
        // إنشاء عنصر HTML للنص
        const div = document.createElement('div');
        div.textContent = `${this.volume.toFixed(2)} m³`;
        div.style.backgroundColor = 'rgba(0,0,0,0.7)';
        div.style.color = '#44ffaa';
        div.style.padding = '4px 8px';
        div.style.borderRadius = '6px';
        div.style.fontSize = '12px';
        div.style.fontFamily = 'monospace';
        div.style.border = '1px solid #44ffaa';
        div.style.whiteSpace = 'nowrap';
        div.style.fontWeight = 'bold';
        
        const css2dObject = new CSS2DObject(div);
        css2dObject.position.copy(center);
        
        this.label = css2dObject;
        this.app.engine.scene.add(this.label);
    }

    /**
     * مسح العناصر المرئية
     */
    clearVisuals() {
        this.borderLines.forEach(item => {
            this.app.engine.scene.remove(item);
        });
        this.borderLines = [];
        
        if (this.mesh) {
            this.app.engine.scene.remove(this.mesh);
            this.mesh = null;
        }
        
        if (this.label) {
            this.app.engine.scene.remove(this.label);
            this.label = null;
        }
    }

    /**
     * تحديث واجهة المستخدم
     */
    updateUI() {
        const props = document.getElementById('propertiesGrid');
        if (!props) return;
        
        // إزالة العنصر القديم
        const oldVolume = props.querySelector('.volume-tool-group');
        if (oldVolume) oldVolume.remove();
        
        // إنشاء عنصر جديد
        const volumeDiv = document.createElement('div');
        volumeDiv.className = 'property-group volume-tool-group';
        volumeDiv.innerHTML = `
            <div class="property-group-title"><i class="fas fa-cube"></i> Volume Tool</div>
            <div class="property-row"><span class="property-label">Volume:</span><span class="property-value">${this.volume.toFixed(2)} m³</span></div>
            <div class="property-row"><span class="property-label">Surface Area:</span><span class="property-value">${this.surfaceArea.toFixed(2)} m²</span></div>
            <div class="property-row"><span class="property-label">Points:</span><span class="property-value">${this.points.length}</span></div>
            <div class="property-row"><span class="property-label">Measurements:</span><span class="property-value">${this.measurements.length}</span></div>
        `;
        
        // إضافة أزرار التحكم
        const buttonDiv = document.createElement('div');
        buttonDiv.style.marginTop = '10px';
        buttonDiv.style.display = 'flex';
        buttonDiv.style.gap = '5px';
        buttonDiv.innerHTML = `
            <button class="btn" onclick="window.app?.engine?.volumeTool?.reset()" style="flex:1">Reset</button>
            <button class="btn" onclick="window.app?.engine?.volumeTool?.exportMeasurements()" style="flex:1">Export</button>
        `;
        volumeDiv.appendChild(buttonDiv);
        
        props.appendChild(volumeDiv);
    }

    /**
     * إعادة تعيين الأداة
     */
    reset() {
        this.points = [];
        this.volume = 0;
        this.surfaceArea = 0;
        this.clearVisuals();
        this.updateUI();
        this.app.updateStatus('📦 Volume tool reset', 'info');
    }

    /**
     * تصدير القياسات
     */
    exportMeasurements() {
        if (this.measurements.length === 0) {
            this.app.updateStatus('📦 No measurements to export', 'info');
            return;
        }
        
        let report = '📦 Volume Measurements Report\n';
        report += '══════════════════════════════\n\n';
        
        this.measurements.forEach((m, i) => {
            report += `${i+1}. Volume: ${m.volume.toFixed(2)} m³\n`;
            report += `   Surface Area: ${m.surfaceArea.toFixed(2)} m²\n`;
            report += `   Points: ${m.points.length}\n`;
            report += `   Time: ${m.timestamp}\n\n`;
        });
        
        report += '══════════════════════════════\n';
        report += `Total: ${this.measurements.length} measurements\n`;
        report += `Total Volume: ${this.measurements.reduce((sum, m) => sum + m.volume, 0).toFixed(2)} m³\n`;
        
        // نسخ إلى الحافظة
        navigator.clipboard.writeText(report);
        this.app.updateStatus('📦 Report copied to clipboard', 'success');
        
        return report;
    }

    /**
     * أحداث النقر
     */
    setupEventListeners() {
        this.clickHandler = this.onClick.bind(this);
        this.app.engine.renderer.domElement.addEventListener('click', this.clickHandler);
    }

    removeEventListeners() {
        if (this.clickHandler) {
            this.app.engine.renderer.domElement.removeEventListener('click', this.clickHandler);
        }
    }

    onClick(event) {
        if (!this.active) return;
        
        // حساب موقع النقر في العالم ثلاثي الأبعاد
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / this.app.engine.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / this.app.engine.renderer.domElement.clientHeight) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.app.engine.camera);
        
        // استخدام مستوى الأرضية (y=0) كقاعدة
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const target = new THREE.Vector3();
        
        if (raycaster.ray.intersectPlane(plane, target)) {
            // يمكن إضافة ارتفاع محدد من المستخدم
            const height = parseFloat(prompt('Enter height (m):', '2.0'));
            if (!isNaN(height)) {
                target.y = height;
                this.addPoint(target);
            } else {
                this.app.updateStatus('📦 Invalid height entered', 'error');
            }
        }
    }
}
