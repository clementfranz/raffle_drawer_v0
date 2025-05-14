import { create } from "../../_main/useIndexedDB";

export async function upSyncWinnerParticipant(
  winnerData: any
): Promise<boolean> {
  const queueEntry = {
    api_url: "/winner-participants",
    source: "client-app",
    destination: "cloud-server",
    type: "sync-winner",
    payload: winnerData,
    method_type: "POST" as const,
    status: "pending" as const,
    retry_count: 0,
    error_message: null,
    priority: "medium" as const,
    reference_id: null,
    content_type: "application/json",
    triggered_by: "system",
    is_test: false,
    next_retry_at: null,
    headers: {},
    response_body: null,
    duration: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    await create("syncCloud", queueEntry);
    console.log("🏆 Winner participant synced to queue:", queueEntry);
    return true;
  } catch (err) {
    console.error("❌ Failed to queue winner participant:", err);
    return false;
  }
}
