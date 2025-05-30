import type { SyncCloudItem } from "~/api/types/syncCloudItem";
import { initDB } from "../../_main/useIndexedDB";

export async function getQueuedRemovalSyncRaffleCodes(): Promise<string[]> {
  try {
    const db = await initDB();
    const tx = db.transaction("syncCloud", "readonly");
    const store = tx.objectStore("syncCloud");
    const index = store.index("type_createdAt");

    const raffleCodes: string[] = [];

    // Function to process one type
    async function collectRaffleCodes(syncType: string) {
      const range = IDBKeyRange.bound([syncType, ""], [syncType, "\uffff"]);

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
    }

    await collectRaffleCodes("sync-removal-winner");
    await collectRaffleCodes("sync-remove-winner");

    return raffleCodes;
  } catch (error) {
    console.error("❌ Failed to get queued sync raffle codes:", error);
    return [];
  }
}
