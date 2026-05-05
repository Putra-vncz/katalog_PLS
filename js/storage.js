// ============================================
// E-KATALOG PLS UNPATTI — Storage Layer (Firebase)
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyAvJ3TC6QtbrPr0C0ETKHXtcn5vGdtkii4",
  authDomain: "database-for-katalog-pls.firebaseapp.com",
  databaseURL: "https://database-for-katalog-pls-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "database-for-katalog-pls",
  storageBucket: "database-for-katalog-pls.firebasestorage.app",
  messagingSenderId: "382032183723",
  appId: "1:382032183723:web:462a5ea5847dee2e4792ee",
  measurementId: "G-RRFE8SLTSM"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Local cache to keep synchronous get() working
window.__ekatalog_data = null;

const Storage = {
  /** Get all data or a specific key */
  get(key) {
    if (!window.__ekatalog_data) {
      return key ? (DEFAULT_DATA[key] ?? null) : DEFAULT_DATA;
    }
    const data = window.__ekatalog_data;
    if (!key) return data;
    return data[key] ?? DEFAULT_DATA[key] ?? null;
  },

  /** Set a specific key */
  set(key, value) {
    try {
      // Optimistic update
      if (!window.__ekatalog_data) {
        window.__ekatalog_data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      }
      window.__ekatalog_data[key] = value;
      window.__ekatalog_data.settings = window.__ekatalog_data.settings || {};
      window.__ekatalog_data.settings.lastUpdated = new Date().toISOString();
      
      // Sync to Firebase
      db.ref('ekatalog_data').set(window.__ekatalog_data);
      return true;
    } catch (e) {
      console.error('Storage.set error:', e);
      return false;
    }
  },

  /** Initialize Firebase Listener */
  init() {
    db.ref('ekatalog_data').on('value', (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        // First time initialization
        db.ref('ekatalog_data').set(DEFAULT_DATA);
        window.__ekatalog_data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      } else {
        window.__ekatalog_data = data;
      }
      // Notify the app that new data arrived
      window.dispatchEvent(new CustomEvent('ekatalog_data_updated'));
    });
  },

  /** Export all data as JSON string */
  export() {
    return JSON.stringify(this.get(), null, 2);
  },

  /** Import data from JSON string */
  import(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      db.ref('ekatalog_data').set(data);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  /** Reset to defaults */
  reset() {
    db.ref('ekatalog_data').set(DEFAULT_DATA);
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
    
    // Update locally and in Firebase
    window.__ekatalog_data = data;
    db.ref('ekatalog_data/activityLog').set(data.activityLog);
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
