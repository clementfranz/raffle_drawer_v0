import type { IDBPDatabase } from "idb";

export function migrateWinnerParticipant(db: IDBPDatabase<any>) {
  if (!db.objectStoreNames.contains("winnerParticipant")) {
    const store = db.createObjectStore("winnerParticipant", {
      keyPath: "id",
      autoIncrement: true
    });

    store.createIndex("raffle_code", "raffle_code", { unique: false });
    store.createIndex("id_entry", "id_entry", { unique: false });
    store.createIndex("is_proclaimed", "is_proclaimed", { unique: false });
    store.createIndex("won_at", "won_at", { unique: false });

    store.createIndex("winner_type", "winner_type", { unique: false });

    store.createIndex("participant_id", "participant_id", { unique: false });
    store.createIndex("participant_batch_id", "participant_batch_id", {
      unique: false
    });

    console.log("winnerParticipant store created ✅");
  }
}
