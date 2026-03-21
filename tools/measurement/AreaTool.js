// =======================================
// ACTUAL VIEW CONSTRUCTION OS - AREA TOOL
// =======================================

import * as THREE from 'three';

export class AreaTool {
    constructor(app) {
        this.app = app;
        this.active = false;
        this.points = [];
        this.mesh = null;
        this.area = 0;
        this.perimeter = 0;
        
        // لون المنطقة
        this.fillColor = 0x44aaff;
        this.borderColor = 0xffaa44;
        
        // عناصر الواجهة
        this.areaLabel = null;
        this.borderLines = [];
        
        console.log('✅ AreaTool initialized');
    }

    // تفعيل الأداة
    activate() {
        this.active = true;
        this.points = [];
        this.clearVisuals();
        this.app.updateStatus('📐 Area tool activated - Click to add points', 'info');
        this.setupEventListeners();
    }

    // تعطيل الأداة
    deactivate() {
        this.active = false;
        this.points = [];
        this.clearVisuals();
        this.app.updateStatus('📐 Area tool deactivated', 'info');
        this.removeEventListeners();
    }

    // إضافة نقطة
    addPoint(position) {
        if (!this.active) return;
        
        this.points.push(position.clone());
        this.updateVisuals();
        
        if (this.points.length >= 3) {
            this.calculateArea();
            this.app.updateStatus(`📐 Area: ${this.area.toFixed(2)} m²`, 'success');
        }
        
        // إضافة نقطة مرئية
        this.addPointMarker(position);
    }

    // حساب المساحة والمحيط
    calculateArea() {
        if (this.points.length < 3) {
            this.area = 0;
            this.perimeter = 0;
            return;
        }
        
        // حساب المساحة باستخدام صيغة المضلع (Shoelace formula)
        let area = 0;
        let perimeter = 0;
        
        for (let i = 0; i < this.points.length; i++) {
            const j = (i + 1) % this.points.length;
            
            // المساحة
            area += this.points[i].x * this.points[j].z;
            area -= this.points[j].x * this.points[i].z;
            
            // المحيط
            const dx = this.points[j].x - this.points[i].x;
            const dz = this.points[j].z - this.points[i].z;
            perimeter += Math.sqrt(dx * dx + dz * dz);
        }
        
        this.area = Math.abs(area) / 2;
        this.perimeter = perimeter;
        
        // تحديث واجهة المستخدم
        this.updateUI();
        
        return { area: this.area, perimeter: this.perimeter };
    }

    // إنشاء المنطقة المرئية
    updateVisuals() {
        this.clearVisuals();
        
        if (this.points.length < 2) return;
        
        // رسم الخطوط
        const points3D = this.points.map(p => new THREE.Vector3(p.x, p.y + 0.05, p.z));
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points3D);
        const lineMaterial = new THREE.LineBasicMaterial({ color: this.borderColor });
        const lineLoop = new THREE.LineLoop(lineGeometry, lineMaterial);
        this.app.engine.scene.add(lineLoop);
        this.borderLines.push(lineLoop);
        
        // إنشاء المنطقة المملوءة (إذا كان لدينا 3 نقاط أو أكثر)
        if (this.points.length >= 3) {
            const shape = new THREE.Shape();
            shape.moveTo(this.points[0].x, this.points[0].z);
            for (let i = 1; i < this.points.length; i++) {
                shape.lineTo(this.points[i].x, this.points[i].z);
            }
            shape.closePath();
            
            const geometry = new THREE.ShapeGeometry(shape);
            const material = new THREE.MeshBasicMaterial({ 
                color: this.fillColor, 
                transparent: true, 
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.position.y = 0.04;
            this.mesh.rotation.x = -Math.PI / 2;
            this.app.engine.scene.add(this.mesh);
        }
    }

    // إضافة نقطة مرئية
    addPointMarker(position) {
        const geometry = new THREE.SphereGeometry(0.1, 16, 16);
        const material = new THREE.MeshStandardMaterial({ color: 0xffaa44 });
        const marker = new THREE.Mesh(geometry, material);
        marker.position.copy(position);
        marker.position.y += 0.1;
        marker.userData = { type: 'areaPoint' };
        this.app.engine.scene.add(marker);
        this.borderLines.push(marker);
    }

    // مسح العناصر المرئية
    clearVisuals() {
        this.borderLines.forEach(item => {
            this.app.engine.scene.remove(item);
        });
        this.borderLines = [];
        
        if (this.mesh) {
            this.app.engine.scene.remove(this.mesh);
            this.mesh = null;
        }
    }

    // تحديث واجهة المستخدم
    updateUI() {
        const props = document.getElementById('propertiesGrid');
        if (props) {
            const areaDiv = document.createElement('div');
            areaDiv.className = 'property-group';
            areaDiv.innerHTML = `
                <div class="property-group-title"><i class="fas fa-draw-polygon"></i> Area Tool</div>
                <div class="property-row"><span class="property-label">Area:</span><span class="property-value">${this.area.toFixed(2)} m²</span></div>
                <div class="property-row"><span class="property-label">Perimeter:</span><span class="property-value">${this.perimeter.toFixed(2)} m</span></div>
                <div class="property-row"><span class="property-label">Points:</span><span class="property-value">${this.points.length}</span></div>
            `;
            
            // إزالة العنصر القديم
            const oldArea = props.querySelector('.area-tool-group');
            if (oldArea) oldArea.remove();
            areaDiv.classList.add('area-tool-group');
            props.appendChild(areaDiv);
        }
    }

    // أحداث النقر
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
        
        // استخدام مستوى الأرضية (y=0)
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const target = new THREE.Vector3();
        
        if (raycaster.ray.intersectPlane(plane, target)) {
            this.addPoint(target);
        }
    }

    // مسح جميع النقاط
    reset() {
        this.points = [];
        this.clearVisuals();
        this.area = 0;
        this.perimeter = 0;
        this.updateUI();
        this.app.updateStatus('📐 Area tool reset', 'info');
    }

    // إلغاء آخر نقطة
    undo() {
        if (this.points.length > 0) {
            this.points.pop();
            this.updateVisuals();
            if (this.points.length >= 3) {
                this.calculateArea();
            } else {
                this.area = 0;
                this.perimeter = 0;
            }
            this.updateUI();
            this.app.updateStatus('📐 Last point removed', 'info');
        }
    }
}
