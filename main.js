// =======================================
// ACTUAL CONSTRUCTION OS - MAIN ENTRY POINT
// =======================================
// الإصدار: 3.0.0 - النسخة الكاملة
// =======================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

console.log('🚀 بدء تشغيل ACTUAL CONSTRUCTION OS...');
console.log('THREE loaded:', !!THREE);
console.log('OrbitControls loaded:', !!OrbitControls);

// ========== CORE SYSTEMS ==========
import { GeoReferencing } from './core/Georeferencing.js';
import { SceneManager } from './core/SceneManager.js';
import { ProjectManager } from './core/ProjectManager.js';
import { GlobalEntitySystem } from './core/global/GlobalEntitySystem.js';
import { SceneConnector } from './core/global/SceneConnector.js';
import { CoordinateTransformer } from './core/global/CoordinateTransformer.js';
import { SceneGraph } from './core/bridge/SceneGraph.js';
import { StorageManager } from './core/storage/StorageManager.js'; // ✅ أضيفت

// ========== REALITY BRIDGE SYSTEMS ==========
import { RealityBridge } from './core/bridge/RealityBridge.js';
import { SceneAnchor } from './core/bridge/SceneAnchor.js';
import { EntityMarker } from './core/bridge/EntityMarker.js';
import { SceneLink } from './core/bridge/SceneLink.js';
import { SyncManager } from './core/bridge/SyncManager.js';

// ========== LOADING SYSTEMS ==========
import { IntegratedLoader } from './core/loading/IntegratedLoader.js';
import { LazySceneLoader } from './core/loading/LazySceneLoader.js';
import { SegmentedSceneLoader } from './core/loading/SegmentedSceneLoader.js';
import { LODManager } from './core/rendering/LODManager.js'; // ✅ تم التصحيح من loading إلى rendering
import { TileLODManager } from './core/loading/TileLODManager.js';
import { PriorityQueue } from './core/loading/PriorityQueue.js';
import { LoadingStrategy } from './core/loading/LoadingStrategy.js'; // ✅ أضيفت

// ========== UNIVERSAL SYSTEMS ========== // ✅ قسم جديد
import { UniversalElement } from './core/elements/UniversalElement.js';
import { UniversalImporter } from './core/import/UniversalImporter.js';

// ========== CLASH DETECTION ========== // ✅ قسم جديد
import { ClashDetection } from './core/clash/ClashDetection.js';
import { AdvancedClashDetection } from './core/clash/AdvancedClashDetection.js';

// ========== FLOOR SYSTEMS ========== // ✅ قسم جديد
import { FloorConnector } from './core/floors/FloorConnector.js';
import { FloorCopySystem } from './core/floors/FloorCopySystem.js';
import { FloorNavigation } from './core/floors/FloorNavigation.js';

// ========== ARCHITECTURE MODULES ==========
import { Wall } from './modules/Architecture/Wall.js';
import { Door } from './modules/Architecture/Door.js';
import { Window } from './modules/Architecture/Window.js';
import { Floor } from './modules/Architecture/Floor.js';
import { Finish } from './modules/Architecture/Finish.js';
import { Opening } from './modules/Architecture/Opening.js';
import { BuildingMaterial } from './modules/Architecture/Material.js';

// ========== ARCHITECTURE GLOBAL MODULES ==========
import { GlobalWall } from './modules/Architecture/global/GlobalWall.js';
import { GlobalFloor } from './modules/Architecture/global/GlobalFloor.js';

// ========== CONCRETE MODULES ==========
import { Foundation } from './modules/Concrete/Foundation.js';
import { Column } from './modules/Concrete/Column.js';
import { Beam } from './modules/Concrete/Beam.js';
import { Slab } from './modules/Concrete/Slab.js';
import { Rebar, RebarLayout } from './modules/Concrete/Rebar.js';
import { ConcreteMaterial } from './modules/Concrete/ConcreteMaterial.js';

