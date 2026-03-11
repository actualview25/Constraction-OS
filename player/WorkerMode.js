// =======================================
// ACTUAL VIEW CONSTRUCTION OS - WORKER MODE
// =======================================

export class WorkerMode {
    constructor(app) {
        this.app = app;
        this.active = false;
        this.workerId = `worker-${Date.now()}`;
        this.permissions = {
            canEdit: false,
            canView: true,
            canMeasure: true,
            canReport: false
        };
        this.currentTask = null;
        this.taskHistory = [];
        console.log('✅ WorkerMode initialized');
    }

    // تفعيل وضع العامل
    activate() {
        this.active = true;
        this.app.updateStatus('👷 Worker mode activated', 'info');
        this.app.setViewMode('construction');
        this.emitEvent('activated');
        return true;
    }

    // إلغاء تفعيل وضع العامل
    deactivate() {
        this.active = false;
        this.app.updateStatus('👷 Worker mode deactivated', 'info');
        this.emitEvent('deactivated');
        return true;
    }

    // تعيين مهمة للعامل
    assignTask(task) {
        if (!this.active) {
            console.warn('⚠️ Worker mode not active');
            return false;
        }

        this.currentTask = {
            id: `task-${Date.now()}`,
            ...task,
            assignedAt: new Date().toISOString(),
            status: 'assigned',
            progress: 0
        };

        this.taskHistory.push(this.currentTask);
        this.app.updateStatus(`📋 Task assigned: ${task.name}`, 'success');
        this.emitEvent('taskAssigned', this.currentTask);
        
        return this.currentTask.id;
    }

    // بدء المهمة
    startTask(taskId) {
        if (!this.currentTask || this.currentTask.id !== taskId) {
            console.error('❌ Task not found');
            return false;
        }

        this.currentTask.status = 'in_progress';
        this.currentTask.startedAt = new Date().toISOString();
        this.app.updateStatus(`▶️ Task started: ${this.currentTask.name}`, 'info');
        this.emitEvent('taskStarted', this.currentTask);
        
        return true;
    }

    // تحديث تقدم المهمة
    updateProgress(progress) {
        if (!this.currentTask || this.currentTask.status !== 'in_progress') {
            return false;
        }

        this.currentTask.progress = Math.min(100, Math.max(0, progress));
        this.currentTask.lastUpdate = new Date().toISOString();
        
        if (this.currentTask.progress >= 100) {
            this.completeTask();
        }

        this.emitEvent('progressUpdated', {
            taskId: this.currentTask.id,
            progress: this.currentTask.progress
        });

        return true;
    }

    // إكمال المهمة
    completeTask() {
        if (!this.currentTask) return false;

        this.currentTask.status = 'completed';
        this.currentTask.completedAt = new Date().toISOString();
        this.currentTask.progress = 100;
        
        this.app.updateStatus(`✅ Task completed: ${this.currentTask.name}`, 'success');
        this.emitEvent('taskCompleted', this.currentTask);
        
        this.currentTask = null;
        return true;
    }

    // إلغاء المهمة
    cancelTask(reason = '') {
        if (!this.currentTask) return false;

        this.currentTask.status = 'cancelled';
        this.currentTask.cancelledAt = new Date().toISOString();
        this.currentTask.cancelReason = reason;
        
        this.app.updateStatus(`⛔ Task cancelled: ${reason}`, 'warning');
        this.emitEvent('taskCancelled', this.currentTask);
        
        this.currentTask = null;
        return true;
    }

    // أخذ قياسات
    takeMeasurement() {
        if (!this.active || !this.permissions.canMeasure) {
            console.warn('⚠️ No permission to measure');
            return null;
        }

        this.app.engine.distanceTool.activate();
        return true;
    }

    // الإبلاغ عن مشكلة
    reportIssue(issue) {
        if (!this.active) return false;

        const report = {
            id: `issue-${Date.now()}`,
            workerId: this.workerId,
            timestamp: new Date().toISOString(),
            ...issue,
            status: 'reported'
        };

        console.log('📝 Issue reported:', report);
        this.app.updateStatus('📝 Issue reported to supervisor', 'info');
        this.emitEvent('issueReported', report);
        
        return report.id;
    }

    // عرض المهمة الحالية
    getCurrentTask() {
        return this.currentTask;
    }

    // عرض تاريخ المهام
    getTaskHistory() {
        return this.taskHistory;
    }

    // عرض الإحصائيات
    getStats() {
        const completed = this.taskHistory.filter(t => t.status === 'completed').length;
        const cancelled = this.taskHistory.filter(t => t.status === 'cancelled').length;
        const inProgress = this.taskHistory.filter(t => t.status === 'in_progress').length;

        return {
            active: this.active,
            workerId: this.workerId,
            currentTask: this.currentTask ? this.currentTask.name : null,
            totalTasks: this.taskHistory.length,
            completed,
            cancelled,
            inProgress,
            permissions: this.permissions
        };
    }

    // إرسال حدث
    emitEvent(eventName, data = {}) {
        const event = new CustomEvent(`worker:${eventName}`, {
            detail: {
                workerId: this.workerId,
                timestamp: new Date().toISOString(),
                ...data
            }
        });
        window.dispatchEvent(event);
    }
}
