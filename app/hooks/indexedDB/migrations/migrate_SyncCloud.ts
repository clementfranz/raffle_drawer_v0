import type { IDBPDatabase } from "idb";

export function migrateSyncCloud(db: IDBPDatabase<any>) {
  if (!db.objectStoreNames.contains("syncCloud")) {
    const store = db.createObjectStore("syncCloud", {
      keyPath: "id",
      autoIncrement: true
    });

    store.createIndex("action", "action", { unique: false });
    store.createIndex("createdAt", "createdAt", { unique: false });

    console.log("syncCloud store created ✅");
  }
}
