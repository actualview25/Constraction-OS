// =======================================
// ACTUAL CONSTRUCTION OS - APPLICATION LAYER
// =======================================
// الإصدار: 3.0.0 - منصة Reality-BIM المتكاملة
// =======================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

console.log('%c🏗️ ACTUAL CONSTRUCTION OS - Reality BIM Engine', 'color: #88aaff; font-size: 20px; font-weight: bold;');
console.log('%c📐 منصة متكاملة لربط صور 360 بالمخططات الهندسية', 'color: #ffaa44; font-size: 14px;');

// ========== استيراد جميع الأنظمة (ENGINE LAYER) ==========
import { GeoReferencing } from './core/Georeferencing.js';
import { SceneManager } from './core/SceneManager.js';
import { ProjectManager } from './core/ProjectManager.js';
import { GlobalEntitySystem } from './core/global/GlobalEntitySystem.js';
import { SceneConnector } from './core/global/SceneConnector.js';
import { CoordinateTransformer } from './core/global/CoordinateTransformer.js';
import { SceneGraph } from './core/bridge/SceneGraph.js';
import { StorageManager } from './core/storage/StorageManager.js';

// Reality Bridge
import { RealityBridge } from './core/bridge/RealityBridge.js';
import { SceneAnchor } from './core/bridge/SceneAnchor.js';
import { EntityMarker } from './core/bridge/EntityMarker.js';
import { SceneLink } from './core/bridge/SceneLink.js';
import { SyncManager } from './core/bridge/SyncManager.js';

// Loading Systems
import { IntegratedLoader } from './core/loading/IntegratedLoader.js';
import { LazySceneLoader } from './core/loading/LazySceneLoader.js';
import { LODManager } from './core/rendering/LODManager.js';
import { TileLODManager } from './core/loading/TileLODManager.js';
import { PriorityQueue } from './core/loading/PriorityQueue.js';

// Architecture Modules
import { Wall } from './Modules/Architecture/Wall.js';
import { Door } from './Modules/Architecture/Door.js';
import { Window } from './Modules/Architecture/Window.js';
import { Floor } from './Modules/Architecture/Floor.js';
import { Finish } from './Modules/Architecture/Finish.js';
import { Opening } from './Modules/Architecture/Opening.js';
import { BuildingMaterial } from './Modules/Architecture/Material.js';

// Architecture Global
import { GlobalWall } from './Modules/Architecture/global/GlobalWall.js';
import { GlobalFloor } from './Modules/Architecture/global/GlobalFloor.js';

// Concrete Modules
import { Foundation } from './Modules/Concrete/Foundation.js';
import { Column } from './Modules/Concrete/Column.js';
import { Beam } from './Modules/Concrete/Beam.js';
import { Slab } from './Modules/Concrete/Slab.js';
import { Rebar, RebarLayout } from './Modules/Concrete/Rebar.js';
import { ConcreteMaterial } from './Modules/Concrete/ConcreteMaterial.js';

// Concrete Global
import { GlobalBeam } from './Modules/Concrete/global/GlobalBeam.js';
import { GlobalColumn } from './Modules/Concrete/global/GlobalColumn.js';
import { GlobalSlab } from './Modules/Concrete/global/GlobalSlab.js';

// Earthworks
import { Excavation } from './Modules/Earthworks/Excavation.js';
import { Compaction } from './Modules/Earthworks/Compaction.js';
import { Layer } from './Modules/Earthworks/Layer.js';
import { SoilMaterial } from './Modules/Earthworks/SoilMaterial.js';

// Earthworks Global
import { GlobalExcavation } from './Modules/Earthworks/global/GlobalExcavation.js';
import { GlobalCompaction } from './Modules/Earthworks/global/GlobalCompaction.js';

// MEP Modules
import { ElectricalCircuit } from './Modules/MEP/Electrical.js';
import { PlumbingSystem } from './Modules/MEP/Plumbing.js';
import { HVACSystem } from './Modules/MEP/HVAC.js';
import { DrainageSystem } from './Modules/MEP/Drainage.js';
import { Pipe } from './Modules/MEP/Pipe.js';
import { Cable } from './Modules/MEP/Cable.js';
import { Fixture } from './Modules/MEP/Fixture.js';
import { MEPMaterial } from './Modules/MEP/Material.js';