// ========== CONCRETE GLOBAL MODULES ==========
import { GlobalBeam } from './modules/Concrete/global/GlobalBeam.js';
import { GlobalColumn } from './modules/Concrete/global/GlobalColumn.js';
import { GlobalSlab } from './modules/Concrete/global/GlobalSlab.js';

// ========== EARTHWORKS MODULES ==========
import { Excavation } from './modules/Earthworks/Excavation.js';
import { Compaction } from './modules/Earthworks/Compaction.js';
import { Layer } from './modules/Earthworks/Layer.js';
import { SoilMaterial } from './modules/Earthworks/SoilMaterial.js';

// ========== EARTHWORKS GLOBAL MODULES ==========
import { GlobalExcavation } from './modules/Earthworks/global/GlobalExcavation.js';
import { GlobalCompaction } from './modules/Earthworks/global/GlobalCompaction.js';

// ========== MEP MODULES ==========
import { ElectricalCircuit } from './modules/MEP/Electrical.js';
import { PlumbingSystem } from './modules/MEP/Plumbing.js';
import { HVACSystem } from './modules/MEP/HVAC.js';
import { DrainageSystem } from './modules/MEP/Drainage.js';
import { Pipe } from './modules/MEP/Pipe.js';
import { Cable } from './modules/MEP/Cable.js';
import { Fixture } from './modules/MEP/Fixture.js';
import { MEPMaterial } from './modules/MEP/Material.js';

// ========== MEP GLOBAL MODULES ==========
import { GlobalElectrical } from './modules/MEP/global/GlobalElectrical.js';
import { GlobalPlumbing } from './modules/MEP/global/GlobalPlumbing.js';
import { GlobalHVAC } from './modules/MEP/global/GlobalHVAC.js';

// ========== BOQ MODULES ==========
import { BOQCalculator } from './modules/BOQ/Calculator.js';
import { BOQReporter } from './modules/BOQ/Reporter.js';
import { BOQExporter } from './modules/BOQ/Exporter.js';

// ========== BOQ GLOBAL MODULES ==========
import { GlobalBOQCalculator } from './modules/BOQ/global/GlobalBOQCalculator.js';
import { GlobalReporter } from './modules/BOQ/global/GlobalReporter.js';
import { GlobalEarthworksBOQ } from './modules/BOQ/global/GlobalEarthworksBOQ.js'; // ✅ أضيفت

// ========== CAD TOOLS ==========
import { CADImporter } from './tools/cad/CADImporter.js';
import { CalibrationWizard } from './tools/cad/CalibrationWizard.js';
import { DWGParser } from './tools/cad/DWGParser.js';
import { DXFParser } from './tools/cad/DXFParser.js';

// ========== MEASUREMENT TOOLS ==========
import { DistanceTool } from './tools/measurement/DistanceTool.js';
import { AreaTool } from './tools/measurement/AreaTool.js';
import { VolumeTool } from './tools/measurement/VolumeTool.js';

// ========== EXPORT TOOLS ==========
import { ConstructionExporter } from './tools/export/ConstructionExporter.js';
import { GlobalDataExporter } from './tools/export/GlobalDataExporter.js';

// ========== MATERIALS LIBRARY ==========
import { MaterialLibrary } from './materials/MaterialLibrary.js';

// ========== UI MODULES ==========
import { Dashboard } from './ui/Dashboard.js';
import { PropertiesPanel } from './ui/PropertiesPanel.js';
import { Toolbar } from './ui/Toolbar.js';
import { GlobalEntitiesPanel } from './ui/global/GlobalEntitiesPanel.js';
import { SceneConnectorUI } from './ui/global/SceneConnectorUI.js';
import { CalibrationUI } from './ui/cad/CalibrationUI.js';
import { UniversalPropertiesPanel } from './ui/UniversalPropertiesPanel.js'; // ✅ أضيفت

