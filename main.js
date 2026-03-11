// =======================================
// ACTUAL VIEW CONSTRUCTION OS - MAIN ENTRY POINT
// الإصدار: 3.0.0 - النسخة الكاملة المتكاملة
// =======================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

console.log('%c🏗️ ACTUAL VIEW CONSTRUCTION OS - النسخة الكاملة', 'color: #ffaa44; font-size: 20px; font-weight: bold;');
console.log('%c📐 منصة متكاملة لربط صور 360 بالمخططات الهندسية', 'color: #88aaff; font-size: 14px;');

// ========== CORE SYSTEMS ==========
import { GeoReferencing } from './core/Georeferencing.js';
import { SceneManager } from './core/SceneManager.js';
import { ProjectManager } from './core/ProjectManager.js';
import { StorageManager } from './core/storage/StorageManager.js';

// ========== GLOBAL SYSTEMS ==========
import { GlobalEntitySystem } from './core/global/GlobalEntitySystem.js';
import { SceneConnector } from './core/global/SceneConnector.js';
import { CoordinateTransformer } from './core/global/CoordinateTransformer.js';

// ========== REALITY BRIDGE ==========
import { RealityBridge } from './core/bridge/RealityBridge.js';
import { SceneAnchor } from './core/bridge/SceneAnchor.js';
import { SceneGraph } from './core/bridge/SceneGraph.js';
import { SceneLink } from './core/bridge/SceneLink.js';
import { SyncManager } from './core/bridge/SyncManager.js';
import { EntityMarker } from './core/bridge/EntityMarker.js';

// ========== LOADING SYSTEMS ==========
import { IntegratedLoader } from './core/loading/IntegratedLoader.js';
import { LazySceneLoader } from './core/loading/LazySceneLoader.js';
import { SegmentedSceneLoader } from './core/loading/SegmentedSceneLoader.js';
import { LoadingStrategy } from './core/loading/LoadingStrategy.js';
import { PriorityQueue } from './core/loading/PriorityQueue.js';
import { TileLODManager } from './core/loading/TileLODManager.js';

// ========== RENDERING SYSTEMS ==========
import { HybridRenderer } from './core/rendering/HybridRenderer.js';
import { LODManager } from './core/rendering/LODManager.js';

// ========== CLASH DETECTION ==========
import { ClashDetection } from './core/clash/ClashDetection.js';
import { AdvancedClashDetection } from './core/clash/AdvancedClashDetection.js';

// ========== FLOOR SYSTEMS ==========
import { FloorConnector } from './core/floors/FloorConnector.js';
import { FloorCopySystem } from './core/floors/FloorCopySystem.js';
import { FloorNavigation } from './core/floors/FloorNavigation.js';

// ========== UNIVERSAL SYSTEMS ==========
import { UniversalElement } from './core/elements/UniversalElement.js';
import { UniversalImporter } from './core/import/UniversalImporter.js';

// ========== DEBUG & ANALYTICS ==========
import { DebugLayer } from './core/debug/DebugLayer.js';
import { AnalyticsDebugger } from './core/debug/AnalyticsDebugger.js';

// ========== ARCHITECTURE MODULES ==========
import { Wall } from './Modules/Architecture/Wall.js';
import { Door } from './Modules/Architecture/Door.js';
import { Window } from './Modules/Architecture/Window.js';
import { Floor } from './Modules/Architecture/Floor.js';
import { Finish } from './Modules/Architecture/Finish.js';
import { Opening } from './Modules/Architecture/Opening.js';
import { BuildingMaterial } from './Modules/Architecture/Material.js';

// ========== ARCHITECTURE GLOBAL ==========
import { GlobalWall } from './Modules/Architecture/global/GlobalWall.js';
import { GlobalFloor } from './Modules/Architecture/global/GlobalFloor.js';

// ========== CONCRETE MODULES ==========
import { Foundation } from './Modules/Concrete/Foundation.js';
import { Column } from './Modules/Concrete/Column.js';
import { Beam } from './Modules/Concrete/Beam.js';
import { Slab } from './Modules/Concrete/Slab.js';
import { Rebar, RebarLayout } from './Modules/Concrete/Rebar.js';
import { ConcreteMaterial } from './Modules/Concrete/ConcreteMaterial.js';