// MEP Global
import { GlobalElectrical } from './Modules/MEP/global/GlobalElectrical.js';
import { GlobalPlumbing } from './Modules/MEP/global/GlobalPlumbing.js';
import { GlobalHVAC } from './Modules/MEP/global/GlobalHVAC.js';

// BOQ Modules
import { BOQCalculator } from './Modules/BOQ/Calculator.js';
import { BOQReporter } from './Modules/BOQ/Reporter.js';
import { BOQExporter } from './Modules/BOQ/Exporter.js';

// BOQ Global
import { GlobalBOQCalculator } from './Modules/BOQ/global/GlobalBOQCalculator.js';
import { GlobalReporter } from './Modules/BOQ/global/GlobalReporter.js';
import { GlobalEarthworksBOQ } from './Modules/BOQ/global/GlobalEarthworksBOQ.js';

// CAD Tools
import { CADImporter } from './tools/cad/CADImporter.js';
import { CalibrationWizard } from './tools/cad/CalibrationWizard.js';
import { DWGParser } from './tools/cad/DWGParser.js';
import { DXFParser } from './tools/cad/DXFParser.js';

// Measurement Tools
import { DistanceTool } from './tools/measurement/DistanceTool.js';
import { AreaTool } from './tools/measurement/AreaTool.js';
import { VolumeTool } from './tools/measurement/VolumeTool.js';

// Export Tools
import { ConstructionExporter } from './tools/export/ConstructionExporter.js';
import { GlobalDataExporter } from './tools/export/GlobalDataExporter.js';

// Materials Library
import { MaterialLibrary } from './materials/MaterialLibrary.js';

// UI Modules
import { Dashboard } from './ui/Dashboard.js';
import { PropertiesPanel } from './ui/PropertiesPanel.js';
import { Toolbar } from './ui/Toolbar.js';
import { GlobalEntitiesPanel } from './ui/global/GlobalEntitiesPanel.js';
import { SceneConnectorUI } from './ui/global/SceneConnectorUI.js';
import { CalibrationUI } from './ui/cad/CalibrationUI.js';
import { UniversalPropertiesPanel } from './ui/UniversalPropertiesPanel.js';

// Debug & Analytics
import { DebugLayer } from './core/debug/DebugLayer.js';
import { AnalyticsDebugger } from './core/debug/AnalyticsDebugger.js';

// Rendering
import { HybridRenderer } from './core/rendering/HybridRenderer.js';

// =======================================
// 🎯 APPLICATION LAYER
// =======================================

class ActualConstructionOS {
    constructor() {
        console.log('%c========================================', 'color: #88aaff');
        console.log('%c🚀 بدء تشغيل Application Layer', 'color: #88aaff');
        console.log('%c========================================', 'color: #88aaff');
        
        // ===== ENGINE LAYER (الأنظمة الأساسية) =====
        this.engine = {
            scene: null,
            camera: null,
            renderer: null,
            controls: null,
            geoRef: null,
            sceneManager: null,
            projectManager: null,
            globalSystem: null,
            sceneConnector: null,
            realityBridge: null,
            sceneGraph: null,
            storage: null,
            loader: null,
            lodManager: null,
            cadImporter: null,
            calibrationWizard: null,
            boqCalculator: null,
            boqReporter: null,
            materialLibrary: null
        };

        // ===== APPLICATION STATE =====
        this.state = {
            currentWorkflowStep: 1,        // 1-7
            currentViewMode: 'plan',        // plan, reality, construction
            currentScene: null,
            selectedElement: null,
            drawingMode: null,
            calibrationPoints: [],
            projectData: null,
            scenes: new Map(),
            elements: []
        };
        
        // ===== UI REFERENCES (سيتم ربطها من index.html) =====
        this.ui = {
            sceneTree: document.getElementById('sceneTree'),
            propertiesGrid: document.getElementById('propertiesGrid'),
            statusMessage: document.getElementById('statusMessage'),
            calibrationPointsList: document.getElementById('calibrationPointsList')
        };
        
        // ===== بدء تشغيل المحرك =====
        this.initEngine();
        
        // ===== بدء تشغيل واجهة المستخدم =====
        this.initUI();
        
        // ===== ربط دوال الواجهة =====
        this.bindUI();
        
        console.log('%c✅ Application Layer جاهز', 'color: #44ff44');
    }