// ========== WORKER MODES ========== // ✅ قسم جديد (اختياري - يمكن حذفه إذا لا تريده)
import { WorkerMode } from './player/WorkerMode.js';
import { ForemanMode } from './player/ForemanMode.js';
import { MobileWorkerMode } from './player/MobileWorkerMode.js';
import { WorkerMarkers } from './player/WorkerMarkers.js';

// ========== DEBUG & ANALYTICS ==========
import { DebugLayer } from './core/debug/DebugLayer.js';
import { AnalyticsDebugger } from './core/debug/AnalyticsDebugger.js';

// ========== RENDERING ==========
import { HybridRenderer } from './core/rendering/HybridRenderer.js';

// =======================================
// 🎯 MAIN CONSTRUCTION OS CLASS
// =======================================

class ActualConstructionOS
{constructor() {
    console.log('%c🚀 ACTUAL CONSTRUCTION OS v3.0.0', 'color: #88aaff; font-size: 16px; font-weight: bold;');
    console.log('%c🏗️ محرك Reality-BIM المتكامل', 'color: #ffaa44; font-size: 14px;');
    
    // ===== THREE.JS SETUP =====
    this.initThree();
    
    // ===== CORE SYSTEMS =====
    this.initCore();
    
    // ===== LOADING SYSTEMS =====
    this.initLoadingSystems();
    
    // ===== UNIVERSAL SYSTEMS =====
    this.initUniversalSystems();
    
    // ===== CLASH DETECTION =====
    this.initClashDetection();
    
    // ===== FLOOR SYSTEMS =====
    this.initFloorSystems();
    
    // ===== BRIDGE SYSTEMS =====
    this.initBridgeSystems();
    
    // ===== TOOLS =====
    this.initTools();
    
    // ===== UI =====
    this.initUI();
    
    // ===== DEBUG & ANALYTICS =====
    this.initDebugSystems();
    
    // ===== WORKER MODES (اختياري) =====
    this.initWorkerModes();
    
    // ===== SETUP =====
    this.setupLights();
    this.setupGrid();
    this.setupEvents();
    
    // ✅ إضافة مكعب اختبار فوراً
    this.addTestCube();
    
    // بدء الحركة
    this.animate();
    
    console.log('%c✅ ACTUAL CONSTRUCTION OS جاهز', 'color: #44ff44; font-size: 14px;');
}

// ✅ دالة جديدة لإضافة مكعب الاختبار
addTestCube() {
    try {
        console.log('🧪 إضافة مكعب اختبار...');
        
        // مكعب
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xffaa44,
            emissive: 0x442200
        });
        this.testCube = new THREE.Mesh(geometry, material);
        this.testCube.position.set(0, 1, 0);
        this.scene.add(this.testCube);
        
        // إضاءة
        const light = new THREE.PointLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        this.scene.add(light);
        