// ========== CONCRETE GLOBAL ==========
import { GlobalBeam } from './Modules/Concrete/global/GlobalBeam.js';
import { GlobalColumn } from './Modules/Concrete/global/GlobalColumn.js';
import { GlobalSlab } from './Modules/Concrete/global/GlobalSlab.js';

// ========== EARTHWORKS MODULES ==========
import { Excavation } from './Modules/Earthworks/Excavation.js';
import { Compaction } from './Modules/Earthworks/Compaction.js';
import { Layer } from './Modules/Earthworks/Layer.js';
import { SoilMaterial } from './Modules/Earthworks/SoilMaterial.js';

// ========== EARTHWORKS GLOBAL ==========
import { GlobalExcavation } from './Modules/Earthworks/global/GlobalExcavation.js';
import { GlobalCompaction } from './Modules/Earthworks/global/GlobalCompaction.js';

// ========== MEP MODULES ==========
import { ElectricalCircuit } from './Modules/MEP/Electrical.js';
import { PlumbingSystem } from './Modules/MEP/Plumbing.js';
import { HVACSystem } from './Modules/MEP/HVAC.js';
import { DrainageSystem } from './Modules/MEP/Drainage.js';
import { Pipe } from './Modules/MEP/Pipe.js';
import { Cable } from './Modules/MEP/Cable.js';
import { Fixture } from './Modules/MEP/Fixture.js';
import { MEPMaterial } from './Modules/MEP/Material.js';

// ========== MEP GLOBAL ==========
import { GlobalElectrical } from './Modules/MEP/global/GlobalElectrical.js';
import { GlobalPlumbing } from './Modules/MEP/global/GlobalPlumbing.js';
import { GlobalHVAC } from './Modules/MEP/global/GlobalHVAC.js';

// ========== BOQ MODULES ==========
import { BOQCalculator } from './Modules/BOQ/Calculator.js';
import { BOQReporter } from './Modules/BOQ/Reporter.js';
import { BOQExporter } from './Modules/BOQ/Exporter.js';

// ========== BOQ GLOBAL ==========
import { GlobalBOQCalculator } from './Modules/BOQ/global/GlobalBOQCalculator.js';
import { GlobalReporter } from './Modules/BOQ/global/GlobalReporter.js';
import { GlobalEarthworksBOQ } from './Modules/BOQ/global/GlobalEarthworksBOQ.js';

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
import { UniversalPropertiesPanel } from './ui/UniversalPropertiesPanel.js';
import { GlobalEntitiesPanel } from './ui/global/GlobalEntitiesPanel.js';
import { SceneConnectorUI } from './ui/global/SceneConnectorUI.js';
import { CalibrationUI } from './ui/cad/CalibrationUI.js';

// ========== WORKER MODES ==========
import { WorkerMode } from './player/WorkerMode.js';
import { ForemanMode } from './player/ForemanMode.js';
import { MobileWorkerMode } from './player/MobileWorkerMode.js';
import { WorkerMarkers } from './player/WorkerMarkers.js';

// =======================================
// 🎯 MAIN CLASS - ACTUAL VIEW CONSTRUCTION OS
// =======================================

