// =======================================
// ACTUAL VIEW CONSTRUCTION OS - FOREMAN MODE
// =======================================

import { WorkerMode } from './WorkerMode.js';

export class ForemanMode extends WorkerMode {
    constructor(app) {
        super(app);
        this.foremanId = `foreman-${Date.now()}`;
        this.workers = new Map();
        this.permissions = {
            canEdit: true,
            canView: true,
            canMeasure: true,
            canReport: true,
            canManageWorkers: true,
            canApprove: true
        };
        console.log('✅ ForemanMode initialized');
    }

    // إضافة عامل للفريق
    addWorker(workerId, workerData = {}) {
        if (this.workers.has(workerId)) {
            console.warn('⚠️ Worker already exists');
            return false;
        }

        const worker = {
            id: workerId,
            joinedAt: new Date().toISOString(),
            tasks: [],
            status: 'available',
            ...workerData
        };

        this.workers.set(workerId, worker);
        this.app.updateStatus(`👷 Worker ${workerId} added to team`, 'success');
        this.emitEvent('workerAdded', { workerId, worker });
        
        return worker;
    }

    // إزالة عامل من الفريق
    removeWorker(workerId) {
        if (!this.workers.has(workerId)) {
            console.warn('⚠️ Worker not found');
            return false;
        }

        const worker = this.workers.get(workerId);
        this.workers.delete(workerId);
        this.app.updateStatus(`👷 Worker ${workerId} removed from team`, 'info');
        this.emitEvent('workerRemoved', { workerId, worker });
        
        return true;
    }

    // تعيين مهمة لعامل
    assignTaskToWorker(workerId, task) {
        if (!this.workers.has(workerId)) {
            console.error('❌ Worker not found');
            return false;
        }

        const taskId = `task-${Date.now()}-${Math.random()}`;
        const fullTask = {
            id: taskId,
            assignedBy: this.foremanId,
            assignedAt: new Date().toISOString(),
            status: 'assigned',
            ...task
        };

        const worker = this.workers.get(workerId);
        worker.tasks.push(fullTask);
        worker.currentTask = taskId;
        worker.status = 'busy';

        this.app.updateStatus(`📋 Task assigned to ${workerId}: ${task.name}`, 'success');
        this.emitEvent('taskAssigned', { workerId, task: fullTask });
        
        return taskId;
    }

    // متابعة تقدم عامل
    getWorkerProgress(workerId) {
        const worker = this.workers.get(workerId);
        if (!worker || !worker.currentTask) return null;

        const task = worker.tasks.find(t => t.id === worker.currentTask);
        return task ? task.progress : 0;
    }

    // الموافقة على عمل
    approveWork(workId, notes = '') {
        const approval = {
            id: `approval-${Date.now()}`,
            workId,
            approvedBy: this.foremanId,
            approvedAt: new Date().toISOString(),
            notes,
            status: 'approved'
        };

        this.app.updateStatus(`✅ Work approved: ${workId}`, 'success');
        this.emitEvent('workApproved', approval);
        
        return approval;
    }

    // رفض عمل
    rejectWork(workId, reason) {
        const rejection = {
            id: `rejection-${Date.now()}`,
            workId,
            rejectedBy: this.foremanId,
            rejectedAt: new Date().toISOString(),
            reason,
            status: 'rejected'
        };

        this.app.updateStatus(`⛔ Work rejected: ${workId}`, 'warning');
        this.emitEvent('workRejected', rejection);
        
        return rejection;
    }

    // طلب تقرير من عامل
    requestReport(workerId, reportType = 'daily') {
        if (!this.workers.has(workerId)) {
            console.error('❌ Worker not found');
            return false;
        }

        const request = {
            id: `report-request-${Date.now()}`,
            workerId,
            requestedBy: this.foremanId,
            requestedAt: new Date().toISOString(),
            type: reportType,
            status: 'pending'
        };

        this.emitEvent('reportRequested', request);
        this.app.updateStatus(`📊 Report requested from ${workerId}`, 'info');
        
        return request;
    }

    // تلقي تقرير من عامل
    receiveReport(workerId, report) {
        const received = {
            id: `report-${Date.now()}`,
            workerId,
            receivedAt: new Date().toISOString(),
            receivedBy: this.foremanId,
            ...report
        };

        this.emitEvent('reportReceived', received);
        this.app.updateStatus(`📥 Report received from ${workerId}`, 'success');
        
        return received;
    }

    // عرض جميع العمال
    listWorkers() {
        return Array.from(this.workers.values());
    }

    // عرض العمال المتاحين
    getAvailableWorkers() {
        return Array.from(this.workers.values()).filter(w => w.status === 'available');
    }

    // عرض العمال المشغولين
    getBusyWorkers() {
        return Array.from(this.workers.values()).filter(w => w.status === 'busy');
    }

    // عرض إحصائيات الفريق
    getTeamStats() {
        const workers = Array.from(this.workers.values());
        const totalTasks = workers.reduce((sum, w) => sum + w.tasks.length, 0);
        const completedTasks = workers.reduce((sum, w) => 
            sum + w.tasks.filter(t => t.status === 'completed').length, 0
        );

        return {
            totalWorkers: workers.length,
            availableWorkers: this.getAvailableWorkers().length,
            busyWorkers: this.getBusyWorkers().length,
            totalTasks,
            completedTasks,
            pendingTasks: totalTasks - completedTasks,
            completionRate: totalTasks ? (completedTasks / totalTasks * 100).toFixed(1) : 0
        };
    }

    // إنشاء تقرير يومي
    generateDailyReport() {
        const stats = this.getTeamStats();
        const workersList = this.listWorkers().map(w => ({
            id: w.id,
            status: w.status,
            tasksCompleted: w.tasks.filter(t => t.status === 'completed').length,
            currentTask: w.currentTask
        }));

        const report = {
            id: `daily-report-${Date.now()}`,
            generatedBy: this.foremanId,
            generatedAt: new Date().toISOString(),
            stats,
            workers: workersList,
            issues: [] // يمكن إضافتها لاحقاً
        };

        this.emitEvent('dailyReportGenerated', report);
        return report;
    }
}
