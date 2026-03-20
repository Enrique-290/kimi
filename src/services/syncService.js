/**
 * Servicio de sincronización
 * Preparado para futura integración con backend
 * Actualmente opera en modo local (localStorage)
 */

const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutos

class SyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.listeners = [];

    // Escuchar cambios de conexión
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners('online');
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners('offline');
    });

    // Sincronización periódica
    setInterval(() => {
      if (this.isOnline) {
        this.sync();
      }
    }, SYNC_INTERVAL);
  }

  /**
   * Agrega un listener para eventos de sincronización
   * @param {Function} callback 
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Notifica a todos los listeners
   * @param {string} event 
   * @param {any} data 
   */
  notifyListeners(event, data = null) {
    this.listeners.forEach(callback => callback(event, data));
  }

  /**
   * Verifica si hay conexión
   * @returns {boolean}
   */
  checkConnection() {
    return this.isOnline;
  }

  /**
   * Agrega operación a la cola de sincronización
   * @param {string} operation - 'create', 'update', 'delete'
   * @param {string} entity - 'producto', 'venta', etc.
   * @param {Object} data 
   */
  queueOperation(operation, entity, data) {
    const syncItem = {
      id: crypto.randomUUID(),
      operation,
      entity,
      data,
      timestamp: new Date().toISOString(),
      attempts: 0
    };

    this.syncQueue.push(syncItem);
    this.saveQueue();

    if (this.isOnline) {
      this.processSyncQueue();
    }
  }

  /**
   * Guarda la cola en localStorage
   */
  saveQueue() {
    localStorage.setItem('tpv-sync-queue', JSON.stringify(this.syncQueue));
  }

  /**
   * Carga la cola desde localStorage
   */
  loadQueue() {
    const saved = localStorage.getItem('tpv-sync-queue');
    if (saved) {
      this.syncQueue = JSON.parse(saved);
    }
  }

  /**
   * Procesa la cola de sincronización
   * Preparado para integración con API
   */
  async processSyncQueue() {
    if (!this.isOnline || this.syncQueue.length === 0) return;

    const pending = this.syncQueue.filter(item => item.attempts < 3);

    for (const item of pending) {
      try {
        // Aquí iría la llamada real al API
        // await api.sync(item);

        console.log(`Sincronizando: ${item.operation} ${item.entity}`, item.data);

        // Marcar como sincronizado (simulado)
        item.synced = true;
        this.notifyListeners('synced', item);
      } catch (error) {
        item.attempts++;
        console.error(`Error sincronizando ${item.id}:`, error);
        this.notifyListeners('sync-error', { item, error });
      }
    }

    // Limpiar items sincronizados
    this.syncQueue = this.syncQueue.filter(item => !item.synced);
    this.saveQueue();
  }

  /**
   * Fuerza sincronización manual
   */
  async sync() {
    this.notifyListeners('sync-start');
    await this.processSyncQueue();
    this.notifyListeners('sync-complete');
  }

  /**
   * Exporta todos los datos para backup
   * @returns {Object}
   */
  exportAllData() {
    const data = {
      productos: JSON.parse(localStorage.getItem('tpv-productos') || '{}'),
      ventas: JSON.parse(localStorage.getItem('tpv-ventas') || '{}'),
      clientes: JSON.parse(localStorage.getItem('tpv-clientes') || '{}'),
      gastos: JSON.parse(localStorage.getItem('tpv-gastos') || '{}'),
      config: JSON.parse(localStorage.getItem('tpv-config') || '{}'),
      exportDate: new Date().toISOString()
    };
    return data;
  }

  /**
   * Importa datos desde backup
   * @param {Object} data 
   */
  importAllData(data) {
    if (data.productos) localStorage.setItem('tpv-productos', JSON.stringify(data.productos));
    if (data.ventas) localStorage.setItem('tpv-ventas', JSON.stringify(data.ventas));
    if (data.clientes) localStorage.setItem('tpv-clientes', JSON.stringify(data.clientes));
    if (data.gastos) localStorage.setItem('tpv-gastos', JSON.stringify(data.gastos));
    if (data.config) localStorage.setItem('tpv-config', JSON.stringify(data.config));

    this.notifyListeners('import-complete');
  }

  /**
   * Limpia todos los datos (reset)
   */
  clearAllData() {
    const keys = [
      'tpv-productos',
      'tpv-ventas',
      'tpv-clientes',
      'tpv-gastos',
      'tpv-config',
      'tpv-sync-queue'
    ];

    keys.forEach(key => localStorage.removeItem(key));
    this.syncQueue = [];
    this.notifyListeners('data-cleared');
  }
}

export const syncService = new SyncService();
export default syncService;