class ActualViewConstructionOS {
    constructor() {
        console.log('%c========================================', 'color: #ffaa44');
        console.log('%c🚀 ACTUAL VIEW CONSTRUCTION OS v3.0.0', 'color: #ffaa44; font-size: 18px; font-weight: bold;');
        console.log('%c📐 جميع الأنظمة مفعلة - النسخة الكاملة', 'color: #88aaff; font-size: 14px;');
        console.log('%c========================================', 'color: #ffaa44');
        
        // ===== تهيئة الحاوية =====
        this.engine = {};
        this.state = {
            currentWorkflowStep: 1,
            currentViewMode: 'plan',
            currentScene: null,
            selectedElement: null,
            drawingMode: null,
            calibrationPoints: [],
            scenes: new Map(),
            elements: [],
            clashes: [],
            indicatorRotation: 0
        };
        
        // ===== تهيئة جميع الأنظمة =====
        this.initThree();
        this.initCore();
        this.initGlobalSystems();
        this.initRealityBridge();
        this.initLoadingSystems();
        this.initClashDetection();
        this.initFloorSystems();
        this.initUniversalSystems();
        this.initCADTools();
        this.initMeasurementTools();
        this.initExportTools();
        this.initBOQ();
        this.initMaterials();
        this.initUI();
        this.initDebugSystems();
        this.initWorkerModes();
        
        // ===== تجهيز المشهد الأساسي مع الأرضية والكرة =====
        this.setupScene();
        
        // ===== بدء الحركة =====
        this.animate();
        
        console.log('%c✅ ACTUAL VIEW CONSTRUCTION OS جاهز', 'color: #44ff44; font-size: 16px;');
        console.log('📊 جميع الأنظمة:', Object.keys(this.engine).length);
    }

    // ========== THREE.JS INIT ==========
    initThree() {
        try {
            // المشهد
            this.engine.scene = new THREE.Scene();
            this.engine.scene.background = new THREE.Color(0x111122);
            
            // الكاميرا
            this.engine.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
            this.engine.camera.position.set(15, 10, 20);
            this.engine.camera.lookAt(0, 0, 0);
            
            // الريندرر الرئيسي
            this.engine.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.engine.renderer.setSize(window.innerWidth, window.innerHeight);
            this.engine.renderer.shadowMap.enabled = true;
            document.getElementById('container').appendChild(this.engine.renderer.domElement);
            
            // التحكم
            this.engine.controls = new OrbitControls(this.engine.camera, this.engine.renderer.domElement);
            this.engine.controls.enableDamping = true;
            this.engine.controls.dampingFactor = 0.05;
            this.engine.controls.screenSpacePanning = true;
            this.engine.controls.maxPolarAngle = Math.PI / 2;
            this.engine.controls.target.set(0, 1.6, 0);
            
            console.log('✅ Three.js initialized');
        } catch (error) {
            console.error('❌ Three.js init failed:', error);
        }
    }

    // ========== CORE SYSTEMS ==========
    initCore() {
        try {
            this.engine.geoRef = new GeoReferencing();
            this.engine.geoRef.setCoordinateSystem('utm');
            this.engine.geoRef.setOrigin(0, 0, 0);
            this.engine.geoRef.setScale(1.0);
            
            this.engine.sceneManager = new SceneManager(this);
            this.engine.projectManager = new ProjectManager();
            this.engine.projectManager.createProject('ACTUAL Project', 'Reality BIM Platform');
            
            this.engine.sceneGraph = new SceneGraph();
            this.engine.storage = new StorageManager();
            this.engine.storage.init();
            
            console.log('✅ Core systems initialized');
        } catch (error) {
            console.error('❌ Core init failed:', error);
        }
    }

    // ========== GLOBAL SYSTEMS ==========
    initGlobalSystems() {
        try {
            this.engine.globalSystem = new GlobalEntitySystem(this.engine.geoRef);
            this.engine.sceneConnector = new SceneConnector(this.engine.geoRef);
            this.engine.sceneConnector.setGlobalSystem(this.engine.globalSystem);
            this.engine.coordTransformer = new CoordinateTransformer(this.engine.geoRef, this.engine.sceneConnector);
            
            console.log('✅ Global systems initialized');
        } catch (error) {
            console.error('❌ Global systems init failed:', error);
        }
    }

    // ========== REALITY BRIDGE ==========
    initRealityBridge() {
        try {
            this.engine.realityBridge = new RealityBridge(
                this.engine.globalSystem, 
                this.engine.sceneConnector, 
                this.engine.sceneGraph
            );
            
            this.engine.syncManager = new SyncManager(this.engine.realityBridge);
            this.engine.sceneAnchor = new SceneAnchor(this.engine.geoRef, this.engine.sceneConnector);
            this.engine.entityMarker = new EntityMarker(this.engine.scene);
            this.engine.sceneLink = new SceneLink(this.engine.realityBridge);
            
            console.log('✅ Reality Bridge initialized');
        } catch (error) {
            console.error('❌ Reality Bridge init failed:', error);
        }
    }

