import type { IDBPDatabase } from "idb";

export function migrateParticipant(db: IDBPDatabase<any>) {
  if (!db.objectStoreNames.contains("participant")) {
    const store = db.createObjectStore("participant", {
      keyPath: "id",
      autoIncrement: true
    });

    store.createIndex("is_drawn", "is_drawn", { unique: false });
    store.createIndex("is_archived", "is_archived", { unique: false });
    store.createIndex("id_entry", "id_entry", { unique: false });
    store.createIndex("raffle_code", "raffle_code", { unique: false });
    store.createIndex("regional_location", "regional_location", {
      unique: false
    });
    store.createIndex("participant_batch_id", "participant_batch_id", {
      unique: false
    });
    store.createIndex("region_drawn", ["regional_location", "is_drawn"], {
      unique: false
    });
    store.createIndex("entry_drawn", ["id_entry", "is_drawn"], {
      unique: false
    });

    console.log("participant store created ✅");
  }
}
