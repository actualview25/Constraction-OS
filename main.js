// =======================================
// ACTUAL CONSTRUCTION OS - MAIN ENTRY POINT
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
import { StorageManager } from './core/storage/StorageManager.js';
import { SceneGraph } from './core/bridge/SceneGraph.js';

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
import { LODManager } from './core/loading/LODManager.js';
import { TileLODManager } from './core/loading/TileLODManager.js';
import { PriorityQueue } from './core/loading/PriorityQueue.js';

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

// ========== DEBUG & ANALYTICS ==========
import { DebugLayer } from './core/debug/DebugLayer.js';
import { AnalyticsDebugger } from './core/debug/AnalyticsDebugger.js';

// ========== RENDERING ==========
import { HybridRenderer } from './core/rendering/HybridRenderer.js';

// =======================================
// 🎯 MAIN CONSTRUCTION OS CLASS
// =======================================

class ActualConstructionOS {
    constructor() {
        console.log('%c🚀 ACTUAL CONSTRUCTION OS v3.0.0', 'color: #88aaff; font-size: 16px; font-weight: bold;');
        console.log('%c🏗️ محرك Reality-BIM المتكامل', 'color: #ffaa44; font-size: 14px;');
        
        // ===== THREE.JS SETUP =====
        this.initThree();
        
        // ===== CORE SYSTEMS =====
        this.initCore();
        
        // ===== LOADING SYSTEMS =====
        this.initLoadingSystems();
        
        // ===== BRIDGE SYSTEMS =====
        this.initBridgeSystems();
        
        // ===== TOOLS =====
        this.initTools();
        
        // ===== UI =====
        this.initUI();
        
        // ===== DEBUG & ANALYTICS =====
        this.initDebugSystems();
        
        // ===== SETUP =====
        this.setupLights();
        this.setupGrid();
        this.setupEvents();
        
        // بدء الحركة
        this.animate();
        
        console.log('%c✅ ACTUAL CONSTRUCTION OS جاهز', 'color: #44ff44; font-size: 14px;');
        console.log('📊 المشروع جاهز لاستقبال البيانات');
    }

    // ==================== تهيئة Three.js ====================

    initThree() {
        // المشهد
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111122);
        
        // الكاميرا
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.set(30, 20, 30);
        this.camera.lookAt(0, 5, 0);
        
        // الرندر الهجين
        this.renderer = new HybridRenderer('container');
        