    // ========== LOADING SYSTEMS ==========
    initLoadingSystems() {
        try {
            this.engine.loader = new IntegratedLoader(this.engine.sceneGraph, this.engine.storage, this.engine.camera);
            this.engine.lazyLoader = new LazySceneLoader(this.engine.sceneGraph, this.engine.storage);
            this.engine.segmentedLoader = new SegmentedSceneLoader();
            this.engine.loadingStrategy = new LoadingStrategy(this.engine.sceneGraph);
            this.engine.priorityQueue = new PriorityQueue(this);
            this.engine.tileLODManager = new TileLODManager(this.engine.camera);
            this.engine.lodManager = new LODManager(this.engine.camera);
            
            console.log('✅ Loading systems initialized');
        } catch (error) {
            console.error('❌ Loading systems init failed:', error);
        }
    }

    // ========== CLASH DETECTION ==========
    initClashDetection() {
        try {
            this.engine.clashDetection = new ClashDetection(this.engine.globalSystem, this.engine.sceneConnector);
            this.engine.advancedClashDetection = new AdvancedClashDetection(this.engine.globalSystem, this.engine.sceneConnector);
            
            console.log('✅ Clash detection initialized');
        } catch (error) {
            console.error('❌ Clash detection init failed:', error);
        }
    }

    // ========== FLOOR SYSTEMS ==========
    initFloorSystems() {
        try {
            this.engine.floorConnector = new FloorConnector(this.engine.globalSystem, this.engine.sceneConnector);
            this.engine.floorCopySystem = new FloorCopySystem(this.engine.globalSystem, this.engine.sceneConnector);
            this.engine.floorNavigation = new FloorNavigation(this.engine.floorConnector);
            
            console.log('✅ Floor systems initialized');
        } catch (error) {
            console.error('❌ Floor systems init failed:', error);
        }
    }

    // ========== UNIVERSAL SYSTEMS ==========
    initUniversalSystems() {
        try {
            this.engine.universalElement = new UniversalElement();
            this.engine.universalImporter = new UniversalImporter(this.engine.globalSystem, this.engine.cadImporter);
            
            console.log('✅ Universal systems initialized');
        } catch (error) {
            console.error('❌ Universal systems init failed:', error);
        }
    }

    // ========== CAD TOOLS ==========
    initCADTools() {
        try {
            this.engine.cadImporter = new CADImporter(this.engine.geoRef, this.engine.sceneConnector);
            this.engine.calibrationWizard = new CalibrationWizard(this.engine.geoRef, this.engine.sceneConnector);
            this.engine.dwgParser = new DWGParser();
            this.engine.dxfParser = new DXFParser();
            
            console.log('✅ CAD tools initialized');
        } catch (error) {
            console.error('❌ CAD tools init failed:', error);
        }
    }

    // ========== MEASUREMENT TOOLS ==========
    initMeasurementTools() {
        try {
            this.engine.distanceTool = new DistanceTool(this);
            this.engine.areaTool = new AreaTool(this);
            this.engine.volumeTool = new VolumeTool(this);
            
            console.log('✅ Measurement tools initialized');
        } catch (error) {
            console.error('❌ Measurement tools init failed:', error);
        }
    }

    // ========== EXPORT TOOLS ==========
    initExportTools() {
        try {
            this.engine.constructionExporter = new ConstructionExporter(this);
            this.engine.globalDataExporter = new GlobalDataExporter(this);
            
            console.log('✅ Export tools initialized');
        } catch (error) {
            console.error('❌ Export tools init failed:', error);
        }
    }

