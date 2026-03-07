// =======================================
// ACTUAL CONSTRUCTION OS - STORAGE MANAGER
// =======================================

export class StorageManager {
    constructor() {
        this.db = null;
        this.cache = new Map();
        this.initDB();
    }

    async initDB() {
        return new Promise((resolve) => {
            const request = indexedDB.open('ConstructionOS', 1);
            
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('scenes')) {
                    db.createObjectStore('scenes', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('tiles')) {
                    db.createObjectStore('tiles', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('entities')) {
                    db.createObjectStore('entities', { keyPath: 'id' });
                }
            };
            
            request.onsuccess = (e) => {
                this.db = e.target.result;
                console.log('✅ IndexedDB initialized');
                resolve();
            };
        });
    }

    async save(key, data) {
        // تخزين في الكاش أولاً
        this.cache.set(key, data);
        
        // تخزين في IndexedDB إذا كان متاحاً
        if (this.db) {
            return new Promise((resolve) => {
                const tx = this.db.transaction([key.split('_')[0]], 'readwrite');
                const store = tx.objectStore(key.split('_')[0]);
                store.put({ id: key, data: data });
                resolve();
            });
        }
    }

    async load(key) {
        // البحث في الكاش أولاً
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        
        // البحث في IndexedDB
        if (this.db) {
            return new Promise((resolve) => {
                const tx = this.db.transaction([key.split('_')[0]], 'readonly');
                const store = tx.objectStore(key.split('_')[0]);
                const request = store.get(key);
                
                request.onsuccess = () => {
                    if (request.result) {
                        this.cache.set(key, request.result.data);
                        resolve(request.result.data);
                    } else {
                        resolve(null);
                    }
                };
            });
        }
        
        return null;
    }
}
