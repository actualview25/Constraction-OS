// ui/PropertiesPanel.js

export class PropertiesPanel {
    constructor(app) {
        this.app = app;
        this.currentElement = null;
        this.createPanel();
    }
    
    createPanel() {
        const panel = document.createElement('div');
        panel.className = 'properties-panel';
        panel.style.cssText = `
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            width: 280px;
            background: rgba(20, 30, 40, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid #4a6c8f;
            border-radius: 12px;
            color: white;
            z-index: 1000;
            padding: 15px;
            display: none;
        `;
        
        panel.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #88aaff;">📋 الخصائص</h3>
            <div id="properties-content"></div>
        `;
        
        document.body.appendChild(panel);
        this.panel = panel;
        this.content = panel.querySelector('#properties-content');
    }
    
    showForElement(element) {
        this.currentElement = element;
        this.panel.style.display = 'block';
        this.updateContent();
    }
    
    hide() {
        this.panel.style.display = 'none';
        this.currentElement = null;
    }
    
    updateContent() {
        if (!this.currentElement) return;
        
        const boq = this.currentElement.getBOQ ? this.currentElement.getBOQ() : {};
        let html = '';
        
        Object.entries(boq).forEach(([key, value]) => {
            html += `
                <div style="margin-bottom: 10px; padding: 8px; background: #1a2a3a; border-radius: 4px;">
                    <div style="color: #aaa; font-size: 11px;">${key}</div>
                    <div style="color: white; font-size: 14px;">${value}</div>
                </div>
            `;
        });
        
        this.content.innerHTML = html || '<div style="color: #aaa;">لا توجد خصائص</div>';
    }
}
