import type { IDBPDatabase } from "idb";

export function migrateSyncCloud(db: IDBPDatabase<any>) {
  if (!db.objectStoreNames.contains("syncCloud")) {
    const store = db.createObjectStore("syncCloud", {
      keyPath: "id",
      autoIncrement: true
    });

    store.createIndex("status", "status", { unique: false });
    store.createIndex("createdAt", "createdAt", { unique: false });

    store.createIndex("status_createdAt", ["status", "createdAt"], {
      unique: false
    });

    console.log("syncCloud store created ✅");
  }
}
