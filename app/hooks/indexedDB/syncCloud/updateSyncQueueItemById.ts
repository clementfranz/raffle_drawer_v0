import { initDB } from "../_main/useIndexedDB";

export async function updateSyncQueueItemById(
  id: number,
  updates: Partial<any> // You can type this better if you have a SyncQueue type
) {
  const db = await initDB();
  const tx = db.transaction("syncCloud", "readwrite");
  const store = tx.objectStore("syncCloud");

  const existing = await store.get(id);
  if (!existing) {
    throw new Error(`No syncCloud entry found with ID ${id}`);
  }

  const updatedItem = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  await store.put(updatedItem);
  await tx.done;
}
