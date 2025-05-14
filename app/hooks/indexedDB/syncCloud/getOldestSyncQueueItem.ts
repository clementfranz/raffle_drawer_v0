import type { SyncCloudItem } from "~/api/types/syncCloudItem";
import { initDB } from "../_main/useIndexedDB";

export async function getOldestSyncQueueItem(): Promise<SyncCloudItem | null> {
  const db = await initDB();
  const tx = db.transaction("syncCloud", "readonly");
  const store = tx.objectStore("syncCloud");
  const index = store.index("status_createdAt");

  const validStatuses: Array<SyncCloudItem["status"]> = [
    "pending",
    "in-progress",
    "failed",
    "retrying",
    "cancelled"
  ];

  let oldest: SyncCloudItem | null = null;
  let oldestDate = Infinity;

  for (const status of validStatuses) {
    const range = IDBKeyRange.bound([status, ""], [status, "\uffff"]);
    const cursor = await index.openCursor(range, "next");

    if (cursor) {
      const item = cursor.value as SyncCloudItem;
      const createdTime = new Date(item.createdAt).getTime();

      if (createdTime < oldestDate) {
        oldest = item;
        oldestDate = createdTime;
      }
    }
  }

  return oldest;
}