        console.log('✅ تم إضافة مكعب الاختبار');
    } catch (error) {
        console.error('❌ فشل إضافة مكعب الاختبار:', error);
    }
}

    // ==================== تهيئة Three.js ====================

    initThree() {
        try {
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x111122);
            
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
            this.camera.position.set(30, 20, 30);
            this.camera.lookAt(0, 5, 0);
            
            this.renderer = new HybridRenderer('container');
            
            this.controls = new OrbitControls(this.camera, this.renderer.webglRenderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.maxPolarAngle = Math.PI / 2;
            
            console.log('✅ Three.js initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Three.js:', error);
        }
    }

    // ==================== تهيئة الأنظمة الأساسية ====================

    initCore() {
        try {
            this.geoRef = new GeoReferencing();
            this.sceneManager = new SceneManager(this);
            this.projectManager = new ProjectManager();
            this.sceneGraph = new SceneGraph();
            
            // تخزين باستخدام StorageManager
            this.storage = new StorageManager(); // ✅ استخدام StorageManager بدلاً من localStorage البسيط
            
            this.globalSystem = new GlobalEntitySystem(this.geoRef);
            this.sceneConnector = new SceneConnector(this.geoRef);
            this.sceneConnector.setGlobalSystem(this.globalSystem);
            
            this.coordTransformer = new CoordinateTransformer(this.geoRef, this.sceneConnector);
            
            this.boqCalculator = new BOQCalculator(this);
            this.boqReporter = new BOQReporter(this.boqCalculator);
            this.boqExporter = new BOQExporter(this.boqReporter);
            
            this.globalBOQ = new GlobalBOQCalculator(this.globalSystem);
            this.globalReporter = new GlobalReporter(this.globalBOQ);
            
            this.materialLibrary = new MaterialLibrary();
            
            console.log('✅ Core systems initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Core systems:', error);
        }
    }

    // ==================== تهيئة أنظمة التحميل ====================

    initLoadingSystems() {
        try {
            this.lazyLoader = new LazySceneLoader(this.sceneGraph, this.storage);
            this.segmentedLoader = new SegmentedSceneLoader();
            this.lodManager = new LODManager(this.camera);
            this.tileLODManager = new TileLODManager(this.camera);
            this.priorityQueue = new PriorityQueue(this);
            this.loadingStrategy = new LoadingStrategy(this.sceneGraph); // ✅ جديد
            
            this.loader = new IntegratedLoader(
                this.sceneGraph,
                this.storage,
                this.camera,
                null
            );
            
            console.log('✅ Loading systems initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Loading systems:', error);
        }
    }