  // ========== ENGINE INITIALIZATION ==========
initEngine() {
    try {
        // المشهد الأساسي
        this.engine.scene = new THREE.Scene();
        this.engine.scene.background = new THREE.Color(0x111122);
        this.engine.scene.fog = new THREE.Fog(0x111122, 50, 200);
        
        // الكاميرا
        this.engine.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.engine.camera.position.set(15, 10, 20);
        this.engine.camera.lookAt(0, 0, 0);
        
        // الريندرر
        this.engine.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: "high-performance"
        });
        this.engine.renderer.setSize(window.innerWidth, window.innerHeight);
        this.engine.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.engine.renderer.shadowMap.enabled = true;
        this.engine.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.engine.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.engine.renderer.toneMappingExposure = 1.2;
        document.getElementById('container').appendChild(this.engine.renderer.domElement);
        
        // التحكم
        this.engine.controls = new OrbitControls(this.engine.camera, this.engine.renderer.domElement);
        this.engine.controls.enableDamping = true;
        this.engine.controls.dampingFactor = 0.05;
        this.engine.controls.screenSpacePanning = true;
        this.engine.controls.maxPolarAngle = Math.PI / 2;
        this.engine.controls.minDistance = 5;
        this.engine.controls.maxDistance = 200;
        this.engine.controls.target.set(0, 1.6, 0);
        
        // ===== الإضاءة المتقدمة =====
        
        // إضاءة محيطة
        const ambientLight = new THREE.AmbientLight(0x404060, 0.8);
        this.engine.scene.add(ambientLight);
        