    // ========== BOQ SYSTEMS ==========
    initBOQ() {
        try {
            this.engine.boqCalculator = new BOQCalculator(this);
            this.engine.boqReporter = new BOQReporter(this.engine.boqCalculator);
            this.engine.boqExporter = new BOQExporter(this.engine.boqReporter);
            
            this.engine.globalBOQ = new GlobalBOQCalculator(this.engine.globalSystem);
            this.engine.globalReporter = new GlobalReporter(this.engine.globalBOQ);
            this.engine.globalEarthworksBOQ = new GlobalEarthworksBOQ(this.engine.globalSystem);
            
            console.log('✅ BOQ systems initialized');
        } catch (error) {
            console.error('❌ BOQ init failed:', error);
        }
    }

    // ========== MATERIALS LIBRARY ==========
    initMaterials() {
        try {
            this.engine.materialLibrary = new MaterialLibrary();
            
            console.log('✅ Materials library initialized');
        } catch (error) {
            console.error('❌ Materials init failed:', error);
        }
    }

    // ========== UI SYSTEMS ==========
    initUI() {
        try {
            this.ui = {
                dashboard: new Dashboard(this),
                propertiesPanel: new PropertiesPanel(this),
                toolbar: new Toolbar(this),
                universalPropertiesPanel: new UniversalPropertiesPanel(),
                globalEntitiesPanel: new GlobalEntitiesPanel(this),
                sceneConnectorUI: new SceneConnectorUI(this),
                calibrationUI: new CalibrationUI(this, this.engine.calibrationWizard)
            };
            
            console.log('✅ UI systems initialized');
        } catch (error) {
            console.error('❌ UI init failed:', error);
        }
    }

    // ========== DEBUG SYSTEMS ==========
    initDebugSystems() {
        try {
            this.engine.analytics = new AnalyticsDebugger(this.engine.loader, this.engine.realityBridge);
            this.engine.loader.analytics = this.engine.analytics;
            this.engine.debugLayer = new DebugLayer(
                this.engine.sceneGraph, 
                this.engine.realityBridge, 
                this.engine.loader, 
                this.engine.lodManager
            );
            this.engine.debugLayer.setupKeyboardShortcut();
            this.engine.analytics.startTracking();
            
            console.log('✅ Debug systems initialized');
        } catch (error) {
            console.error('❌ Debug init failed:', error);
        }
    }

    // ========== WORKER MODES ==========
    initWorkerModes() {
        try {
            this.engine.workerMode = new WorkerMode(this);
            this.engine.foremanMode = new ForemanMode(this);
            this.engine.mobileWorkerMode = new MobileWorkerMode(this);
            this.engine.workerMarkers = new WorkerMarkers(this.engine.scene);
            
            console.log('✅ Worker modes initialized');
        } catch (error) {
            console.warn('⚠️ Worker modes not available');
        }
    }

    // ========== SCENE SETUP مع الأرضية والكرة ==========
    setupScene() {
        try {
            // ===== 1. إضاءة محيطة =====
            const ambientLight = new THREE.AmbientLight(0x404060);
            this.engine.scene.add(ambientLight);
            
            // إضاءة شمسية
            const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
            sunLight.position.set(20, 30, 20);
            sunLight.castShadow = true;
            this.engine.scene.add(sunLight);
            
            // ===== 2. الأرضية المربعة الواضحة =====
            const gridHelper = new THREE.GridHelper(100, 50, 0x88aaff, 0x335588);
            gridHelper.position.y = 0;
            gridHelper.name = "mainGrid";
            this.engine.scene.add(gridHelper);
            
            // شبكة ثانوية دقيقة
            const detailGrid = new THREE.GridHelper(50, 25, 0x44aaff, 0x224466);
            detailGrid.position.y = 0.01;
            detailGrid.name = "detailGrid";
            this.engine.scene.add(detailGrid);
            
            // ===== 3. الكرة المركزية (للإشارة إلى مركز المشهد) =====
            const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
            const sphereMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xffaa44,
                emissive: 0x442200
            });
            const centerSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            centerSphere.position.set(0, 0.5, 0);
            centerSphere.name = "centerSphere";
            this.engine.scene.add(centerSphere);
            
            // إضاءة حول الكرة
            const pointLight = new THREE.PointLight(0xffaa44, 1, 10);
            pointLight.position.set(0, 1, 0);
            this.engine.scene.add(pointLight);
            
