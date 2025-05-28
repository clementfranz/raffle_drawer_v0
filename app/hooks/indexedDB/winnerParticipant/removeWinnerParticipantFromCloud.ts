import { initDB } from "../_main/useIndexedDB";
import { updateSyncQueueItemById } from "../syncCloud/updateSyncQueueItemById";

export async function removeWinnerParticipantFromCloud(
  queueId: string,
  raffle_code: string
): Promise<boolean> {
  if (!raffle_code || typeof raffle_code !== "string") {
    console.warn(`🚫 Invalid raffle_code provided:`, raffle_code);
    await updateSyncQueueItemById(Number(queueId), {
      status: "failed",
      response_body: null,
      error_message: "Invalid raffle_code provided"
    });
    return false;
  }

  const db = await initDB();

  try {
    const tx = db.transaction("winnerParticipant", "readwrite");
    const store = tx.objectStore("winnerParticipant");

    const index = store.index("raffle_code");

    const key = await index.getKey(raffle_code);

    if (!key) {
      console.warn(
        `⚠️ No winner participant found with raffle_code: ${raffle_code}`
      );
      await updateSyncQueueItemById(Number(queueId), {
        status: "completed",
        response_body: "No participant found with given raffle_code.",
        error_message: null
      });
      return true;
    }

    const existingParticipant = await store.get(key);

    if (
      !existingParticipant ||
      existingParticipant.raffle_code !== raffle_code
    ) {
      console.warn(
        `⚠️ Mismatch or invalid participant for raffle_code: ${raffle_code}`
      );
      await updateSyncQueueItemById(Number(queueId), {
        status: "failed",
        response_body: null,
        error_message: `Participant mismatch for raffle_code: ${raffle_code}`
      });
      return false;
    }

    await store.delete(key);
    await tx.done;

    console.log(`✅ Winner participant removed: raffle_code=${raffle_code}`);

    await updateSyncQueueItemById(Number(queueId), {
      status: "completed",
      response_body: "success",
      error_message: null
    });

    return true;
  } catch (error) {
    console.error("❌ Error removing winner participant from cloud:", error);
    await updateSyncQueueItemById(Number(queueId), {
      status: "failed",
      response_body: null,
      error_message: String(error)
    });
    return false;
  }
}
