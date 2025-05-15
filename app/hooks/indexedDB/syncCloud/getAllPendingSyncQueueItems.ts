import type { SyncCloudItem } from "~/api/types/syncCloudItem";
import { initDB } from "../_main/useIndexedDB";

export async function getAllPendingSyncQueueItems(): Promise<
  SyncCloudItem[] | null
> {
  try {
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

    const items: SyncCloudItem[] = [];

    for (const status of validStatuses) {
      const range = IDBKeyRange.bound([status, ""], [status, "\uffff"]);
      let cursor = await index.openCursor(range, "next");

      while (cursor) {
        items.push(cursor.value as SyncCloudItem);
        cursor = await cursor.continue();
      }
    }

    return items.length > 0 ? items : null;
  } catch (error) {
    console.error("Failed to fetch pending sync queue items:", error);
    return null;
  }
}
