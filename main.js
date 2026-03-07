// =======================================
// ACTUAL CONSTRUCTION OS - MAIN ENTRY POINT
// =======================================
// منصة متكاملة لتصميم وإدارة المشاريع الهندسية
// =======================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ========== CORE SYSTEMS ==========
import { GeoReferencing } from './core/Georeferencing.js';
import { SceneManager } from './core/SceneManager.js';
import { ProjectManager } from './core/ProjectManager.js';
import { GlobalEntitySystem } from './core/global/GlobalEntitySystem.js';
import { SceneConnector } from './core/global/SceneConnector.js';
import { CoordinateTransformer } from './core/global/CoordinateTransformer.js';

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

// =======================================
// 🎯 MAIN CONSTRUCTION OS CLASS
// =======================================

class ActualConstructionOS {
    constructor() {
        console.log('🚀 بدء تشغيل ACTUAL CONSTRUCTION OS...');
        console.log('🏗️ منصة متكاملة لتصميم وإدارة المشاريع الهندسية');
        
        // ===== THREE.JS SETUP =====
        this.initThree();
        
        // ===== CORE SYSTEMS =====
        this.initCore();
        
        // ===== TOOLS =====
        this.initTools();
        
        // ===== UI =====
        this.initUI();
        
        // ===== SETUP =====
        this.setupLights();
        this.setupGrid();
        this.setupEvents();
        
        // بدء الحركة
        this.animate();
        
        console.log('✅ ACTUAL CONSTRUCTION OS جاهز للتشغيل');
    }

    initThree() {
        // المشهد
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111122);
        
        // الكاميرا
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.set(30, 20, 30);
        this.camera.lookAt(0, 5, 0);
        
        // الرندر
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('container').appendChild(this.renderer.domElement);
        
        // التحكم
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    initCore() {
        // نظم الإحداثيات
        this.geoRef = new GeoReferencing();
        
        // مديري المشروع
        this.sceneManager = new SceneManager(this);
        this.projectManager = new ProjectManager();
        
        // الأنظمة العالمية
        this.globalSystem = new GlobalEntitySystem(this.geoRef);
        this.sceneConnector = new SceneConnector(this.globalSystem);
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
        
        // تعريف الأنظمة للوصول العام
        window.constructionOS = this;
        window.globalSystem = this.globalSystem;
        window.sceneConnector = this.sceneConnector;
    }

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

    setupGrid() {
        // شبكة رئيسية
        const gridHelper = new THREE.GridHelper(200, 40, 0x88aaff, 0x335588);
        gridHelper.position.y = 0;
        this.scene.add(gridHelper);
        
        // محاور
        const axesHelper = new THREE.AxesHelper(20);
        this.scene.add(axesHelper);
    }

    setupEvents() {
        window.addEventListener('resize', () => this.onResize());
        
        // أحداث الفأرة
        this.renderer.domElement.addEventListener('click', (e) => this.onClick(e));
        this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
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
        mouse.x = (e.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

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
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    // ===== دوال مساعدة =====
    
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

    // ===== دوال التصدير =====
    
    exportToActualViewStudio() {
        return this.constructionExporter.export();
    }

    generateGlobalReport() {
        return this.globalReporter.generateFullReport();
    }
}

// =======================================
// 🚀 تشغيل التطبيق
// =======================================

window.addEventListener('load', () => {
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
    
    console.log('🌟 ACTUAL CONSTRUCTION OS جاهز للاستخدام');
    console.log('📊 يمكنك البدء في تصميم مشروعك الآن');
});

// للوصول من Console
window.ActualConstructionOS = ActualConstructionOS;
