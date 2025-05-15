import type { SyncCloudItem } from "~/api/types/syncCloudItem";
import { initDB } from "../_main/useIndexedDB";

export async function getAllPendingSyncQueueItems(
  returnTotal?: number,
  exceptions?: number[]
): Promise<Array<{ id: number }> | null> {
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

    const items: Array<{ id: number }> = [];

    for (const status of validStatuses) {
      const range = IDBKeyRange.bound([status, ""], [status, "\uffff"]);
      let cursor = await index.openCursor(range, "next");

      while (cursor) {
        const value = cursor.value as SyncCloudItem;

        // Skip if in exceptions
        if (value?.id && (!exceptions || !exceptions.includes(value.id))) {
          items.push({ id: value.id });
        }

        if (returnTotal && items.length >= returnTotal) {
          return items;
        }

        cursor = await cursor.continue();
      }

      if (returnTotal && items.length >= returnTotal) {
        return items;
      }
    }

    return items.length > 0 ? items : null;
  } catch (error) {
    console.error("Failed to fetch pending sync queue items:", error);
    return null;
  }
}