        // التحكم
        this.controls = new OrbitControls(this.camera, this.renderer.webglRenderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    // ==================== تهيئة الأنظمة الأساسية ====================

    initCore() {
        // نظم الإحداثيات
        this.geoRef = new GeoReferencing();
        
        // مديري المشروع
        this.sceneManager = new SceneManager(this);
        this.projectManager = new ProjectManager();
        
        // الرسم البياني للمشاهد
        this.sceneGraph = new SceneGraph();
        
        // مدير التخزين
        this.storage = new StorageManager();
        
        // الأنظمة العالمية
        this.globalSystem = new GlobalEntitySystem(this.geoRef);
        this.sceneConnector = new SceneConnector(this.geoRef);
        this.sceneConnector.setGlobalSystem(this.globalSystem);
        
        this.coordTransformer = new CoordinateTransformer(this.geoRef, this.sceneConnector);
        
        // BOQ
        this.boqCalculator = new BOQCalculator(this);
        this.boqReporter = new BOQReporter(this.boqCalculator);
        this.boqExporter = new BOQExporter(this.boqReporter);
        
        // BOQ العالمي
        this.globalBOQ = new GlobalBOQCalculator(this.globalSystem);
        this.globalReporter = new GlobalReporter(this.globalBOQ);
        
        // مكتبة المواد
        this.materialLibrary = new MaterialLibrary();
    }

    // ==================== تهيئة أنظمة التحميل ====================

    initLoadingSystems() {
        // أنظمة التحميل الفردية
        this.lazyLoader = new LazySceneLoader(this.sceneGraph, this.storage);
        this.segmentedLoader = new SegmentedSceneLoader();
        this.lodManager = new LODManager(this.camera);
        this.tileLODManager = new TileLODManager(this.camera);
        this.priorityQueue = new PriorityQueue();
        
        // المحمل المتكامل
        this.loader = new IntegratedLoader(
            this.sceneGraph,
            this.storage,
            this.camera,
            null // سيتم ربط analytics لاحقاً
        );
    }

    // ==================== تهيئة Reality Bridge ====================

    initBridgeSystems() {
        this.realityBridge = new RealityBridge(this.globalSystem, this.sceneConnector, this.sceneGraph);
        this.syncManager = new SyncManager(this.realityBridge);
        
        // ربط المحمل بالـ Bridge
        this.realityBridge.setLoader(this.loader);
        
        // إنشاء مشاهد افتراضية للتجربة
        this.setupDemoScenes();
    }

    setupDemoScenes() {
        // إضافة مشاهد مع إحداثيات افتراضية
        this.sceneConnector.addScene('scene_001', { x: 0, y: 0, z: 0 }, 0);
        this.sceneConnector.addScene('scene_002', { x: 20, y: 0, z: 0 }, 0);
        this.sceneConnector.addScene('scene_003', { x: 40, y: 0, z: 10 }, 0);
        
        // ربط المشاهد
        this.realityBridge.createLink('scene_001', 'scene_002', { x: 10, y: 0, z: 0 }, 'door');
        this.realityBridge.createLink('scene_002', 'scene_003', { x: 30, y: 0, z: 5 }, 'hallway');
        
        // بناء الرسم البياني
        this.sceneGraph.buildFromScenes();
    }

    // ==================== تهيئة الأدوات ====================

    initTools() {
        // أدوات CAD
        this.cadImporter = new CADImporter(this.geoRef, this.sceneConnector);
        this.calibrationWizard = new CalibrationWizard(this.geoRef, this.sceneConnector);
        this.dwgParser = new DWGParser();
        this.dxfParser = new DXFParser();
        
        // أدوات القياس
        this.distanceTool = new DistanceTool(this);
        this.areaTool = new AreaTool(this);
        this.volumeTool = new VolumeTool(this);
        
        // أدوات التصدير
        this.constructionExporter = new ConstructionExporter(this);
        this.globalDataExporter = new GlobalDataExporter(this);
    }

    // ==================== تهيئة واجهة المستخدم ====================

    initUI() {
        // واجهة المستخدم الرئيسية
        this.dashboard = new Dashboard(this);
        this.propertiesPanel = new PropertiesPanel(this);
        this.toolbar = new Toolbar(this);
        
        // واجهات إضافية
        this.globalEntitiesPanel = new GlobalEntitiesPanel(this);
        this.sceneConnectorUI = new SceneConnectorUI(this);
        this.calibrationUI = new CalibrationUI(this, this.calibrationWizard);
    }

    // ==================== تهيئة أنظمة التصحيح ====================

    initDebugSystems() {
        // محلل الأداء
        this.analytics = new AnalyticsDebugger(this.loader, this.realityBridge);
        
        // ربط analytics بالمحمل
        this.loader.analytics = this.analytics;
        
        // طبقة التصحيح
        this.debugLayer = new DebugLayer(this.sceneGraph, this.realityBridge, this.loader, this.lodManager);
        this.debugLayer.setupKeyboardShortcut();
        
        // بدء التتبع
        this.analytics.startTracking();
    }

    // ==================== الإضاءة ====================

    setupLights() {
        // إضاءة محيطية
        const ambientLight = new THREE.AmbientLight(0x404060);
        this.scene.add(ambientLight);
        
        // إضاءة رئيسية (شمس)
        const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
        sunLight.position.set(20, 30, 20);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 50;
        sunLight.shadow.camera.left = -20;
        sunLight.shadow.camera.right = 20;
        sunLight.shadow.camera.top = 20;
        sunLight.shadow.camera.bottom = -20;
        this.scene.add(sunLight);
        
        // إضاءة خلفية
        const backLight = new THREE.DirectionalLight(0x446688, 0.5);
        backLight.position.set(-20, 10, -20);
        this.scene.add(backLight);
    }

    // ==================== الشبكة الأرضية ====================

    setupGrid() {
        // شبكة رئيسية
        const gridHelper = new THREE.GridHelper(200, 40, 0x88aaff, 0x335588);
        gridHelper.position.y = 0;
        this.scene.add(gridHelper);
        
        // محاور
        const axesHelper = new THREE.AxesHelper(20);
        this.scene.add(axesHelper);
    }

    // ==================== الأحداث ====================

    setupEvents() {
        window.addEventListener('resize', () => this.onResize());
        
        // أحداث الفأرة
        this.renderer.webglRenderer.domElement.addEventListener('click', (e) => this.onClick(e));
        this.renderer.webglRenderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // لوحة المفاتيح
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
    }

    onClick(e) {
        // معالجة النقر للقياس أو التحديد
        if (this.calibrationUI?.isActive) {
            this.handleCalibrationClick(e);
        } else if (this.distanceTool?.active) {
            this.distanceTool.handleClick(e);
        } else if (this.areaTool?.active) {
            this.areaTool.handleClick(e);
        }
    }

    handleCalibrationClick(e) {
        // حساب نقطة التقاطع مع الشبكة
        const mouse = new THREE.Vector2();
        mouse.x = (e.clientX / this.renderer.webglRenderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(e.clientY / this.renderer.webglRenderer.domElement.clientHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        
        // تقاطع مع مستوى الأرض
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const target = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, target);
        
        if (target) {
            this.calibrationUI.handleClick(target);
        }
    }

    onMouseMove(e) {
        // تحديث معاينة الأدوات
    }

    onKeyDown(e) {
        // اختصارات لوحة المفاتيح
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
                    this.calibrationUI.show();
                }
                break;
        }
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.resize(window.innerWidth, window.innerHeight);
    }

