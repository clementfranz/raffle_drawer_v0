import { create } from "../../_main/useIndexedDB";

export async function downSyncWinnerParticipantRemoval(
  raffleCode: string
): Promise<boolean> {
  const queueEntry = {
    api_url: `/winner-participants/raffle-code/${raffleCode}`,
    source: "cloud-server", // flipped direction
    destination: "client-app", // internal cleanup
    type: "sync-removal-winner",
    payload: null,
    method_type: "DELETE" as const,
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
    response_body: raffleCode,
    duration: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    await create("syncCloud", queueEntry);
    console.log("🗑️ Winner participant removal down-sync queued:", queueEntry);
    return true;
  } catch (err) {
    console.error(
      "❌ Failed to queue removal down-sync for winner participant:",
      err
    );
    return false;
  }
}
