import type { SyncCloudItem } from "~/api/types/syncCloudItem";
import { initDB } from "../_main/useIndexedDB";

export async function getAllSyncQueueItems(): Promise<SyncCloudItem[] | null> {
  try {
    const db = await initDB();
    const tx = db.transaction("syncCloud", "readonly");
    const store = tx.objectStore("syncCloud");

    const items = await store.getAll();
    return items.length > 0 ? (items as SyncCloudItem[]) : null;
  } catch (error) {
    console.error("Failed to fetch sync queue items:", error);
    return null;
  }
}