            // ===== 4. محاور إحداثية =====
            const axesHelper = new THREE.AxesHelper(10);
            axesHelper.name = "axesHelper";
            this.engine.scene.add(axesHelper);
            
            // ===== 5. مؤشرات على الأرضية =====
            const pointsMaterial = new THREE.PointsMaterial({ color: 0x88aaff, size: 0.2 });
            const pointsGeometry = new THREE.BufferGeometry();
            const positions = [];
            for (let x = -20; x <= 20; x += 5) {
                for (let z = -20; z <= 20; z += 5) {
                    positions.push(x, 0.05, z);
                }
            }

            pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            const points = new THREE.Points(pointsGeometry, pointsMaterial);
            points.name = "referencePoints";
            this.engine.scene.add(points);
            
            // ===== 6. أرضية شفافة للظلال =====
            const floorGeometry = new THREE.CircleGeometry(100, 64);
            const floorMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x1a1a1a, 
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
            
            // ===== 7. مؤشر حركة (يدور) =====
            this.createMovementIndicator();
            
            console.log('✅ Scene setup complete with grid and center sphere');
            
        } catch (error) {
            console.error('❌ Scene setup failed:', error);
        }
    }

    // ===== مؤشر الحركة =====
    createMovementIndicator() {
        const indicatorGroup = new THREE.Group();
        
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const sphereGeo = new THREE.SphereGeometry(0.1, 8, 8);
            const sphereMat = new THREE.MeshStandardMaterial({ color: 0xffaa44 });
            const sphere = new THREE.Mesh(sphereGeo, sphereMat);
            sphere.position.set(Math.cos(angle) * 4, 0.2, Math.sin(angle) * 4);
            indicatorGroup.add(sphere);
        }
        
        indicatorGroup.name = "movementIndicator";
        this.engine.scene.add(indicatorGroup);
    }

    // ========== ANIMATION LOOP ==========
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.engine.controls) this.engine.controls.update();
        if (this.engine.lodManager) this.engine.lodManager.update();
        if (this.engine.tileLODManager) this.engine.tileLODManager.update();
        
        // تدوير مؤشر الحركة
        if (this.state.indicatorRotation !== undefined) {
            this.state.indicatorRotation += 0.01;
            const indicator = this.engine.scene.getObjectByName('movementIndicator');
            if (indicator) {
                indicator.rotation.y = this.state.indicatorRotation;
            }
        }
        
        if (this.engine.renderer && this.engine.scene && this.engine.camera) {
            this.engine.renderer.render(this.engine.scene, this.engine.camera);
        }
    }

    // ========== IMPORT 360 IMAGE ==========
    async import360Image(url, sceneName) {
        try {
            const sceneId = `scene-${Date.now()}`;
            this.engine.sceneConnector.addScene(sceneId, { x: 0, y: 0, z: 0 }, 0);
            
            const texture = await this.loadTexture(url);
            const geometry = new THREE.SphereGeometry(500, 60, 40);
            const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.userData = { type: '360image', sceneId, sceneName };
            
            this.engine.scene.add(sphere);
            this.state.scenes.set(sceneId, { id: sceneId, name: sceneName, sphere, texture, elements: [], anchors: [] });
            
            this.updateSceneExplorer();
            console.log(`✅ Imported 360 image: ${sceneName}`);
            return sceneId;
        } catch (error) {
            console.error('❌ Import failed:', error);
            return null;
        }
    }

    loadTexture(url) {
        return new Promise((resolve, reject) => {
            new THREE.TextureLoader().load(url, resolve, undefined, reject);
        });
    }

    // ========== IMPORT CAD ==========
    importCAD(file) {
        console.log(`📄 Importing CAD: ${file.name}`);
        // سيتم تنفيذها لاحقاً
    }

    // ========== CALIBRATION ==========
    startCalibrationPoint() {
        this.state.drawingMode = 'calibration';
        console.log('🔍 Click on image to add calibration point');
    }

    addCalibrationPoint(point) {
        this.engine.geoRef.addGCP(
            { x: point.imageX, y: point.imageY, z: 0 },
            { x: point.realX, y: point.realY, z: 0 }
        );
        this.state.calibrationPoints.push(point);
        this.updateCalibrationPointsList();
        
        // تحديث عداد GCP في الواجهة
        const gcpCountEl = document.getElementById('gcpCount');
        if (gcpCountEl) {
            gcpCountEl.textContent = this.engine.geoRef.gcp.length;
        }
        
        // تحديث مصفوفة التحويل إذا كان لدينا 3 نقاط أو أكثر
        if (this.engine.geoRef.gcp.length >= 3) {
            this.engine.geoRef.calculateTransform();
            this.updateTransformMatrix();
        }
    }

    // دالة جديدة لتحديث مصفوفة التحويل في الواجهة
    updateTransformMatrix() {
        const matrixEl = document.getElementById('transformMatrix');
        if (!matrixEl) return;
        
        const matrix = this.engine.geoRef.transformMatrix;
        if (matrix) {
            let matrixText = '';
            matrix.forEach(row => {
                matrixText += row.map(v => v.toFixed(3)).join('  ') + '\n';
            });
            matrixEl.innerHTML = matrixText.replace(/\n/g, '<br>');
        }
    }

    runCalibration() {
        if (this.state.calibrationPoints.length < 3) {
            alert('Need at least 3 calibration points');
            return;
        }
        this.engine.geoRef.calculateTransform();
        const report = this.engine.geoRef.getCalibrationReport();
        console.log('✅ Calibration complete:', report);
        
        // تحديث مصفوفة التحويل
        this.updateTransformMatrix();
    }

    // ========== CLASH DETECTION ==========
    runClashDetection() {
        if (!this.engine.advancedClashDetection) return;
        
        const report = this.engine.advancedClashDetection.runFullCheck(this.state.scenes);
        this.state.clashes = report.clashes || [];
        
        console.log(`🔍 Clash detection: ${this.state.clashes.length} clashes found`);
        return report;
    }

    // ========== ELEMENT CREATION ==========
    startDrawing(type) {
        if (!this.state.currentScene) {
            alert('Select a scene first');
            return;
        }
        this.state.drawingMode = type;
        console.log(`✏️ Drawing mode: ${type}`);
    }

    // ========== UI UPDATES ==========
    updateSceneExplorer() {
        const treeEl = document.getElementById('sceneTree');
        if (!treeEl) return;
        
        let html = '<li class="scene-item active"><i class="fas fa-building"></i><span>Main Project</span></li><ul class="scene-children">';
        this.state.scenes.forEach((scene, id) => {
            html += `<li class="scene-item" onclick="window.app.selectScene('${id}')"><i class="fas fa-image"></i><span>${scene.name}</span></li>`;
        });
        html += '</ul>';
        
        treeEl.innerHTML = html;
    }

    selectScene(sceneId) {
        this.state.currentScene = sceneId;
        const scene = this.state.scenes.get(sceneId);
        if (scene?.sphere) {
            this.state.scenes.forEach(s => { if (s.sphere) s.sphere.visible = false; });
            scene.sphere.visible = true;
        }
        console.log(`📌 Selected scene: ${scene.name}`);
    }

    updateCalibrationPointsList() {
        const listEl = document.getElementById('calibrationPointsList');
        if (!listEl) return;
        
        if (this.state.calibrationPoints.length === 0) {
            listEl.innerHTML = '<div class="text-muted" style="text-align:center; padding:20px;">No calibration points</div>';
            return;
        }
        
        let html = '';
        this.state.calibrationPoints.forEach((point, i) => {
            html += `<div class="property-row"><span class="property-label">Point ${i+1}:</span><span class="property-value">(${point.imageX},${point.imageY}) → (${point.realX},${point.realY})</span></div>`;
        });
        listEl.innerHTML = html;
    }

    setViewMode(mode) {
        this.state.currentViewMode = mode;
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        console.log(`👁️ View mode: ${mode}`);
    }

    // ========== STATUS ==========
    updateStatus(message, type = 'info') {
        document.getElementById('statusMessage').innerHTML = message;
        console.log(type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️', message);
    }

    // ========== GET SYSTEM STATUS ==========
    getSystemStatus() {
        return {
            version: '3.0.0',
            name: 'ACTUAL VIEW CONSTRUCTION OS',
            type: 'Reality-BIM Engine',
            status: 'running',
            stats: {
                scenes: this.state.scenes.size,
                elements: this.state.elements.length,
                gcps: this.engine.geoRef.gcp.length,
                clashes: this.state.clashes.length,
                transformMatrix: this.engine.geoRef.transformMatrix ? 'calculated' : 'not calculated'
            }
        };
    }
}