// ==================== تهيئة الأنظمة العالمية ====================

    initUniversalSystems() {
        try {
            this.universalImporter = new UniversalImporter(this.globalSystem, this.cadImporter);
            console.log('✅ Universal systems initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Universal systems:', error);
        }
    }

    // ==================== تهيئة كشف التعارضات ====================

    initClashDetection() {
        try {
            this.clashDetection = new ClashDetection(this.globalSystem, this.sceneConnector);
            this.advancedClashDetection = new AdvancedClashDetection(this.globalSystem, this.sceneConnector);
            console.log('✅ Clash detection initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Clash detection:', error);
        }
    }

    // ==================== تهيئة أنظمة الطوابق ====================

    initFloorSystems() {
        try {
            this.floorConnector = new FloorConnector(this.globalSystem, this.sceneConnector);
            this.floorCopySystem = new FloorCopySystem(this.globalSystem, this.sceneConnector);
            this.floorNavigation = new FloorNavigation(this.floorConnector);
            console.log('✅ Floor systems initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Floor systems:', error);
        }
    }

    // ==================== تهيئة Reality Bridge ====================

    initBridgeSystems() {
        try {
            this.realityBridge = new RealityBridge(this.globalSystem, this.sceneConnector, this.sceneGraph);
            this.syncManager = new SyncManager(this.realityBridge);
            
            this.realityBridge.setLoader(this.loader);
            
            this.setupDemoScenes();
            
            console.log('✅ Bridge systems initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Bridge systems:', error);
        }
    }

    setupDemoScenes() {
        try {
            this.sceneConnector.addScene('scene_001', { x: 0, y: 0, z: 0 }, 0);
            this.sceneConnector.addScene('scene_002', { x: 20, y: 0, z: 0 }, 0);
            this.sceneConnector.addScene('scene_003', { x: 40, y: 0, z: 10 }, 0);
            
            this.realityBridge.createLink('scene_001', 'scene_002', { x: 10, y: 0, z: 0 }, 'door');
            this.realityBridge.createLink('scene_002', 'scene_003', { x: 30, y: 0, z: 5 }, 'hallway');
            
            this.sceneGraph.buildFromScenes();
            
            console.log('✅ Demo scenes created');
        } catch (error) {
            console.warn('⚠️ فشل إنشاء المشاهد التجريبية:', error);
        }
    }

    // ==================== تهيئة الأدوات ====================

    initTools() {
        try {
            this.cadImporter = new CADImporter(this.geoRef, this.sceneConnector);
            this.calibrationWizard = new CalibrationWizard(this.geoRef, this.sceneConnector);
            this.dwgParser = new DWGParser();
            this.dxfParser = new DXFParser();
            
            this.distanceTool = new DistanceTool(this);
            this.areaTool = new AreaTool(this);
            this.volumeTool = new VolumeTool(this);
            
            this.constructionExporter = new ConstructionExporter(this);
            this.globalDataExporter = new GlobalDataExporter(this);
            
            console.log('✅ Tools initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Tools:', error);
        }
    }

    // ==================== تهيئة واجهة المستخدم ====================

    initUI() {
        try {
            this.dashboard = new Dashboard(this);
            this.propertiesPanel = new PropertiesPanel(this);
            this.toolbar = new Toolbar(this);
            this.universalPropertiesPanel = new UniversalPropertiesPanel(); // ✅ جديد
            
            this.globalEntitiesPanel = new GlobalEntitiesPanel(this);
            this.sceneConnectorUI = new SceneConnectorUI(this);
            this.calibrationUI = new CalibrationUI(this, this.calibrationWizard);
            
            console.log('✅ UI initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة UI:', error);
        }
    }

    // ==================== تهيئة أنظمة التصحيح ====================

    initDebugSystems() {
        try {
            this.analytics = new AnalyticsDebugger(this.loader, this.realityBridge);
            this.loader.analytics = this.analytics;
            
            this.debugLayer = new DebugLayer(this.sceneGraph, this.realityBridge, this.loader, this.lodManager);
            this.debugLayer.setupKeyboardShortcut();
            
            this.analytics.startTracking();
            
            console.log('✅ Debug systems initialized');
        } catch (error) {
            console.error('❌ فشل تهيئة Debug systems:', error);
        }
    }

    // ==================== تهيئة أوضاع العمال (اختياري) ====================

    initWorkerModes() {
        try {
            // هذه اختيارية - يمكن تفعيلها عند الحاجة
            // this.workerMode = new WorkerMode(this);
            // this.foremanMode = new ForemanMode(this);
            // this.mobileWorkerMode = new MobileWorkerMode(this);
            // this.workerMarkers = new WorkerMarkers(this.scene);
            console.log('✅ Worker modes (optional) ready');
        } catch (error) {
            console.warn('⚠️ فشل تهيئة Worker modes:', error);
        }
    }

    // ==================== الإضاءة ====================

    setupLights() {
        try {
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
            
            console.log('✅ Lights setup');
        } catch (error) {
            console.error('❌ فشل إعداد الإضاءة:', error);
        }
    }

    // ==================== الشبكة الأرضية ====================

    setupGrid() {
        try {
            const gridHelper = new THREE.GridHelper(200, 40, 0x88aaff, 0x335588);
            gridHelper.position.y = 0;
            this.scene.add(gridHelper);
            
            const axesHelper = new THREE.AxesHelper(20);
            this.scene.add(axesHelper);
            
            console.log('✅ Grid setup');
        } catch (error) {
            console.error('❌ فشل إعداد الشبكة:', error);
        }
    }

    // ==================== الأحداث ====================

    setupEvents() {
        window.addEventListener('resize', () => this.onResize());
        
        if (this.renderer?.webglRenderer?.domElement) {
            this.renderer.webglRenderer.domElement.addEventListener('click', (e) => this.onClick(e));
            this.renderer.webglRenderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        }
        
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        
        console.log('✅ Events setup');
    }

    onClick(e) {
        if (this.calibrationUI?.isActive) {
            this.handleCalibrationClick(e);
        } else if (this.distanceTool?.active) {
            this.distanceTool.handleClick(e);
        } else if (this.areaTool?.active) {
            this.areaTool.handleClick(e);
        }
    }

    handleCalibrationClick(e) {
        const mouse = new THREE.Vector2();
        mouse.x = (e.clientX / this.renderer.webglRenderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(e.clientY / this.renderer.webglRenderer.domElement.clientHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const target = new THREE.Vector3();
        
        if (raycaster.ray.intersectPlane(plane, target) && this.calibrationUI) {
            this.calibrationUI.handleClick(target);
        }
    }

    onMouseMove(e) {
        // يمكن إضافة منطق هنا
    }

    onKeyDown(e) {
        switch(e.key) {
            case 'Escape':
                this.calibrationUI?.hide();
                this.distanceTool?.deactivate();
                this.areaTool?.deactivate();
                break;
            case 'F2':
                this.debugLayer?.toggle();
                break;
            case 'F3':
                this.analytics?.toggle();
                break;
            case 'c':
                if (e.ctrlKey) {
                    this.calibrationUI?.show();
                }
                break;
        }
    }

    onResize() {
        if (this.camera) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }
        if (this.renderer) {
            this.renderer.resize(window.innerWidth, window.innerHeight);
        }
    }

// ==================== حلقة الحركة ====================

animate() {
    requestAnimationFrame(() => this.animate());
    
    if (this.controls) {
        this.controls.update();
    }
    
    // ✅ إضافة عناصر الاختبار إذا لم تكن موجودة
    if (!this.gridHelper && this.scene) {
        console.log('🔄 إنشاء الشبكة الأرضية...');
        this.gridHelper = new THREE.GridHelper(200, 40, 0x88aaff, 0x335588);
        this.gridHelper.position.y = 0;
        this.scene.add(this.gridHelper);
        
        this.axesHelper = new THREE.AxesHelper(20);
        this.scene.add(this.axesHelper);
    }
    
    // ✅ إضافة مكعب اختبار للتأكد من أن الرندر يعمل
    if (!this.testCube && this.scene) {
        console.log('🧪 إنشاء مكعب اختبار...');
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xffaa44,
            emissive: 0x442200
        });
        this.testCube = new THREE.Mesh(geometry, material);
        this.testCube.position.set(0, 1, 0);
        this.scene.add(this.testCube);
        
        // إضافة إضاءة للمكعب
        if (!this.testLight) {
            this.testLight = new THREE.PointLight(0xffffff, 1);
            this.testLight.position.set(5, 5, 5);
            this.scene.add(this.testLight);
        }
    }

    // ✅ تحديث دوران المكعب (للتأكد من أن الحركة تعمل)
    if (this.testCube) {
        this.testCube.rotation.y += 0.005;
    }
    
    // ✅ التأكد من وجود إضاءة أساسية
    if (!this.ambientLight && this.scene) {
        this.ambientLight = new THREE.AmbientLight(0x404060);
        this.scene.add(this.ambientLight);
        
        const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
        sunLight.position.set(20, 30, 20);
        this.scene.add(sunLight);
    }
    
    // ✅ تحقق من وجود HybridRenderer
    if (this.renderer) {
        // استخدم WebGL دائماً للتأكد من الرؤية
        this.renderer.renderWebGL(this.scene, this.camera);
    }
    
    if (this.lodManager) {
        this.lodManager.update();
    }
    if (this.tileLODManager) {
        this.tileLODManager.update();
    }
}
// ==================== دوال مساعدة ====================
    
    createGlobalWall(options) {
        try {
            return new GlobalWall(this.globalSystem, this.sceneConnector, options);
        } catch (error) {
            console.error('❌ فشل إنشاء جدار عالمي:', error);
            return null;
        }
    }

    createGlobalBeam(options) {
        try {
            return new GlobalBeam(this.globalSystem, this.sceneConnector, options);
        } catch (error) {
            console.error('❌ فشل إنشاء كمرة عالمية:', error);
            return null;
        }
    }

    createGlobalColumn(options) {
        try {
            return new GlobalColumn(this.globalSystem, this.sceneConnector, options);
        } catch (error) {
            console.error('❌ فشل إنشاء عمود عالمي:', error);
            return null;
        }
    }

    createGlobalSlab(options) {
        try {
            return new GlobalSlab(this.globalSystem, this.sceneConnector, options);
        } catch (error) {
            console.error('❌ فشل إنشاء سقف عالمي:', error);
            return null;
        }
    }

    createGlobalExcavation(options) {
        try {
            return new GlobalExcavation(this.globalSystem, this.sceneConnector, options);
        } catch (error) {
            console.error('❌ فشل إنشاء حفرية عالمية:', error);
            return null;
        }
    }

    createGlobalElectrical(options) {
        try {
            return new GlobalElectrical(this.globalSystem, this.sceneConnector, options);
        } catch (error) {
            console.error('❌ فشل إنشاء نظام كهربائي عالمي:', error);
            return null;
        }
    }

    // إنشاء عنصر عالمي باستخدام النظام الموحد
    createUniversalElement(type, options) {
        try {
            return new UniversalElement(this.globalSystem, this.sceneConnector, type, options);
        } catch (error) {
            console.error(`❌ فشل إنشاء عنصر ${type}:`, error);
            return null;
        }
    }

    // استيراد عناصر من CAD
    async importFromCAD(cadFile) {
        try {
            return await this.universalImporter.importFromCAD(cadFile);
        } catch (error) {
            console.error('❌ فشل استيراد من CAD:', error);
            return null;
        }
    }

    // كشف التعارضات
    detectClashes(sceneId) {
        try {
            return this.clashDetection.detectInScene(sceneId);
        } catch (error) {
            console.error('❌ فشل كشف التعارضات:', error);
            return [];
        }
    }

    // نسخ طابق
    async duplicateFloor(sourceFloor, targetFloor, heightChange) {
        try {
            return await this.floorCopySystem.duplicateFloor(sourceFloor, targetFloor, heightChange);
        } catch (error) {
            console.error('❌ فشل نسخ الطابق:', error);
            return null;
        }
    }

    // ==================== تحميل مشهد ====================

    async loadScene(sceneId) {
        if (!this.loader) {
            console.error('❌ المحمل غير موجود');
            return null;
        }
        
        try {
            console.log(`🔄 تحميل المشهد ${sceneId}...`);
            
            const sceneData = await this.loader.loadScene(sceneId, {
                viewport: { x: this.camera?.position?.x || 0, y: this.camera?.position?.z || 0 }
            });
            
            this.loader.setCurrentScene(sceneId);
            console.log(`✅ تم تحميل المشهد ${sceneId}`);
            
            return sceneData;
        } catch (error) {
            console.error(`❌ فشل تحميل المشهد ${sceneId}:`, error);
            return null;
        }
    }

    // ==================== دوال التصدير ====================
    
    exportToActualViewStudio() {
        try {
            return this.constructionExporter?.export();
        } catch (error) {
            console.error('❌ فشل التصدير:', error);
            return null;
        }
    }

    generateGlobalReport() {
        try {
            return this.globalReporter?.generateFullReport();
        } catch (error) {
            console.error('❌ فشل إنشاء التقرير:', error);
            return null;
        }
    }

    getSystemStatus() {
        return {
            version: '3.0.0',
            name: 'ACTUAL CONSTRUCTION OS',
            type: 'Reality-BIM Engine',
            status: 'running',
            stats: {
                loader: this.loader?.getDetailedStats?.() || {},
                bridge: {
                    anchors: this.realityBridge?.anchors?.size || 0,
                    markers: this.realityBridge?.markers?.size || 0,
                    links: this.realityBridge?.links?.size || 0
                },
                graph: {
                    nodes: this.sceneGraph?.nodes?.size || 0,
                    edges: this.sceneGraph?.edges?.length || 0
                },
                analytics: this.analytics?.getPerformanceReport?.() || {}
            }
        };
    }
}

