import type { SyncCloudItem } from "~/api/types/syncCloudItem";
import { initDB } from "../../_main/useIndexedDB";

export async function getQueuedDownSyncRaffleCodes(): Promise<string[]> {
  try {
    const db = await initDB();
    const tx = db.transaction("syncCloud", "readonly");
    const store = tx.objectStore("syncCloud");
    const index = store.index("type_createdAt");

    const range = IDBKeyRange.bound(
      ["sync-down-winner", ""],
      ["sync-down-winner", "\uffff"]
    );

    const raffleCodes: string[] = [];

    let cursor = await index.openCursor(range, "next");

    while (cursor) {
      const item = cursor.value as SyncCloudItem;

      const match = item.api_url.match(
        /\/winner-participants\/raffle-code\/([^/]+)$/
      );
      if (match) {
        raffleCodes.push(match[1]);
      }

      cursor = await cursor.continue();
    }

    return raffleCodes;
  } catch (error) {
    console.error("❌ Failed to get queued down-sync raffle codes:", error);
    return [];
  }
}
