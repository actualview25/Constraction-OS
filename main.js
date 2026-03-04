import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ========== UI MODULES ==========
import { Dashboard } from './ui/Dashboard.js';
import { Toolbar } from './ui/Toolbar.js';
import { PropertiesPanel } from './ui/PropertiesPanel.js';

// ========== MATERIALS LIBRARY ==========
import { MaterialLibrary } from './materials/MaterialLibrary.js';

// ========== EARTHWORKS MODULES ==========
import { Excavation } from './modules/Earthworks/Excavation.js';
import { Compaction } from './modules/Earthworks/Compaction.js';
import { SoilMaterial } from './modules/Earthworks/SoilMaterial.js';

// ========== CONCRETE MODULES ==========
import { Foundation } from './modules/Concrete/Foundation.js';
import { Column } from './modules/Concrete/Column.js';
import { Beam } from './modules/Concrete/Beam.js';
import { Slab } from './modules/Concrete/Slab.js';
import { Rebar, RebarLayout } from './modules/Concrete/Rebar.js';
import { ConcreteMaterial } from './modules/Concrete/ConcreteMaterial.js';

// ========== ARCHITECTURE MODULES ==========
import { Wall } from './modules/Architecture/Wall.js';
import { Door } from './modules/Architecture/Door.js';
import { Window } from './modules/Architecture/Window.js';
import { Floor } from './modules/Architecture/Floor.js';
import { Finish } from './modules/Architecture/Finish.js';
import { BuildingMaterial } from './modules/Architecture/Material.js';

// ========== MEP MODULES ==========
import { ElectricalCircuit } from './modules/MEP/Electrical.js';
import { PlumbingSystem } from './modules/MEP/Plumbing.js';
import { HVACSystem } from './modules/MEP/HVAC.js';
import { DrainageSystem } from './modules/MEP/Drainage.js';
import { Pipe } from './modules/MEP/Pipe.js';
import { MEPMaterial } from './modules/MEP/Material.js';

// ========== BOQ MODULES ==========
import { BOQCalculator } from './modules/BOQ/Calculator.js';
import { BOQReporter } from './modules/BOQ/Reporter.js';
import { BOQExporter } from './modules/BOQ/Exporter.js';

// ========== GEO REFERENCING ==========
import { ReferencePolyline } from './core/GeoReferencing.js';

// ========== CORE MANAGERS ==========
import { SceneManager } from './core/SceneManager.js';
import { ProjectManager } from './core/ProjectManager.js';

// =======================================
// 🎯 MAIN CONSTRUCTION OS CLASS
// =======================================

class ConstructionOS {
    constructor() {
        console.log('🚀 بدء تشغيل ACTUAL CONSTRUCTION OS...');
        
        // ===== THREE.JS SETUP =====
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111122);
        
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(30, 20, 30);
        this.camera.lookAt(0, 5, 0);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('container').appendChild(this.renderer.domElement);
        
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2;
        
        // ===== CORE MANAGERS =====
        this.sceneManager = new SceneManager(this);
        this.projectManager = new ProjectManager(this);
        
        // ===== SYSTEM COMPONENTS =====
        this.project = {
            name: 'مشروع جديد',
            location: '',
            date: new Date().toISOString(),
            scale: 1.0
        };
        
        this.boundary = null;
        this.allElements = [];
        this.concreteElements = [];
        this.archElements = [];
        this.mepSystems = [];
        
        // ===== BOQ SYSTEM =====
        this.boqCalculator = new BOQCalculator(this);
        this.boqReporter = new BOQReporter(this.boqCalculator);
        this.boqExporter = new BOQExporter(this.boqReporter);
        
        // ===== UI COMPONENTS =====
        this.materialLibrary = new MaterialLibrary();
        this.dashboard = new Dashboard(this);
        this.toolbar = new Toolbar(this);
        this.propertiesPanel = new PropertiesPanel(this);
        
        // ===== SETUP =====
        this.setupLights();
        this.setupGrid();
        this.setupHelpers();
        this.setupSelection();
        this.setupUI();
        
        // بدء الحركة
        this.animate();
        
        // تحديث شريط الحالة
        this.updateStatus('✅ المنصة جاهزة للعمل');
        