// =======================================
// 🚀 START APPLICATION
// =======================================

window.addEventListener('load', () => {
    console.log('%c========================================', 'color: #ffaa44');
    console.log('%c🌟 ACTUAL VIEW CONSTRUCTION OS', 'color: #ffaa44; font-size: 24px;');
    console.log('%c📐 All systems activated', 'color: #88aaff; font-size: 16px;');
    console.log('%c========================================', 'color: #ffaa44');
    
    window.app = new ActualViewConstructionOS();
    
    // ربط دوال الواجهة
    window.showImportSceneDialog = () => document.getElementById('importImageModal')?.classList.remove('hidden');
    window.showImportCADDialog = () => document.getElementById('importCADModal')?.classList.remove('hidden');
    window.hideModal = (id) => document.getElementById(id)?.classList.add('hidden');
    
    window.importImage = () => {
        const input = document.getElementById('imageInput');
        const name = document.getElementById('sceneName').value;
        if (input.files.length) {
            window.app.import360Image(URL.createObjectURL(input.files[0]), name);
            document.getElementById('importImageModal').classList.add('hidden');
        }
    };
    
    window.importCAD = () => {
        const input = document.getElementById('cadInput');
        if (input.files.length) {
            window.app.importCAD(input.files[0]);
            document.getElementById('importCADModal').classList.add('hidden');
        }
    };
    
    window.startDrawWall = () => window.app?.startDrawing('wall');
    window.startDrawColumn = () => window.app?.startDrawing('column');
    window.addDoor = () => window.app?.startDrawing('door');
    window.addWindow = () => window.app?.startDrawing('window');
    window.addBeam = () => window.app?.startDrawing('beam');
    window.addSlab = () => window.app?.startDrawing('slab');
    window.addFoundation = () => window.app?.startDrawing('foundation');
    window.addPipe = () => window.app?.startDrawing('pipe');
    
    window.addCalibrationPoint = () => window.app?.startCalibrationPoint();
    window.runCalibration = () => window.app?.runCalibration();
    window.runClashDetection = () => window.app?.runClashDetection();
    
    window.addCalibrationPointToScene = () => {
        window.app?.addCalibrationPoint({
            imageX: parseFloat(document.getElementById('imgX').value) || 0,
            imageY: parseFloat(document.getElementById('imgY').value) || 0,
            realX: parseFloat(document.getElementById('realX').value) || 0,
            realY: parseFloat(document.getElementById('realY').value) || 0
        });
        document.getElementById('calibrationPointModal').classList.add('hidden');
    };
    
    window.selectMaterial = (m) => window.app?.updateStatus(`Selected material: ${m}`, 'success');
    window.updateStatus = (msg, type) => window.app?.updateStatus(msg, type);
    window.getSystemStatus = () => window.app?.getSystemStatus();
    
    // تحديث workflow step
    window.updateWorkflow = (step) => {
        const steps = document.querySelectorAll('.workflow-step');
        steps.forEach((s, i) => s.classList.toggle('active', i < step));
        document.getElementById('statusMessage').innerHTML = `Step ${step}/7: ${['','Import CAD','Draw Plan','Import 360','Calibrate','Link','Build','BOQ'][step]}`;
    };
    
    window.updateWorkflow(1);
    window.app.updateStatus('All systems ready', 'success');
    
    console.log('📌 Commands: window.app, getSystemStatus(), updateWorkflow()');
});

// ===== RESTART FUNCTION =====
window.restartApp = () => {
    console.log('🔄 Restarting application...');
    location.reload();
};


