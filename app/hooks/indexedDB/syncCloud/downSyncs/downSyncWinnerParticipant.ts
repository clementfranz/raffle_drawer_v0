import { create } from "../../_main/useIndexedDB";

export async function downSyncWinnerParticipant(
  raffleCode: string
): Promise<boolean> {
  const queueEntry = {
    api_url: `/winner-participants/raffle-code/${raffleCode}`,
    source: "cloud-server", // switched
    destination: "client-app", // switched
    type: "sync-down-winner",
    payload: null,
    method_type: "GET" as const,
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
    console.log("⬇️ Winner participant down-sync queued:", queueEntry);
    return true;
  } catch (err) {
    console.error("❌ Failed to queue down-sync for winner participant:", err);
    return false;
  }
}
