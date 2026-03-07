// ui/Toolbar.js

export class Toolbar {
    constructor(app) {
        this.app = app;
        this.createToolbar();
    }
    
    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'main-toolbar';
        toolbar.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(20, 30, 40, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid #4a6c8f;
            border-radius: 50px;
            padding: 8px 16px;
            display: flex;
            gap: 8px;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        const buttons = [
            { icon: '🏠', tooltip: 'الرئيسية', action: 'home' },
            { icon: '📐', tooltip: 'رسم', action: 'draw' },
            { icon: '📏', tooltip: 'قياس', action: 'measure' },
            { icon: '🧱', tooltip: 'مواد', action: 'materials' },
            { icon: '📊', tooltip: 'جدول الكميات', action: 'boq' },
            { icon: '⚙️', tooltip: 'إعدادات', action: 'settings' }
        ];
        
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.innerHTML = btn.icon;
            button.title = btn.tooltip;
            button.style.cssText = `
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            button.onmouseover = () => {
                button.style.background = 'rgba(74, 108, 143, 0.5)';
            };
            
            button.onmouseout = () => {
                button.style.background = 'none';
            };
            
            button.onclick = () => this.handleAction(btn.action);
            
            toolbar.appendChild(button);
        });
        
        document.body.appendChild(toolbar);
        this.toolbar = toolbar;
    }
    
    handleAction(action) {
        switch(action) {
            case 'home':
                this.app.camera.position.set(30, 20, 30);
                this.app.controls.target.set(0, 5, 0);
                break;
                
            case 'draw':
                alert('وضع الرسم - قيد التطوير');
                break;
                
            case 'measure':
                alert('وضع القياس - قيد التطوير');
                break;
                
            case 'materials':
                this.app.dashboard.showMaterialCategory('all');
                break;
                
            case 'boq':
                this.app.showBOQ();
                break;
                
            case 'settings':
                this.app.dashboard.show();
                break;
        }
    }
}
