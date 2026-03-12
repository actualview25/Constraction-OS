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

// ========== LANDSCAPING MODULES ==========
import { Plant } from './Modules/Landscaping/Plant.js';
import { Grass } from './Modules/Landscaping/Grass.js';
import { Tree } from './Modules/Landscaping/Tree.js';
import { Palm } from './Modules/Landscaping/Palm.js';
import { Fountain } from './Modules/Landscaping/Fountain.js';
import { GardenLight } from './Modules/Landscaping/GardenLight.js';
import { GardenPath } from './Modules/Landscaping/GardenPath.js';
import { LandscapingMaterial } from './Modules/Landscaping/Material.js';

// ========== STONE & BRICK MODULES ==========
import { Stone } from './Modules/StoneBrick/Stone.js';
import { Brick } from './Modules/StoneBrick/Brick.js';
import { Tile } from './Modules/StoneBrick/Tile.js';
import { Marble } from './Modules/StoneBrick/Marble.js';
import { Granite } from './Modules/StoneBrick/Granite.js';
import { Cladding } from './Modules/StoneBrick/Cladding.js';
import { Pavement } from './Modules/StoneBrick/Pavement.js';
import { StoneBrickMaterial } from './Modules/StoneBrick/Material.js';

// ========== GLASS MODULES ==========
import { Glass } from './Modules/Glass/Glass.js';
import { WindowGlass } from './Modules/Glass/WindowGlass.js';
import { CurtainWall } from './Modules/Glass/CurtainWall.js';
import { GlassPartition } from './Modules/Glass/GlassPartition.js';
import { Skylight } from './Modules/Glass/Skylight.js';
import { GlassFloor } from './Modules/Glass/GlassFloor.js';
import { GlassRailing } from './Modules/Glass/GlassRailing.js';
import { StainedGlass } from './Modules/Glass/StainedGlass.js';
import { SmartGlass } from './Modules/Glass/SmartGlass.js';
import { GlassBlock } from './Modules/Glass/GlassBlock.js';
import { GlassMaterial } from './Modules/Glass/Material.js';

// ========== LANDSCAPING GLOBAL MODULES ==========
import { GlobalPlant } from './Modules/Landscaping/global/GlobalPlant.js';
import { GlobalTree } from './Modules/Landscaping/global/GlobalTree.js';
import { GlobalFountain } from './Modules/Landscaping/global/GlobalFountain.js';
import { GlobalGardenPath } from './Modules/Landscaping/global/GlobalGardenPath.js';

// ========== STONE & BRICK GLOBAL MODULES ==========
import { GlobalStone } from './Modules/StoneBrick/global/GlobalStone.js';
import { GlobalBrick } from './Modules/StoneBrick/global/GlobalBrick.js';
import { GlobalMarble } from './Modules/StoneBrick/global/GlobalMarble.js';
import { GlobalCladding } from './Modules/StoneBrick/global/GlobalCladding.js';
import { GlobalPavement } from './Modules/StoneBrick/global/GlobalPavement.js';

