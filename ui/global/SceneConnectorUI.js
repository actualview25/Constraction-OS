// =======================================
// ACTUAL VIEW CONSTRUCTION OS - SCENE CONNECTOR UI
// =======================================
// واجهة مستخدم لإدارة الروابط بين المشاهد

export class SceneConnectorUI {
    constructor(app) {
        this.app = app;
        this.panel = null;
        this.isVisible = false;
        this.selectedScene = null;
        this.links = [];
        console.log('✅ SceneConnectorUI initialized');
    }

    /**
     * إنشاء لوحة التحكم
     */
    createPanel() {
        if (this.panel) return;

        this.panel = document.createElement('div');
        this.panel.id = 'sceneConnectorPanel';
        this.panel.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 350px;
            max-height: 400px;
            background: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid #ffaa44;
            border-radius: 12px;
            color: white;
            z-index: 1000;
            display: none;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;

        this.panel.innerHTML = `
            <div style="padding: 15px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="color: #ffaa44; margin: 0;">🔗 Scene Connector</h3>
                <button id="closeConnectorPanel" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px;">&times;</button>
            </div>
            <div style="padding: 15px;">
                <div style="margin-bottom: 15px;">
                    <label style="color: #888; font-size: 12px;">From Scene:</label>
                    <select id="fromSceneSelect" style="width: 100%; padding: 8px; background: #2a2a2a; border: 1px solid #444; border-radius: 6px; color: white; margin-top: 5px;"></select>
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="color: #888; font-size: 12px;">To Scene:</label>
                    <select id="toSceneSelect" style="width: 100%; padding: 8px; background: #2a2a2a; border: 1px solid #444; border-radius: 6px; color: white; margin-top: 5px;"></select>
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="color: #888; font-size: 12px;">Connection Type:</label>
                    <select id="linkTypeSelect" style="width: 100%; padding: 8px; background: #2a2a2a; border: 1px solid #444; border-radius: 6px; color: white; margin-top: 5px;">
                        <option value="door">🚪 Door</option>
                        <option value="hallway">🚶 Hallway</option>
                        <option value="stairs">🪜 Stairs</option>
                        <option value="window">🪟 Window</option>
                        <option value="portal">🌀 Portal</option>
                    </select>
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="color: #888; font-size: 12px;">Connection Point (X, Z):</label>
                    <div style="display: flex; gap: 10px;">
                        <input type="number" id="linkX" placeholder="X" style="flex: 1; padding: 8px; background: #2a2a2a; border: 1px solid #444; border-radius: 6px; color: white;">
                        <input type="number" id="linkZ" placeholder="Z" style="flex: 1; padding: 8px; background: #2a2a2a; border: 1px solid #444; border-radius: 6px; color: white;">
                    </div>
                </div>
                <button id="createLinkBtn" style="width: 100%; padding: 10px; background: #ffaa44; color: #1a1a1a; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; margin-bottom: 15px;">
                    ➕ Create Link
                </button>
                <div style="border-top: 1px solid #333; padding-top: 15px;">
                    <h4 style="color: #ffaa44; margin: 0 0 10px 0;">📋 Existing Links</h4>
                    <div id="linksList" style="max-height: 200px; overflow-y: auto;">
                        <div class="text-muted" style="text-align:center; padding:20px;">No links created</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.panel);

        // إضافة الأحداث
        document.getElementById('closeConnectorPanel').onclick = () => this.hide();
        document.getElementById('createLinkBtn').onclick = () => this.createLink();

        console.log('✅ SceneConnectorUI panel created');
    }

    /**
     * عرض اللوحة
     */
    show() {
        if (!this.panel) this.createPanel();
        this.refreshSceneLists();
        this.refreshLinksList();
        this.panel.style.display = 'flex';
        this.isVisible = true;
    }

    /**
     * إخفاء اللوحة
     */
    hide() {
        if (this.panel) {
            this.panel.style.display = 'none';
            this.isVisible = false;
        }
    }

    /**
     * تبديل حالة اللوحة
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * تحديث قوائم المشاهد
     */
    refreshSceneLists() {
        const fromSelect = document.getElementById('fromSceneSelect');
        const toSelect = document.getElementById('toSceneSelect');
        
        if (!fromSelect || !toSelect) return;

        // جمع المشاهد
        const scenes = [];
        if (this.app?.state?.scenes) {
            this.app.state.scenes.forEach((scene, id) => {
                scenes.push({ id, name: scene.name });
            });
        }

        // إضافة المشهد الحالي إذا لم يكن في القائمة
        if (this.app?.state?.currentScene && !scenes.find(s => s.id === this.app.state.currentScene)) {
            scenes.push({ id: this.app.state.currentScene, name: this.app.state.currentScene });
        }

        const options = scenes.map(s => `<option value="${s.id}">${s.name || s.id}</option>`).join('');
        
        fromSelect.innerHTML = '<option value="">Select source scene</option>' + options;
        toSelect.innerHTML = '<option value="">Select target scene</option>' + options;

        // تحديد المشهد الحالي كافتراضي للمصدر
        if (this.app?.state?.currentScene) {
            fromSelect.value = this.app.state.currentScene;
        }
    }

    /**
     * تحديث قائمة الروابط
     */
    refreshLinksList() {
        const linksList = document.getElementById('linksList');
        if (!linksList) return;

        // جمع الروابط من RealityBridge
        let links = [];
        if (this.app?.engine?.realityBridge?.anchors) {
            links = Array.from(this.app.engine.realityBridge.anchors.values());
        }
        
        // جمع الروابط من SceneConnector
        if (this.app?.engine?.sceneConnector?.links) {
            links = [...links, ...this.app.engine.sceneConnector.links];
        }

        if (links.length === 0) {
            linksList.innerHTML = '<div class="text-muted" style="text-align:center; padding:20px;">No links created</div>';
            return;
        }

        const getTypeIcon = (type) => {
            const icons = {
                'door': '🚪',
                'hallway': '🚶',
                'stairs': '🪜',
                'window': '🪟',
                'portal': '🌀'
            };
            return icons[type] || '🔗';
        };

        linksList.innerHTML = links.map(link => `
            <div style="background: #1a1a1a; border-radius: 6px; padding: 10px; margin-bottom: 8px; border-left: 3px solid #ffaa44;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div><strong>${getTypeIcon(link.type)} ${link.from || link.sourceSceneId} → ${link.to || link.targetSceneId}</strong></div>
                        <div style="font-size: 11px; color: #888;">Type: ${link.type}</div>
                        <div style="font-size: 11px; color: #888;">Point: (${(link.point?.x || link.position?.x || 0).toFixed(1)}, ${(link.point?.z || link.position?.z || 0).toFixed(1)})</div>
                    </div>
                    <button class="delete-link" data-id="${link.id}" style="background: none; border: none; color: #ff8888; cursor: pointer; font-size: 16px;">🗑️</button>
                </div>
            </div>
        `).join('');

        // إضافة أحداث الحذف
        document.querySelectorAll('.delete-link').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const linkId = btn.dataset.id;
                this.deleteLink(linkId);
            });
        });
    }

    /**
     * إنشاء رابط جديد
     */
    createLink() {
        const fromScene = document.getElementById('fromSceneSelect').value;
        const toScene = document.getElementById('toSceneSelect').value;
        const linkType = document.getElementById('linkTypeSelect').value;
        const x = parseFloat(document.getElementById('linkX').value);
        const z = parseFloat(document.getElementById('linkZ').value);

        if (!fromScene || !toScene) {
            alert('Please select source and target scenes');
            return;
        }

        if (fromScene === toScene) {
            alert('Source and target scenes cannot be the same');
            return;
        }

        if (isNaN(x) || isNaN(z)) {
            alert('Please enter valid connection coordinates');
            return;
        }

        const connectionPoint = { x, y: 0, z };

        // إنشاء الرابط عبر RealityBridge
        if (this.app?.engine?.realityBridge?.createLink) {
            const link = this.app.engine.realityBridge.createLink(fromScene, toScene, connectionPoint, linkType);
            if (link) {
                this.app.updateStatus(`✅ Link created: ${fromScene} → ${toScene} (${linkType})`, 'success');
                this.refreshLinksList();
                
                // مسح الحقول
                document.getElementById('linkX').value = '';
                document.getElementById('linkZ').value = '';
            } else {
                this.app.updateStatus('❌ Failed to create link', 'error');
            }
        } else {
            console.warn('⚠️ RealityBridge not available');
            this.app.updateStatus('⚠️ Link creation not available', 'warning');
        }
    }

    /**
     * حذف رابط
     */
    deleteLink(linkId) {
        if (this.app?.engine?.realityBridge?.removeLink) {
            const success = this.app.engine.realityBridge.removeLink(linkId);
            if (success) {
                this.app.updateStatus(`✅ Link deleted: ${linkId}`, 'success');
                this.refreshLinksList();
            } else {
                this.app.updateStatus('❌ Failed to delete link', 'error');
            }
        }
    }

    /**
     * الحصول على إحصائيات الروابط
     */
    getStats() {
        let links = [];
        if (this.app?.engine?.realityBridge?.anchors) {
            links = Array.from(this.app.engine.realityBridge.anchors.values());
        }
        
        const byType = {};
        links.forEach(link => {
            byType[link.type] = (byType[link.type] || 0) + 1;
        });

        return {
            totalLinks: links.length,
            byType: byType,
            scenes: {
                from: [...new Set(links.map(l => l.from || l.sourceSceneId))],
                to: [...new Set(links.map(l => l.to || l.targetSceneId))]
            }
        };
    }

    /**
     * تصدير الروابط
     */
    exportLinks() {
        const stats = this.getStats();
        const report = `🔗 Scene Links Report
══════════════════════════════
Total Links: ${stats.totalLinks}
Links by Type:
${Object.entries(stats.byType).map(([type, count]) => `  • ${type}: ${count}`).join('\n')}
══════════════════════════════
`;
        console.log(report);
        this.app.updateStatus('📋 Links report copied to console', 'info');
        return report;
    }

    /**
     * إعادة ضبط الروابط
     */
    resetLinks() {
        if (this.app?.engine?.realityBridge?.reset) {
            this.app.engine.realityBridge.reset();
            this.app.updateStatus('🔄 All links reset', 'success');
            this.refreshLinksList();
        }
    }
}
