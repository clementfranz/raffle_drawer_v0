import type { SyncCloudItem } from "~/api/types/syncCloudItem";
import { initDB } from "../_main/useIndexedDB";

export async function getSyncQueueItemById(
  id: number
): Promise<SyncCloudItem | null> {
  const db = await initDB();
  const tx = db.transaction("syncCloud", "readonly");
  const store = tx.objectStore("syncCloud");

  const item = await store.get(id);
  if (item && typeof item.id === "number") {
    return item as SyncCloudItem;
  }
  return null;
}