// =======================================
// 🚀 تشغيل التطبيق
// =======================================

window.addEventListener('load', async () => {
    console.log('%c🌟 ACTUAL CONSTRUCTION OS - Reality-BIM Engine v3.0', 'color: #ffaa44; font-size: 18px; font-weight: bold;');
    console.log('%c🏗️ منصة متكاملة لتصميم وإدارة المشاريع الهندسية', 'color: #88aaff; font-size: 14px;');

    try {
        // إخفاء شاشة التحميل إذا وجدت
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.remove?.(), 500);
            }, 1500);
        }

        // إنشاء التطبيق
        console.log('🔄 جاري إنشاء التطبيق...');
        window.app = new ActualConstructionOS();

        if (!window.app) {
            throw new Error('فشل إنشاء التطبيق');
        }

        console.log('✅ تم إنشاء التطبيق بنجاح');

        // تحميل أول مشهد تجريبي
        setTimeout(() => {
            if (window.app?.loadScene) {
                console.log('🔄 تحميل المشهد التجريبي...');
                window.app.loadScene('scene_001').catch(err => {
                    console.warn('⚠️ فشل تحميل المشهد التجريبي:', err?.message);
                });
            }
        }, 2000);

        // معلومات المساعدة
        console.log('');
        console.log('📊 يمكنك استخدام window.app للوصول إلى التطبيق');
        console.log('📌 الأوامر المتاحة:');
        console.log('   • app.getSystemStatus() - حالة النظام');
        console.log('   • app.loadScene(id) - تحميل مشهد');
        console.log('   • app.generateGlobalReport() - تقرير شامل');
        console.log('   • app.detectClashes(sceneId) - كشف تعارضات');
        console.log('   • app.duplicateFloor() - نسخ طابق');
        console.log('   • app.importFromCAD(file) - استيراد من CAD');
        console.log('');
        console.log('🔧 اختصارات لوحة المفاتيح:');
        console.log('   • F2 - إظهار/إخفاء Debug Layer');
        console.log('   • F3 - إظهار/إخفاء Analytics');
        console.log('   • Ctrl+C - فتح معالج المعايرة');

    } catch (error) {
        console.error('❌ فشل تشغيل التطبيق:', error);

        // عرض رسالة خطأ للمستخدم
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(200, 50, 50, 0.95);
            color: white;
            padding: 25px;
            border-radius: 15px;
            z-index: 10000;
            font-family: system-ui, sans-serif;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            border: 2px solid #ff8888;
            max-width: 400px;
            backdrop-filter: blur(5px);
        `;
        errorDiv.innerHTML = `
            <h2 style="margin:0 0 15px 0; color:#ffaa44;">❌ خطأ في التشغيل</h2>
            <p style="margin:10px 0;">${error.message}</p>
            <p style="font-size:12px; opacity:0.8; margin:15px 0;">تأكد من تحميل جميع الملفات بشكل صحيح</p>
            <button onclick="this.parentElement.remove(); location.reload()" style="
                background: #4a6c8f;
                color: white;
                border: none;
                padding: 8px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                transition: 0.2s;
            ">إعادة تحميل</button>
        `;
        document.body.appendChild(errorDiv);
    }
});

// دوال مساعدة للـ Console
window.restartApp = () => {
    console.log('🔄 إعادة تشغيل التطبيق...');
    if (window.app?.dispose) {
        window.app.dispose();
    }
    delete window.app;
    location.reload();
};

window.getSystemInfo = () => ({
    version: '3.0.0',
    name: 'ACTUAL CONSTRUCTION OS',
    type: 'Reality-BIM Engine',
    browser: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString()
});

// تصدير للاستخدام
window.ActualConstructionOS = ActualConstructionOS;

console.log('📌 يمكنك استخدام:');
console.log('   • window.restartApp() - إعادة تشغيل التطبيق');
console.log('   • window.getSystemInfo() - معلومات النظام');