        // إضاءة شمسية رئيسية
        const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.5);
        sunLight.position.set(20, 30, 20);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 100;
        sunLight.shadow.camera.left = -30;
        sunLight.shadow.camera.right = 30;
        sunLight.shadow.camera.top = 30;
        sunLight.shadow.camera.bottom = -30;
        sunLight.shadow.bias = -0.0001;
        this.engine.scene.add(sunLight);
        
        // إضاءة خلفية
        const backLight = new THREE.DirectionalLight(0x446688, 0.5);
        backLight.position.set(-20, 10, -20);
        this.engine.scene.add(backLight);
        
        // إضاءة نقطية للمساعدة
        const fillLight = new THREE.PointLight(0x88aaff, 0.3);
        fillLight.position.set(0, 10, 0);
        this.engine.scene.add(fillLight);
        
        // ===== الأرضية والشبكة (المهمة جداً) =====
        
        // شبكة أرضية رئيسية واضحة
        const mainGrid = new THREE.GridHelper(200, 40, 0x88aaff, 0x335588);
        mainGrid.position.y = 0;
        mainGrid.name = "mainGrid";
        this.engine.scene.add(mainGrid);
        
        // شبكة ثانوية دقيقة للتفاصيل
        const detailGrid = new THREE.GridHelper(100, 50, 0x44aaff, 0x224466);
        detailGrid.position.y = 0.01; // ارتفاع طفيف لتجنب التداخل
        detailGrid.name = "detailGrid";
        this.engine.scene.add(detailGrid);
        
        // أرضية شبه شفافة لاستقبال الظلال
        const floorGeometry = new THREE.CircleGeometry(150, 64);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2a,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.receiveShadow = true;
        floor.name = "shadowFloor";
        this.engine.scene.add(floor);
        
        // محاور الإحداثيات
        const axesHelper = new THREE.AxesHelper(20);
        axesHelper.name = "axesHelper";
        this.engine.scene.add(axesHelper);
        
        // نقاط مرجعية على الأرضية
        this.addReferencePoints();
        
        // ===== تهيئة الأنظمة الأساسية =====
        
        // نظام الإسناد الجغرافي
        this.engine.geoRef = new GeoReferencing();
        this.engine.geoRef.setCoordinateSystem('utm');
        this.engine.geoRef.setOrigin(0, 0, 0);
        this.engine.geoRef.setScale(1.0);
        
        // مدير المشهد
        this.engine.sceneManager = new SceneManager(this);
        
        // مدير المشروع
        this.engine.projectManager = new ProjectManager();
        this.engine.projectManager.createProject('ACTUAL Project', 'Reality BIM Platform');
        
        // الرسم البياني للمشاهد
        this.engine.sceneGraph = new SceneGraph();
        
        // نظام التخزين
        this.engine.storage = new StorageManager();
        this.engine.storage.init();
        
        // النظام العالمي للكيانات
        this.engine.globalSystem = new GlobalEntitySystem(this.engine.geoRef);
        
        // موصل المشاهد
        this.engine.sceneConnector = new SceneConnector(this.engine.geoRef);
        this.engine.sceneConnector.setGlobalSystem(this.engine.globalSystem);
        
        // محول الإحداثيات
        this.engine.coordTransformer = new CoordinateTransformer(
            this.engine.geoRef, 
            this.engine.sceneConnector
        );
        
        // Reality Bridge
        this.engine.realityBridge = new RealityBridge(
            this.engine.globalSystem, 
            this.engine.sceneConnector, 
            this.engine.sceneGraph
        );
        
        // معالج المعايرة
        this.engine.calibrationWizard = new CalibrationWizard(
            this.engine.geoRef, 
            this.engine.sceneConnector
        );
        
        // مستورد CAD
        this.engine.cadImporter = new CADImporter(
            this.engine.geoRef, 
            this.engine.sceneConnector
        );
        
        // حاسبة الكميات
        this.engine.boqCalculator = new BOQCalculator(this);
        this.engine.boqReporter = new BOQReporter(this.engine.boqCalculator);
        
        // مكتبة المواد
        this.engine.materialLibrary = new MaterialLibrary();
        
        // محمل متكامل
        this.engine.loader = new IntegratedLoader(
            this.engine.sceneGraph,
            this.engine.storage,
            this.engine.camera
        );
        
        // LOD Manager
        this.engine.lodManager = new LODManager(this.engine.camera);
        
        // مصحح الأخطاء
        this.engine.debugLayer = new DebugLayer(
            this.engine.sceneGraph, 
            this.engine.realityBridge, 
            this.engine.loader, 
            this.engine.lodManager
        );
        
        console.log('✅ Engine initialized with all systems');
        console.log('   • Scene with enhanced grid and lighting');
        console.log('   • Reality Bridge ready for 360 images');
        console.log('   • Calibration Wizard ready for GCP');
        console.log('   • CAD Importer ready for DXF/DWG');
        
    } catch (error) {
        console.error('❌ Engine initialization failed:', error);
    }
}

// ===== دوال مساعدة إضافية =====

addReferencePoints() {
    // إضافة نقاط مرجعية على الأرضية كل 10 متر
    const pointMaterial = new THREE.PointsMaterial({ color: 0xffaa44, size: 0.2 });
    const pointGeometry = new THREE.BufferGeometry();
    
    const positions = [];
    for (let x = -50; x <= 50; x += 10) {
        for (let z = -50; z <= 50; z += 10) {
            positions.push(x, 0.05, z);
        }
    }
    
    pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const points = new THREE.Points(pointGeometry, pointMaterial);
    points.name = "referencePoints";
    this.engine.scene.add(points);
}

toggleGrid(visible) {
    const mainGrid = this.engine.scene.getObjectByName('mainGrid');
    const detailGrid = this.engine.scene.getObjectByName('detailGrid');
    
    if (mainGrid) mainGrid.visible = visible;
    if (detailGrid) detailGrid.visible = visible;
}

