// =======================================
// ACTUAL VIEW CONSTRUCTION OS - MOBILE WORKER MODE
// =======================================

import { WorkerMode } from './WorkerMode.js';

export class MobileWorkerMode extends WorkerMode {
    constructor(app) {
        super(app);
        this.deviceId = `mobile-${Date.now()}`;
        this.batteryLevel = 100;
        this.networkStatus = 'online';
        this.location = null;
        this.permissions = {
            canEdit: false,
            canView: true,
            canMeasure: true,
            canReport: true,
            canCapture: true
        };
        console.log('✅ MobileWorkerMode initialized');
        
        // بدء مراقبة البطارية
        this.startBatteryMonitoring();
        
        // بدء مراقبة الموقع
        this.startLocationTracking();
    }

    // تفعيل وضع الجوال
    activate() {
        super.activate();
        this.app.updateStatus('📱 Mobile worker mode activated', 'info');
        this.showMobileControls();
        return true;
    }

    // إظهار عناصر تحكم الجوال
    showMobileControls() {
        // يمكن إضافتها لاحقاً
        console.log('📱 Mobile controls ready');
    }

    // التقاط صورة من الكاميرا
    async capturePhoto() {
        if (!this.permissions.canCapture) {
            console.warn('⚠️ No permission to capture');
            return null;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            // معالجة الصورة...
            console.log('📸 Photo captured');
            return true;
        } catch (error) {
            console.error('❌ Failed to capture photo:', error);
            return null;
        }
    }

    // مسح QR code
    async scanQR() {
        console.log('📱 Scanning QR code...');
        // يمكن إضافتها لاحقاً
        return { type: 'qr', data: 'sample-data' };
    }

    // مراقبة البطارية
    startBatteryMonitoring() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.updateBatteryLevel(battery.level * 100);
                
                battery.addEventListener('levelchange', () => {
                    this.updateBatteryLevel(battery.level * 100);
                });
            });
        }
    }

    // تحديث مستوى البطارية
    updateBatteryLevel(level) {
        this.batteryLevel = level;
        this.emitEvent('batteryChanged', { level });
        
        if (level < 20) {
            this.app.updateStatus('⚠️ Low battery', 'warning');
        }
    }

    // مراقبة الموقع
    startLocationTracking() {
        if ('geolocation' in navigator) {
            navigator.geolocation.watchPosition(
                (position) => {
                    this.location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: new Date().toISOString()
                    };
                    this.emitEvent('locationChanged', this.location);
                },
                (error) => {
                    console.warn('⚠️ Location error:', error);
                }
            );
        }
    }

    // تحديث حالة الشبكة
    updateNetworkStatus(status) {
        this.networkStatus = status;
        this.emitEvent('networkChanged', { status });
    }

    // إرسال تقرير مع الصور
    async sendReportWithPhotos(report, photos) {
        const fullReport = {
            ...report,
            deviceId: this.deviceId,
            location: this.location,
            photos: photos || [],
            batteryLevel: this.batteryLevel,
            timestamp: new Date().toISOString()
        };

        // حفظ للرفع لاحقاً إذا كان offline
        if (this.networkStatus === 'offline') {
            this.saveForLater(fullReport);
        } else {
            await this.uploadReport(fullReport);
        }

        return fullReport;
    }

    // حفظ تقرير للرفع لاحقاً
    saveForLater(report) {
        const saved = JSON.parse(localStorage.getItem('pendingReports') || '[]');
        saved.push(report);
        localStorage.setItem('pendingReports', JSON.stringify(saved));
        this.app.updateStatus('💾 Report saved for later', 'info');
    }

    // رفع التقارير المعلقة
    async uploadPendingReports() {
        const pending = JSON.parse(localStorage.getItem('pendingReports') || '[]');
        if (pending.length === 0) return;

        for (const report of pending) {
            await this.uploadReport(report);
        }

        localStorage.removeItem('pendingReports');
        this.app.updateStatus(`📤 Uploaded ${pending.length} pending reports`, 'success');
    }

    // رفع تقرير
    async uploadReport(report) {
        // محاكاة رفع
        console.log('📤 Uploading report:', report);
        return true;
    }

    // الحصول على معلومات الجهاز
    getDeviceInfo() {
        return {
            deviceId: this.deviceId,
            batteryLevel: this.batteryLevel,
            networkStatus: this.networkStatus,
            location: this.location,
            userAgent: navigator.userAgent,
            platform: navigator.platform
        };
    }

    // تفعيل وضع عدم الاتصال
    enableOfflineMode() {
        this.networkStatus = 'offline';
        this.app.updateStatus('📱 Offline mode enabled', 'info');
        this.emitEvent('offlineModeEnabled');
    }

    // تعطيل وضع عدم الاتصال
    disableOfflineMode() {
        this.networkStatus = 'online';
        this.app.updateStatus('📱 Online mode restored', 'success');
        this.uploadPendingReports();
        this.emitEvent('onlineModeRestored');
    }
}
