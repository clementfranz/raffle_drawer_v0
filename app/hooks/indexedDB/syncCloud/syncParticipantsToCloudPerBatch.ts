import { create } from "../_main/useIndexedDB";

export async function syncParticipantsToCloudPerBatch(
  dataBatch: any[],
  batchId: string,
  apiURL: string
): Promise<any[]> {
  const results: any[] = [];

  interface SyncQueueEntry {
    api_url: string;
    source: string;
    destination: string;
    type: string;
    payload: any;
    method_type: "POST" | "GET" | "DELETE" | "PUT" | "PATCH";
    status:
      | "pending"
      | "in-progress"
      | "completed"
      | "failed"
      | "retrying"
      | "cancelled";
    retry_count: number;
    error_message?: string | null;
    priority: "low" | "medium" | "high";
    reference_id?: string | null;
    content_type?: string | null;
    triggered_by?: string | null;
    is_test: boolean;
    next_retry_at?: string | Date | null;
    headers?: any;
    response_body?: any;
    duration?: number | null;
    createdAt: string | Date;
    updatedAt: string | Date;
  }

  const queueEntry: SyncQueueEntry = {
    api_url: apiURL,
    source: "client-app", // 🧩 your actual source
    destination: "cloud-server", // 🧩 your actual destination
    type: "sync-batch",
    payload: dataBatch,
    method_type: "POST",
    status: "pending",
    retry_count: 0,
    error_message: null,
    priority: "medium",
    reference_id: batchId,
    content_type: "application/json",
    triggered_by: "system", // or username
    is_test: false,
    next_retry_at: null,
    headers: {}, // or any custom headers
    response_body: null,
    duration: null,
    createdAt: new Date(),
    updatedAt: new Date()
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