    // ==================== حلقة الحركة ====================

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.controls.update();
        
        // اختيار الريندرر المناسب
        if (this.loader.currentScene) {
            this.renderer.renderWebGL(this.scene, this.camera);
        } else {
            this.renderer.renderCSS('default.jpg', []);
        }
        
        // تحديث LOD
        this.lodManager.update();
        this.tileLODManager.update();
    }

    // ==================== دوال مساعدة ====================
    
    createGlobalWall(options) {
        const wall = new GlobalWall(this.globalSystem, this.sceneConnector, options);
        return wall;
    }

    createGlobalBeam(options) {
        const beam = new GlobalBeam(this.globalSystem, this.sceneConnector, options);
        return beam;
    }

    createGlobalColumn(options) {
        const column = new GlobalColumn(this.globalSystem, this.sceneConnector, options);
        return column;
    }

    createGlobalSlab(options) {
        const slab = new GlobalSlab(this.globalSystem, this.sceneConnector, options);
        return slab;
    }

    createGlobalExcavation(options) {
        const excavation = new GlobalExcavation(this.globalSystem, this.sceneConnector, options);
        return excavation;
    }

    createGlobalElectrical(options) {
        const electrical = new GlobalElectrical(this.globalSystem, this.sceneConnector, options);
        return electrical;
    }

    // ==================== تحميل مشهد ====================

    async loadScene(sceneId) {
        try {
            const sceneData = await this.loader.loadScene(sceneId, {
                viewport: { x: this.camera.position.x, y: this.camera.position.z }
            });
            
            this.loader.setCurrentScene(sceneId);
            console.log(`✅ تم تحميل المشهد ${sceneId}`);
            
            return sceneData;
        } catch (error) {
            console.error(`❌ فشل تحميل المشهد ${sceneId}:`, error);
        }
    }

    // ==================== دوال التصدير ====================
    
    exportToActualViewStudio() {
        return this.constructionExporter.export();
    }

    generateGlobalReport() {
        return this.globalReporter.generateFullReport();
    }

    getSystemStatus() {
        return {
            version: '3.0.0',
            name: 'ACTUAL CONSTRUCTION OS',
            type: 'Reality-BIM Engine',
            stats: {
                loader: this.loader.getDetailedStats(),
                bridge: {
                    anchors: this.realityBridge.anchors.size,
                    markers: this.realityBridge.markers.size,
                    links: this.realityBridge.links.size
                },
                graph: {
                    nodes: this.sceneGraph.nodes.size,
                    edges: this.sceneGraph.edges.length
                },
                analytics: this.analytics.getPerformanceReport()
            }
        };
    }
}
// =======================================
// 🚀 تشغيل التطبيق
// =======================================

window.addEventListener('load', async () => {
    console.log('%c🌟 ACTUAL CONSTRUCTION OS - Reality-BIM Engine', 'color: #ffaa44; font-size: 18px; font-weight: bold;');
    
    // إخفاء شاشة التحميل
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }, 1500);
    }
    
    // إنشاء التطبيق
    window.app = new ActualConstructionOS();
    
    // تحميل أول مشهد تجريبي
    setTimeout(() => {
        app.loadScene('scene_001');
    }, 2000);
    
    console.log('📊 يمكنك استخدام window.app للوصول إلى التطبيق');
    console.log('🔧 F2: إظهار/إخفاء Debug Layer');
    console.log('🔧 F3: إظهار/إخفاء Analytics');
});

// للوصول من Console
window.ActualConstructionOS = ActualConstructionOS;
// =======================================
// 🚀 تشغيل التطبيق
// =======================================

window.addEventListener('load', async () => {
    console.log('%c🌟 ACTUAL CONSTRUCTION OS - Reality-BIM Engine', 'color: #ffaa44; font-size: 18px;