// ========== GLASS GLOBAL MODULES ==========
import { GlobalGlass } from './Modules/Glass/global/GlobalGlass.js';
import { GlobalCurtainWall } from './Modules/Glass/global/GlobalCurtainWall.js';
import { GlobalGlassPartition } from './Modules/Glass/global/GlobalGlassPartition.js';
import { GlobalSkylight } from './Modules/Glass/global/GlobalSkylight.js';

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
        
        // ===== تهيئة Three.js أولاً =====
        this.initThree();
        
        // ===== تهيئة الأنظمة الأساسية =====
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
        
        // ===== تهيئة الأنظمة الجديدة =====
        this.initLandscapingModules();
        this.initStoneBrickModules();
        this.initGlassModules();
        
        // ===== تهيئة الأنظمة العالمية الجديدة =====
        this.initGlobalLandscaping();
        this.initGlobalStoneBrick();
        this.initGlobalGlass();
        
        // ===== تجهيز المشهد الأساسي =====
        this.setupScene();
        
        // ===== بدء الحركة =====
        this.animate();
        
        console.log('%c✅ ACTUAL VIEW CONSTRUCTION OS جاهز', 'color: #44ff44; font-size: 16px;');
        console.log('📊 جميع الأنظمة:', Object.keys(this.engine).length);
    }

    // ========== THREE.JS INIT ==========
    initThree() {
        try {
            this.engine.scene = new THREE.Scene();
            this.engine.scene.background = new THREE.Color(0x111122);
            this.engine.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
            this.engine.camera.position.set(15, 10, 20);
            this.engine.camera.lookAt(0, 0, 0);
            this.engine.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.engine.renderer.setSize(window.innerWidth, window.innerHeight);
            this.engine.renderer.shadowMap.enabled = true;
            document.getElementById('container').appendChild(this.engine.renderer.domElement);
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

    // ========== LANDSCAPING MODULES ==========
    initLandscapingModules() {
        try {
            // يمكن تخزين الكلاسات للاستخدام لاحقاً
            this.landscaping = {
                Plant,
                Grass,
                Tree,
                Palm,
                Fountain,
                GardenLight,
                GardenPath,
                LandscapingMaterial
            };
            console.log('✅ Landscaping modules initialized');
        } catch (error) {
            console.error('❌ Landscaping modules init failed:', error);
        }
    }

    // ========== STONE & BRICK MODULES ==========
    initStoneBrickModules() {
        try {
            this.stoneBrick = {
                Stone,
                Brick,
                Tile,
                Marble,
                Granite,
                Cladding,
                Pavement,
                StoneBrickMaterial
            };
            console.log('✅ Stone & Brick modules initialized');
        } catch (error) {
            console.error('❌ Stone & Brick modules init failed:', error);
        }
    }

    // ========== GLASS MODULES ==========
    initGlassModules() {
        try {
            this.glass = {
                Glass,
                WindowGlass,
                CurtainWall,
                GlassPartition,
                Skylight,
                GlassFloor,
                GlassRailing,
                StainedGlass,
                SmartGlass,
                GlassBlock,
                GlassMaterial
            };
            console.log('✅ Glass modules initialized');
        } catch (error) {
            console.error('❌ Glass modules init failed:', error);
        }
    }

    // ========== GLOBAL LANDSCAPING ==========
    initGlobalLandscaping() {
        try {
            this.globalPlant = new GlobalPlant(this.engine.globalSystem, this.engine.sceneConnector);
            this.globalTree = new GlobalTree(this.engine.globalSystem, this.engine.sceneConnector);
            this.globalFountain = new GlobalFountain(this.engine.globalSystem, this.engine.sceneConnector);
            this.globalGardenPath = new GlobalGardenPath(this.engine.globalSystem, this.engine.sceneConnector);
            console.log('✅ Global landscaping systems initialized');
        } catch (error) {
            console.error('❌ Global landscaping init failed:', error);
        }
    }

    // ========== GLOBAL STONE & BRICK ==========
    initGlobalStoneBrick() {
        try {
            this.globalStone = new GlobalStone(this.engine.globalSystem, this.engine.sceneConnector);
            this.globalBrick = new GlobalBrick(this.engine.globalSystem, this.engine.sceneConnector);
            this.globalMarble = new GlobalMarble(this.engine.globalSystem, this.engine.sceneConnector);
            this.globalCladding = new GlobalCladding(this.engine.globalSystem, this.engine.sceneConnector);
            this.globalPavement = new GlobalPavement(this.engine.globalSystem, this.engine.sceneConnector);
            console.log('✅ Global stone & brick systems initialized');
        } catch (error) {
            console.error('❌ Global stone & brick init failed:', error);
        }
    }

    // ========== GLOBAL GLASS ==========
    initGlobalGlass() {
        try {
            this.globalGlass = new GlobalGlass(this.engine.globalSystem, this.engine.sceneConnector);
            this.globalCurtainWall = new GlobalCurtainWall(this.engine.globalSystem, this.engine.sceneConnector);
            this.globalGlassPartition = new GlobalGlassPartition(this.engine.globalSystem, this.engine.sceneConnector);
            this.globalSkylight = new GlobalSkylight(this.engine.globalSystem, this.engine.sceneConnector);
            console.log('✅ Global glass systems initialized');
        } catch (error) {
            console.error('❌ Global glass init failed:', error);
        }
    }

    // ========== SCENE SETUP ==========
    setupScene() {
        try {
            // إضاءة
            const ambientLight = new THREE.AmbientLight(0x404060);
            this.engine.scene.add(ambientLight);
            const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
            sunLight.position.set(20, 30, 20);
            sunLight.castShadow = true;
            this.engine.scene.add(sunLight);
            
            // شبكات أرضية
            const mainGrid = new THREE.GridHelper(100, 50, 0x88aaff, 0x335588);
            mainGrid.position.y = 0;
            mainGrid.name = "mainGrid";
            this.engine.scene.add(mainGrid);
            const detailGrid = new THREE.GridHelper(50, 50, 0x44aaff, 0x224466);
            detailGrid.position.y = 0.01;
            detailGrid.name = "detailGrid";
            this.engine.scene.add(detailGrid);
            
            // كرة مركزية
            const sphereGeo = new THREE.SphereGeometry(0.8, 32, 32);
            const sphereMat = new THREE.MeshStandardMaterial({ color: 0xffaa44, emissive: 0x442200 });
            const centerSphere = new THREE.Mesh(sphereGeo, sphereMat);
            centerSphere.position.set(0, 0.8, 0);
            centerSphere.name = "centerSphere";
            this.engine.scene.add(centerSphere);
            
            // حلقة حول الكرة
            const torusGeo = new THREE.TorusGeometry(1.2, 0.05, 16, 100);
            const torusMat = new THREE.MeshStandardMaterial({ color: 0xffaa44, emissive: 0x442200 });
            const torus = new THREE.Mesh(torusGeo, torusMat);
            torus.rotation.x = Math.PI / 2;
            torus.position.set(0, 0.8, 0);
            torus.name = "centerTorus";
            this.engine.scene.add(torus);
            
            // محاور
            const axesHelper = new THREE.AxesHelper(15);
            axesHelper.name = "axesHelper";
            this.engine.scene.add(axesHelper);
            
            // نقاط مرجعية
            const pointsMat = new THREE.PointsMaterial({ color: 0x88aaff, size: 0.15 });
            const pointsGeo = new THREE.BufferGeometry();
            const positions = [];
            for (let x = -20; x <= 20; x += 2) {
                for (let z = -20; z <= 20; z += 2) {
                    positions.push(x, 0.02, z);
                }
            }

           pointsGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            const points = new THREE.Points(pointsGeo, pointsMat);
            points.name = "referencePoints";
            this.engine.scene.add(points);
            
            // مؤشر حركة
            this.createMovementIndicator();
            console.log('✅ Scene setup complete');
        } catch (error) {
            console.error('❌ Scene setup failed:', error);
        }
    }

    createMovementIndicator() {
        const group = new THREE.Group();
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const sphereGeo = new THREE.SphereGeometry(0.15, 8, 8);
            const sphereMat = new THREE.MeshStandardMaterial({ color: 0xffaa44, emissive: 0x442200 });
            const sphere = new THREE.Mesh(sphereGeo, sphereMat);
            sphere.position.set(Math.cos(angle) * 5, 0.3, Math.sin(angle) * 5);
            group.add(sphere);
        }
        group.name = "movementIndicator";
        this.engine.scene.add(group);
    }

    // ========== ANIMATION LOOP ==========
    animate() {
        requestAnimationFrame(() => this.animate());
        if (this.engine.controls) this.engine.controls.update();
        if (this.engine.lodManager) this.engine.lodManager.update();
        if (this.state.indicatorRotation !== undefined) {
            this.state.indicatorRotation += 0.01;
            const indicator = this.engine.scene.getObjectByName('movementIndicator');
            if (indicator) indicator.rotation.y = this.state.indicatorRotation;
        }
        const torus = this.engine.scene.getObjectByName('centerTorus');
        if (torus) torus.rotation.z += 0.005;
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
        const gcpCountEl = document.getElementById('gcpCount');
        if (gcpCountEl) gcpCountEl.textContent = this.engine.geoRef.gcp.length;
        if (this.engine.geoRef.gcp.length >= 3) {
            this.engine.geoRef.calculateTransform();
            this.updateTransformMatrix();
        }
    }

    updateTransformMatrix() {
        const matrixEl = document.getElementById('transformMatrix');
        if (!matrixEl) return;
        const matrix = this.engine.geoRef.transformMatrix;
        if (matrix) {
            let matrixText = '';
            matrix.forEach(row => matrixText += row.map(v => v.toFixed(3)).join('  ') + '\n');
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

    updateStatus(message, type = 'info') {
        document.getElementById('statusMessage').innerHTML = message;
        console.log(type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️', message);
    }

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
    
    // ===== ARCHITECTURE =====
    window.startDrawWall = () => window.app?.startDrawing('wall');
    window.startDrawColumn = () => window.app?.startDrawing('column');
    window.addDoor = () => window.app?.startDrawing('door');
    window.addWindow = () => window.app?.startDrawing('window');
    window.addBeam = () => window.app?.startDrawing('beam');
    window.addSlab = () => window.app?.startDrawing('slab');
    window.addFoundation = () => window.app?.startDrawing('foundation');
    window.addPipe = () => window.app?.startDrawing('pipe');
    
    // ===== LANDSCAPING =====
    window.addPlant = (options) => {
        if (!window.app) return;
        const plant = new window.app.landscaping.Plant(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(plant.createMesh());
        window.app.updateStatus('🌱 Plant added', 'success');
    };
    window.addGrass = (options) => {
        if (!window.app) return;
        const grass = new window.app.landscaping.Grass(options || { area: 10, position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(grass.createMesh());
        window.app.updateStatus('🌿 Grass added', 'success');
    };
    window.addTree = (options) => {
        if (!window.app) return;
        const tree = new window.app.landscaping.Tree(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(tree.createMesh());
        window.app.updateStatus('🌳 Tree added', 'success');
    };
    window.addPalm = (options) => {
        if (!window.app) return;
        const palm = new window.app.landscaping.Palm(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(palm.createMesh());
        window.app.updateStatus('🌴 Palm added', 'success');
    };
    window.addFountain = (options) => {
        if (!window.app) return;
        const fountain = new window.app.landscaping.Fountain(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(fountain.createMesh());
        window.app.updateStatus('⛲ Fountain added', 'success');
    };
    window.addGardenLight = (options) => {
        if (!window.app) return;
        const light = new window.app.landscaping.GardenLight(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(light.createMesh());
        window.app.updateStatus('💡 Garden light added', 'success');
    };
    window.addGardenPath = (points, options) => {
        if (!window.app) return;
        const path = new window.app.landscaping.GardenPath({ points: points || [{x:-2,z:-2},{x:2,z:2}], ...options });
        window.app.engine.scene.add(path.createMesh());
        window.app.updateStatus('🛤️ Garden path added', 'success');
    };
    
    // ===== STONE & BRICK =====
    window.addStone = (options) => {
        if (!window.app) return;
        const stone = new window.app.stoneBrick.Stone(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(stone.createMesh());
        window.app.updateStatus('🪨 Stone added', 'success');
    };
    window.addBrick = (options) => {
        if (!window.app) return;
        const brick = new window.app.stoneBrick.Brick(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(brick.createMesh());
        window.app.updateStatus('🧱 Brick added', 'success');
    };
    window.addMarble = (options) => {
        if (!window.app) return;
        const marble = new window.app.stoneBrick.Marble(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(marble.createMesh());
        window.app.updateStatus('✨ Marble added', 'success');
    };
    window.addGranite = (options) => {
        if (!window.app) return;
        const granite = new window.app.stoneBrick.Granite(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(granite.createMesh());
        window.app.updateStatus('⛰️ Granite added', 'success');
    };
    window.addCladding = (options) => {
        if (!window.app) return;
        const cladding = new window.app.stoneBrick.Cladding(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(cladding.createMesh());
        window.app.updateStatus('🏛️ Cladding added', 'success');
    };
    window.addPavement = (options) => {
        if (!window.app) return;
        const pavement = new window.app.stoneBrick.Pavement(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(pavement.createMesh());
        window.app.updateStatus('🛤️ Pavement added', 'success');
    };
    
    // ===== GLASS =====
    window.addGlass = (options) => {
        if (!window.app) return;
        const glass = new window.app.glass.Glass(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(glass.createMesh());
        window.app.updateStatus('🪟 Glass added', 'success');
    };
    window.addWindowGlass = (options) => {
        if (!window.app) return;
        const wg = new window.app.glass.WindowGlass(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(wg.createMesh());
        window.app.updateStatus('🪟 Window added', 'success');
    };
    window.addCurtainWall = (options) => {
        if (!window.app) return;
        const cw = new window.app.glass.CurtainWall(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(cw.createMesh());
        window.app.updateStatus('🏢 Curtain wall added', 'success');
    };
    window.addGlassPartition = (options) => {
        if (!window.app) return;
        const gp = new window.app.glass.GlassPartition(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(gp.createMesh());
        window.app.updateStatus('🚪 Glass partition added', 'success');
    };
    window.addSkylight = (options) => {
        if (!window.app) return;
        const sl = new window.app.glass.Skylight(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(sl.createMesh());
        window.app.updateStatus('☀️ Skylight added', 'success');
    };
    window.addGlassFloor = (options) => {
        if (!window.app) return;
        const gf = new window.app.glass.GlassFloor(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(gf.createMesh());
        window.app.updateStatus('✨ Glass floor added', 'success');
    };
    window.addGlassRailing = (options) => {
        if (!window.app) return;
        const gr = new window.app.glass.GlassRailing(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(gr.createMesh());
        window.app.updateStatus('🪢 Glass railing added', 'success');
    };
    window.addStainedGlass = (options) => {
        if (!window.app) return;
        const sg = new window.app.glass.StainedGlass(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(sg.createMesh());
        window.app.updateStatus('🎨 Stained glass added', 'success');
    };
    window.addSmartGlass = (options) => {
        if (!window.app) return;
        const smg = new window.app.glass.SmartGlass(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(smg.createMesh());
        window.app.updateStatus('🔮 Smart glass added', 'success');
    };
    window.addGlassBlock = (options) => {
        if (!window.app) return;
        const gb = new window.app.glass.GlassBlock(options || { position: { x: 0, y: 0, z: 0 } });
        window.app.engine.scene.add(gb.createMesh());
        window.app.updateStatus('🧊 Glass block added', 'success');
    };
    
    // ===== GLOBAL FUNCTIONS (يمكن استدعاؤها لاحقاً) =====
    window.createGlobalForest = (sceneId, center, radius, count) => {
        if (window.app?.globalTree) {
            return window.app.globalTree.createForest(sceneId, center, radius, count);
        }
    };

    // ===== CALIBRATION =====
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
    
    window.updateWorkflow = (step) => {
        const steps = document.querySelectorAll('.workflow-step');
        steps.forEach((s, i) => s.classList.toggle('active', i < step));
        document.getElementById('statusMessage').innerHTML = `Step ${step}/7: ${['','Import CAD','Draw Plan','Import 360','Calibrate','Link','Build','BOQ'][step]}`;
    };
    
    window.updateWorkflow(1);
    window.app.updateStatus('All systems ready', 'success');
    
    console.log('📌 Commands: window.app, getSystemStatus(), updateWorkflow()');
});

window.restartApp = () => {
    console.log('🔄 Restarting application...');
    location.reload();
};
