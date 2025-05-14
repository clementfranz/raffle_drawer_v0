import { initDB } from "../_main/useIndexedDB";

export async function getOldestSyncQueueItem() {
  const db = await initDB();
  const tx = db.transaction("syncCloud", "readonly");
  const store = tx.objectStore("syncCloud");
  const index = store.index("createdAt");

  const cursor = await index.openCursor(null, "next"); // next = oldest first
  return cursor?.value || null;
}