        console.log('✅ ACTUAL CONSTRUCTION OS جاهز للتشغيل');
    }
    
    // ===== الإضاءة =====
    setupLights() {
        const ambientLight = new THREE.AmbientLight(0x404060);
        this.scene.add(ambientLight);
        
        const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
        sunLight.position.set(20, 30, 20);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        this.scene.add(sunLight);
        
        const backLight = new THREE.DirectionalLight(0x446688, 0.5);
        backLight.position.set(-20, 10, -20);
        this.scene.add(backLight);
        
        const fillLight = new THREE.DirectionalLight(0x88aaff, 0.3);
        fillLight.position.set(-10, 5, 20);
        this.scene.add(fillLight);
    }
    
    // ===== الشبكة الأرضية =====
    setupGrid() {
        const gridHelper = new THREE.GridHelper(100, 20, 0x88aaff, 0x335588);
        gridHelper.position.y = 0;
        this.scene.add(gridHelper);
        
        const axesHelper = new THREE.AxesHelper(10);
        this.scene.add(axesHelper);
        
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }
    
    // ===== مساعدات إضافية =====
    setupHelpers() {
        const centerSphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16),
            new THREE.MeshStandardMaterial({ color: 0xffaa44, emissive: 0x442200 })
        );
        centerSphere.position.set(0, 0.5, 0);
        this.scene.add(centerSphere);
    }

    // ===== واجهة المستخدم =====
    setupUI() {
        const panel = document.createElement('div');
        panel.id = 'control-panel';
        panel.className = 'control-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h2>🏗️ ACTUAL OS</h2>
            </div>
            <div class="panel-section">
                <input type="text" id="project-name" class="input-field" value="${this.project.name}" placeholder="اسم المشروع">
            </div>
            <div class="panel-section" style="display: grid; gap: 10px;">
                <button id="btn-excavation" class="btn">⛏️ حفريات</button>
                <button id="btn-foundation" class="btn">🧱 قواعد</button>
                <button id="btn-column" class="btn">📏 أعمدة</button>
                <button id="btn-wall" class="btn">🏛️ جدران</button>
                <button id="btn-mep" class="btn">🔌 تمديدات</button>
                <button id="btn-boq" class="btn btn-success">📊 جدول الكميات</button>
                <button id="btn-export" class="btn btn-warning">📤 تصدير CSV</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        document.getElementById('btn-excavation').onclick = () => this.createExcavation();
        document.getElementById('btn-foundation').onclick = () => this.createFoundation();
        document.getElementById('btn-column').onclick = () => this.createColumn();
        document.getElementById('btn-wall').onclick = () => this.createWall();
        document.getElementById('btn-mep').onclick = () => this.createMEP();
        document.getElementById('btn-boq').onclick = () => this.showBOQ();
        document.getElementById('btn-export').onclick = () => this.exportBOQ('csv');
        
        document.getElementById('project-name').onchange = (e) => {
            this.project.name = e.target.value;
            this.updateStatus(`📋 مشروع: ${this.project.name}`);
        };
    }
    
    // ===== تحديث شريط الحالة =====
    updateStatus(message) {
        const statusBar = document.getElementById('statusBar');
        if (statusBar) {
            statusBar.innerHTML = message;
        }
    }
    
    // ===== تحديد العناصر =====
    setupSelection() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.renderer.domElement.addEventListener('click', (e) => {
            this.mouse.x = (e.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, this.camera);
            
            const meshes = [];
            this.scene.traverse(obj => {
                if (obj.isMesh && obj !== this.gridHelper) {
                    meshes.push(obj);
                }
            });
            
            const intersects = this.raycaster.intersectObjects(meshes);
            
            if (intersects.length > 0) {
                const selectedMesh = intersects[0].object;
                const element = this.allElements.find(el => 
                    el.mesh === selectedMesh || el.meshes?.includes(selectedMesh)
                );
                
                if (element && this.propertiesPanel) {
                    this.propertiesPanel.showForElement(element);
                    this.updateStatus(`✅ تم تحديد: ${element.constructor.name}`);
                }
            } else if (this.propertiesPanel) {
                this.propertiesPanel.hide();
            }
        });
    }
    
    // ===== إضافة عنصر =====
    addElement(element, category) {
        this.allElements.push(element);
        this.boqCalculator.addItem(element, category);
        
        if (element.createMesh) {
            const mesh = element.createMesh();
            if (mesh) {
                this.scene.add(mesh);
                element.mesh = mesh;
            }
        }
        
        if (category === 'concrete') this.concreteElements.push(element);
        else if (category === 'architecture') this.archElements.push(element);
        else if (category === 'mep') this.mepSystems.push(element);
        
        this.updateStatus(`✅ تم إضافة ${element.constructor.name}`);
        return element;
    }
    
    // ===== إنشاء حفرية =====
    createExcavation() {
        const points = [
            new THREE.Vector3(-10, 0, -10),
            new THREE.Vector3(10, 0, -10),
            new THREE.Vector3(10, 0, 10),
            new THREE.Vector3(-10, 0, 10),
            new THREE.Vector3(-10, 0, -10)
        ];
        
        this.boundary = new ReferencePolyline(points);
        this.boundary.calibrate(20, 10);
        
        const depth = parseFloat(prompt('عمق الحفر (متر):', '3')) || 3;
        const soilType = prompt('نوع التربة (topsoil/sand/gravel/rock):', 'topsoil') || 'topsoil';
        
        const excavation = new Excavation(this.boundary, depth, soilType);
        this.addElement(excavation, 'earthworks');
    }

    // =======================================
// 🚀 تشغيل التطبيق
// =======================================

window.addEventListener('load', () => {
    console.log('📦 تحميل التطبيق...');
    const app = new ConstructionOS();
    
    setTimeout(() => {
        const points = [
            new THREE.Vector3(-10, 0, -10),
            new THREE.Vector3(10, 0, -10),
            new THREE.Vector3(10, 0, 10),
            new THREE.Vector3(-10, 0, 10),
            new THREE.Vector3(-10, 0, -10)
        ];
        
        app.boundary = new ReferencePolyline(points);
        app.boundary.calibrate(20, 10);
        
        const excavation = new Excavation(app.boundary, 2.5, 'topsoil');
        app.addElement(excavation, 'earthworks');
        
        const foundation = new Foundation({
            type: 'isolated', width: 1.5, length: 1.5, height: 0.7,
            position: { x: 3, y: 0, z: 3 }
        });
        app.addElement(foundation, 'concrete');
        
        const column = new Column({
            shape: 'rectangular', width: 0.4, depth: 0.4, height: 3.2,
            position: { x: 3, y: 0, z: 3 }
        });
        app.addElement(column, 'concrete');
        
        const wall = new Wall({
            start: { x: -5, y: 0, z: -5 },
            end: { x: 5, y: 0, z: -5 },
            height: 3.0, thickness: 0.25,
            material: 'concrete_block'
        });
        app.addElement(wall, 'architecture');
        
        console.log('🏗️ تم إضافة العناصر الافتراضية');
        app.updateStatus('✅ تم تحميل المشروع التجريبي');
    }, 1000);
    
    window.addEventListener('resize', () => app.onResize());
    window.app = app;
});


