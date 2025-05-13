import type { IDBPDatabase } from "idb";

export function migrateSyncCloud(db: IDBPDatabase<any>) {
  if (!db.objectStoreNames.contains("syncCloud")) {
    const store = db.createObjectStore("syncCloud", {
      keyPath: "id",
      autoIncrement: true
    });

    // 🟢 You can index based on status
    store.createIndex("status", "status", { unique: false });
    store.createIndex("action", "action", { unique: false });
    store.createIndex("createdAt", "createdAt", { unique: false });

    console.log("syncCloud store created ✅");
  }
}
