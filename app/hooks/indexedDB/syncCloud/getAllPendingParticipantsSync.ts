import type { SyncCloudItem } from "~/api/types/syncCloudItem";
import { initDB } from "../_main/useIndexedDB";

export async function getAllPendingParticipantsSync(): Promise<number> {
  try {
    const db = await initDB();
    const tx = db.transaction("syncCloud", "readonly");
    const store = tx.objectStore("syncCloud");
    const index = store.index("status_createdAt");

    const allStatuses: Array<SyncCloudItem["status"]> = [
      "pending",
      "in-progress",
      "failed",
      "retrying",
      "cancelled",
      "completed"
    ];

    const totalSyncBatches: number[] = [];
    const notCompletedBatches: number[] = [];

    for (const status of allStatuses) {
      const range = IDBKeyRange.bound([status, ""], [status, "\uffff"]);
      let cursor = await index.openCursor(range, "next");

      while (cursor) {
        const value = cursor.value as SyncCloudItem;

        if (value?.type === "sync-batch" && typeof value.id === "number") {
          totalSyncBatches.push(value.id);

          if (value.status !== "completed") {
            notCompletedBatches.push(value.id);
          }
        }

        cursor = await cursor.continue();
      }
    }

    if (totalSyncBatches.length === 0) {
      return 404;
    }

    return notCompletedBatches.length;
  } catch (error) {
    console.error("❌ Failed to fetch sync-batch data:", error);
    return 1;
  }
}