toggleAxes(visible) {
    const axes = this.engine.scene.getObjectByName('axesHelper');
    if (axes) axes.visible = visible;
}
    // ========== UI INITIALIZATION ==========
    initUI() {
        try {
            // تحديث شريط الحالة
            this.updateStatus('✅ المحرك جاهز', 'success');
            this.updateWorkflowStep(1);
            
            // إضافة مستمعين للأحداث
            this.setupEventListeners();
            
            console.log('✅ UI initialized');
            
        } catch (error) {
            console.error('❌ UI initialization failed:', error);
        }
    }

    // ========== BIND UI FUNCTIONS ==========
    bindUI() {
        // ربط الدوال بالـ window لتكون متاحة من الواجهة
        window.app = this;
        
        // دوال استيراد الصور و CAD
        window.importImage = () => this.importImageFromDialog();
        window.importCAD = () => this.importCADFromDialog();
        
        // دوال إنشاء العناصر
        window.startDrawWall = () => this.startDrawing('wall');
        window.startDrawColumn = () => this.startDrawing('column');
        window.addDoor = () => this.startDrawing('door');
        window.addWindow = () => this.startDrawing('window');
        window.addBeam = () => this.startDrawing('beam');
        window.addSlab = () => this.startDrawing('slab');
        window.addFoundation = () => this.startDrawing('foundation');
        window.addPipe = () => this.startDrawing('pipe');
        
        // دوال المعايرة
        window.addCalibrationPoint = () => this.startCalibrationPoint();
        window.runCalibration = () => this.runCalibration();
        window.addCalibrationPointToScene = () => this.addCalibrationPoint();
        
        // دوال المواد
        window.selectMaterial = (material) => this.selectMaterial(material);
        
        // تحديث شريط الحالة
        window.updateStatus = (msg, type) => this.updateStatus(msg, type);
    }

    // ========== WORKFLOW MANAGEMENT ==========
    updateWorkflowStep(step) {
        this.state.currentWorkflowStep = step;
        
        // تحديث الـ UI
        const steps = document.querySelectorAll('.workflow-step');
        steps.forEach((s, i) => {
            if (i < step) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });

        // تحديث شريط الحالة
        const stepNames = [
            '',
            'استيراد مخطط CAD',
            'رسم المخطط',
            'استيراد صور 360',
            'معايرة الصور مع المخطط',
            'ربط المشاهد',
            'إضافة العناصر',
            'استخراج الكميات'
        ];
        
        this.updateStatus(`الخطوة ${step}/7: ${stepNames[step]}`, 'info');
    }

    updateStatus(message, type = 'info') {
        const statusEl = document.getElementById('statusMessage');
        if (statusEl) {
            statusEl.innerHTML = message;
        }
        
        if (type === 'success') {
            console.log('✅', message);
        } else if (type === 'error') {
            console.error('❌', message);
        } else {
            console.log('ℹ️', message);
        }
    }

    // ========== EVENT LISTENERS ==========
    setupEventListeners() {
        // تغيير حجم النافذة
        window.addEventListener('resize', () => this.onResize());
        
        // النقر على العناصر
        this.engine.renderer.domElement.addEventListener('click', (e) => this.onClick(e));
        
        // تغيير وضع العرض
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.closest('.view-btn').dataset.mode;
                this.setViewMode(mode);
            });
        });
    }

    setViewMode(mode) {
        this.state.currentViewMode = mode;
        
        // تحديث الـ UI
        document.querySelectorAll('.view-btn').forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // تحديث المشهد حسب الوضع
        switch(mode) {
            case 'plan':
                this.showPlanMode();
                break;
            case 'reality':
                this.showRealityMode();
                break;
            case 'construction':
                this.showConstructionMode();
                break;
        }
        
        this.updateStatus(`وضع ${mode}`, 'info');
    }

    // ========== 360 IMAGE IMPORT ==========
    importImageFromDialog() {
        const input = document.getElementById('imageInput');
        const nameInput = document.getElementById('sceneName');
        
        if (input.files.length > 0) {
            const file = input.files[0];
            const sceneName = nameInput.value;
            const url = URL.createObjectURL(file);
            
            this.import360Image(url, sceneName);
            
            // إخفاء المودال
            document.getElementById('importImageModal').classList.add('hidden');
            
            // التقدم للخطوة التالية
            this.updateWorkflowStep(4);
        }
    }

    async import360Image(imageUrl, sceneName) {
        try {
            this.updateStatus(`جاري استيراد الصورة: ${sceneName}...`, 'info');
            
            // إنشاء معرف للمشهد
            const sceneId = `scene-${Date.now()}`;
            
            // إضافة المشهد للنظام
            this.engine.sceneConnector.addScene(sceneId, { x: 0, y: 0, z: 0 }, 0);
            
            // تحميل الصورة
            const texture = await this.loadTexture(imageUrl);
            
            // إنشاء كرة 360
            const geometry = new THREE.SphereGeometry(500, 60, 40);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.BackSide
            });
            
            const sphere = new THREE.Mesh(geometry, material);
            sphere.userData = {
                type: '360image',
                sceneId: sceneId,
                sceneName: sceneName
            };
            
            // إضافة للمشهد
            this.engine.scene.add(sphere);
            
            // حفظ بيانات المشهد
            this.state.scenes.set(sceneId, {
                id: sceneId,
                name: sceneName,
                sphere: sphere,
                texture: texture,
                elements: [],
                anchors: []
            });
            
            // تحديث Scene Explorer في الواجهة
            this.updateSceneExplorer();
            
            this.updateStatus(`✅ تم استيراد الصورة: ${sceneName}`, 'success');
            
            return sceneId;
            
        } catch (error) {
            this.updateStatus(`❌ فشل استيراد الصورة: ${error.message}`, 'error');
            return null;
        }
    }

    loadTexture(imageUrl) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.TextureLoader();
            loader.load(imageUrl, resolve, undefined, reject);
        });
    }

    // ========== CAD IMPORT ==========
    importCADFromDialog() {
        const input = document.getElementById('cadInput');
        
        if (input.files.length > 0) {
            const file = input.files[0];
            
            // استخدام DWGParser أو DXFParser حسب الامتداد
            const extension = file.name.split('.').pop().toLowerCase();
            
            if (extension === 'dxf') {
                this.importDXF(file);
            } else if (extension === 'dwg') {
                this.importDWG(file);
            }
            
            // إخفاء المودال
            document.getElementById('importCADModal').classList.add('hidden');
            
            // التقدم للخطوة التالية
            this.updateWorkflowStep(2);
        }
    }

    importDXF(file) {
        this.updateStatus('جاري استيراد ملف DXF...', 'info');
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            
            // استخدام DXFParser (مطلوب إنشاؤه)
            // const parser = new DXFParser();
            // const entities = parser.parse(content);
            
            // رسم العناصر من DXF
            // this.drawCADEntities(entities);
            
            this.updateStatus('✅ تم استيراد ملف DXF', 'success');
        };
        reader.readAsText(file);
    }

    importDWG(file) {
        this.updateStatus('جاري استيراد ملف DWG...', 'info');
        
        // DWG يحتاج إلى مكتبة خاصة
        // يمكن استخدام AutoCAD API أو تحويل لـ DXF أولاً
        
        this.updateStatus('⚠️ استيراد DWG قيد التطوير', 'warning');
    }

    // ========== CALIBRATION ==========
    startCalibrationPoint() {
        this.state.drawingMode = 'calibration';
        this.updateStatus('انقر على الصورة لتحديد نقطة معايرة', 'info');
    }

    addCalibrationPoint() {
        const imgX = parseFloat(document.getElementById('imgX').value);
        const imgY = parseFloat(document.getElementById('imgY').value);
        const realX = parseFloat(document.getElementById('realX').value);
        const realY = parseFloat(document.getElementById('realY').value);
        
        // إضافة نقطة تحكم
        this.engine.geoRef.addGCP(
            { x: imgX, y: imgY, z: 0 },
            { x: realX, y: realY, z: 0 }
        );
        
        // حفظ النقطة
        this.state.calibrationPoints.push({
            imgX, imgY, realX, realY
        });
        
        // تحديث قائمة نقاط المعايرة في الواجهة
        this.updateCalibrationPointsList();
        
        this.updateStatus(`✅ تم إضافة نقطة معايرة (${this.state.calibrationPoints.length})`, 'success');
    }

    runCalibration() {
        if (this.state.calibrationPoints.length < 3) {
            this.updateStatus('⚠️ تحتاج إلى 3 نقاط معايرة على الأقل', 'warning');
            return;
        }
        
        // حساب مصفوفة التحويل
        this.engine.geoRef.calculateTransform();
        
        // الحصول على التقرير
        const report = this.engine.geoRef.getCalibrationReport();
        
        this.updateStatus(`✅ تمت المعايرة - متوسط الخطأ: ${report.averageError}`, 'success');
        this.updateWorkflowStep(5);
    }

    updateCalibrationPointsList() {
        const listEl = document.getElementById('calibrationPointsList');
        if (!listEl) return;
        
        if (this.state.calibrationPoints.length === 0) {
            listEl.innerHTML = '<div class="text-muted" style="text-align:center; padding:20px;">لا توجد نقاط معايرة</div>';
            return;
        }
        
        let html = '';
        this.state.calibrationPoints.forEach((point, i) => {
            html += `
                <div class="property-row">
                    <span class="property-label">نقطة ${i+1}:</span>
                    <span class="property-value">(${point.imgX}, ${point.imgY}) → (${point.realX}, ${point.realY})</span>
                </div>
            `;
        });
        
        listEl.innerHTML = html;
    }

    // ========== ELEMENT CREATION ==========
    startDrawing(type) {
        // التأكد من وجود مشهد نشط
        if (!this.state.currentScene) {
            this.updateStatus('⚠️ اختر مشهداً أولاً', 'warning');
            return;
        }
        
        this.state.drawingMode = type;
        this.updateStatus(`ابدأ برسم ${this.getElementName(type)}`, 'info');
    }

    getElementName(type) {
        const names = {
            'wall': 'جدار',
            'column': 'عمود',
            'door': 'باب',
            'window': 'شباك',
            'beam': 'كمرة',
            'slab': 'سقف',
            'foundation': 'قاعدة',
            'pipe': 'ماسورة'
        };
        return names[type] || type;
    }

    // ========== SCENE EXPLORER ==========
    updateSceneExplorer() {
        const treeEl = document.getElementById('sceneTree');
        if (!treeEl) return;
        
        let html = '<ul class="scene-tree">';
        
        // المشروع الرئيسي
        html += `
            <li class="scene-item active">
                <i class="fas fa-building"></i>
                <span>المشروع الرئيسي</span>
            </li>
            <ul class="scene-children">
        `;
        
        // المشاهد
        this.state.scenes.forEach((scene, id) => {
            html += `
                <li class="scene-item" onclick="window.app.selectScene('${id}')">
                    <i class="fas fa-image"></i>
                    <span>${scene.name}</span>
                </li>
            `;
        });
        
        html += '</ul></ul>';
        
        treeEl.innerHTML = html;
    }

    selectScene(sceneId) {
        this.state.currentScene = sceneId;
        
        // تحديث الـ UI
        document.querySelectorAll('.scene-item').forEach(el => {
            el.classList.remove('active');
        });
        
        // إظهار الصورة المرتبطة بالمشهد
        const scene = this.state.scenes.get(sceneId);
        if (scene && scene.sphere) {
            // إخفاء المشاهد الأخرى
            this.state.scenes.forEach(s => {
                if (s.sphere) s.sphere.visible = false;
            });
            scene.sphere.visible = true;
        }
        
        this.updateStatus(`المشهد: ${scene.name}`, 'info');
    }

    // ========== PROPERTIES UPDATE ==========
    updateProperties(element) {
        const props = {
            type: element.type || '-',
            id: element.id || '-',
            scene: this.state.currentScene || '-',
            length: element.length || '-',
            width: element.width || '-',
            height: element.height || '-',
            x: element.x || '-',
            y: element.y || '-',
            z: element.z || '-'
        };
        
        document.getElementById('propType').textContent = props.type;
        document.getElementById('propId').textContent = props.id;
        document.getElementById('propScene').textContent = props.scene;
        document.getElementById('propLength').textContent = props.length;
        document.getElementById('propWidth').textContent = props.width;
        document.getElementById('propHeight').textContent = props.height;
        document.getElementById('propX').textContent = props.x;
        document.getElementById('propY').textContent = props.y;
        document.getElementById('propZ').textContent = props.z;
    }

    // ========== VIEW MODES ==========
    showPlanMode() {
        // إظهار المخطط (خطوط CAD)
        // إخفاء الصور 360
        this.state.scenes.forEach(scene => {
            if (scene.sphere) scene.sphere.visible = false;
        });
    }

    showRealityMode() {
        // إظهار الصور 360
        if (this.state.currentScene) {
            const scene = this.state.scenes.get(this.state.currentScene);
            if (scene && scene.sphere) {
                scene.sphere.visible = true;
            }
        }
    }

    showConstructionMode() {
        // إظهار العناصر (جدران - أعمدة)
        // يمكن إظهار الصور بنصف شفافية
        this.state.scenes.forEach(scene => {
            if (scene.sphere) {
                scene.sphere.material.transparent = true;
                scene.sphere.material.opacity = 0.5;
            }
        });
    }

    // ========== MATERIAL SELECTION ==========
    selectMaterial(material) {
        this.state.currentMaterial = material;
        this.updateStatus(`تم اختيار مادة: ${material}`, 'success');
    }

    // ========== EVENT HANDLERS ==========
    onClick(event) {
        // حساب موقع النقر
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / this.engine.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / this.engine.renderer.domElement.clientHeight) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.engine.camera);
        
        // فحص العناصر
        const intersects = raycaster.intersectObjects(this.engine.scene.children);
        
        if (intersects.length > 0) {
            const selected = intersects[0].object;
            
            // إذا كنا في وضع المعايرة
            if (this.state.drawingMode === 'calibration') {
                // تحويل إحداثيات النقر إلى إحداثيات الصورة
                const point = intersects[0].point;
                
                // فتح مودال إضافة نقطة معايرة
                document.getElementById('imgX').value = point.x.toFixed(2);
                document.getElementById('imgY').value = point.y.toFixed(2);
                document.getElementById('calibrationPointModal').classList.remove('hidden');
                
                this.state.drawingMode = null;
            }
            
            // تحديث الخصائص
            if (selected.userData) {
                this.updateProperties(selected.userData);
            }
        }
    }

    onResize() {
        this.engine.camera.aspect = window.innerWidth / window.innerHeight;
        this.engine.camera.updateProjectionMatrix();
        this.engine.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // ========== ANIMATION LOOP ==========
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.engine.controls.update();
        
        if (this.engine.lodManager) {
            this.engine.lodManager.update();
        }
        
        this.engine.renderer.render(this.engine.scene, this.engine.camera);
    }
}

// =======================================
// 🚀 START APPLICATION
// =======================================

window.addEventListener('load', () => {
    console.log('%c========================================', 'color: #ffaa44');
    console.log('%c🌟 ACTUAL CONSTRUCTION OS', 'color: #ffaa44; font-size: 24px;');
    console.log('%c📐 Reality BIM Platform', 'color: #88aaff; font-size: 16px;');
    console.log('%c========================================', 'color: #ffaa44');
    
    // إنشاء التطبيق
    window.app = new ActualConstructionOS();
    
    // بدء حلقة الحركة
    window.app.animate();
    
    // إظهار رسالة الترحيب
    setTimeout(() => {
        window.app.updateStatus('مرحباً بك في منصة ACTUAL CONSTRUCTION OS', 'success');
    }, 2000);
});

// دوال مساعدة للـ Console
console.log('📌 الأوامر المتاحة:');
console.log('  • window.app - الوصول إلى التطبيق');
console.log('  • window.app.import360Image(url, name) - استيراد صورة 360');
console.log('  • window.app.startDrawing(type) - بدء رسم عنصر');
console.log('  • window.app.setViewMode(mode) - تغيير وضع العرض');


