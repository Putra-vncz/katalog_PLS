// ============================================
// E-KATALOG PLS UNPATTI — Storage Layer
// ============================================

const STORAGE_KEY = 'ekatalog_pls_unpatti';

const Storage = {
  /** Get all data or a specific key */
  get(key) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : null;
      if (!data) return key ? (DEFAULT_DATA[key] ?? null) : DEFAULT_DATA;
      return key ? (data[key] ?? DEFAULT_DATA[key] ?? null) : data;
    } catch {
      return key ? (DEFAULT_DATA[key] ?? null) : DEFAULT_DATA;
    }
  },

  /** Set a specific key */
  set(key, value) {
    try {
      const data = this.get();
      data[key] = value;
      data.settings = data.settings || {};
      data.settings.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Storage.set error:', e);
      return false;
    }
  },

  /** Initialize with defaults if empty, or patch old dummy data */
  init() {
    const current = localStorage.getItem(STORAGE_KEY);
    if (!current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
    } else {
      // Force patch if user still has the old dummy Kaprodi name cached
      try {
        const data = JSON.parse(current);
        if (data.kataPengantar && data.kataPengantar.authorName === 'Dr. [Nama Kaprodi]') {
          data.kataPengantar.authorName = 'Dr. Lamberthus J. Lokollo, M.Pd';
          data.kataPengantar.authorImage = 'assets/images/kaprodi.jpg';
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
      } catch (e) {}
    }
  },

  /** Export all data as JSON string */
  export() {
    return JSON.stringify(this.get(), null, 2);
  },

  /** Import data from JSON string */
  import(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  /** Reset to defaults */
  reset() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
  },

  /** Add activity log entry */
  addLog(action) {
    const data = this.get();
    if (!data.activityLog) data.activityLog = [];
    data.activityLog.unshift({
      action,
      time: new Date().toISOString(),
    });
    // Keep last 50 entries
    data.activityLog = data.activityLog.slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  /** Download data as JSON file */
  downloadJSON() {
    const json = this.export();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ekatalog-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};

// Initialize on load
Storage.init();
