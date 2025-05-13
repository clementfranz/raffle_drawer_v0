import { create } from "../_main/useIndexedDB";

export async function syncParticipantsToCloudPerBatch(
  dataBatch: any[],
  action: string,
  batchId: string,
  apiURL: string
): Promise<any[]> {
  const results: any[] = [];

  interface SyncQueueEntry {
    queueNth: string;
    payload: any[]; // entire batch as payload
    action: string;
    method: "POST" | "GET" | "DELETE" | "PUT" | "PATCH";
    isSynced: string;
    dateSynced: string | null;
    apiURL: string;
    batchId: string;
    handleResponse: string;
  }

  const queueEntry: SyncQueueEntry = {
    queueNth: Date.now().toString() + Math.floor(Math.random() * 1000), // collision-safe unique ID
    payload: dataBatch, // entire batch as payload
    action,
    method: "POST",
    isSynced: "false",
    dateSynced: null,
    apiURL,
    batchId,
    handleResponse: "update-sync-status"
  };

  try {
    const inserted = await create("syncCloud", queueEntry);
    results.push(inserted);
    console.log("✅ Batch successfully queued to syncCloud:", queueEntry);
  } catch (err) {
    console.error("❌ Batch insert to syncCloud failed:", err);
  }

  return results;
}
