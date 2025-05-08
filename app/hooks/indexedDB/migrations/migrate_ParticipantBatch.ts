import type { IDBPDatabase } from "idb";

export function migrateParticipantBatch(db: IDBPDatabase<any>) {
  if (!db.objectStoreNames.contains("participantBatch")) {
    const store = db.createObjectStore("participantBatch", {
      keyPath: "id",
      autoIncrement: true
    });

    store.createIndex("raffle_week_code", "raffle_week_code", {
      unique: false
    });
    store.createIndex("date_start", "date_start", { unique: false });
    store.createIndex("date_end", "date_end", { unique: false });
    store.createIndex("raffle_date_time_started", "raffle_date_time_started", {
      unique: false
    });
    store.createIndex("raffle_date_time_ended", "raffle_date_time_ended", {
      unique: false
    });
    store.createIndex("is_completed", "is_completed", { unique: false });
    store.createIndex("drawn_by_user_id", "drawn_by_user_id", {
      unique: false
    });

    console.log("participantBatch store created ✅");
  }
}
