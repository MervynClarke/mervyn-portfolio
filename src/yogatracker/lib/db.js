"use client";
// Minimal IndexedDB wrapper — the local cache plus the offline write queue.
// Same shape as the Tea Tasting store so the two apps behave identically
// offline; only the DB name and the object stores differ.

const DB_NAME = "yogatracker";
const DB_VERSION = 1;

let dbPromise = null;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("sessions"))
        db.createObjectStore("sessions", { keyPath: "id" });
      if (!db.objectStoreNames.contains("queue"))
        db.createObjectStore("queue", { keyPath: "qid", autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx(store, mode, fn) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const t = db.transaction(store, mode);
        const s = t.objectStore(store);
        const out = fn(s);
        t.oncomplete = () => resolve(out?.result !== undefined ? out.result : undefined);
        t.onerror = () => reject(t.error);
      })
  );
}

export const idb = {
  getAll: (store) =>
    openDb().then(
      (db) =>
        new Promise((resolve, reject) => {
          const req = db.transaction(store).objectStore(store).getAll();
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        })
    ),
  get: (store, key) =>
    openDb().then(
      (db) =>
        new Promise((resolve, reject) => {
          const req = db.transaction(store).objectStore(store).get(key);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        })
    ),
  put: (store, value) => tx(store, "readwrite", (s) => s.put(value)),
  delete: (store, key) => tx(store, "readwrite", (s) => s.delete(key)),
  clear: (store) => tx(store, "readwrite", (s) => s.clear()),
};
