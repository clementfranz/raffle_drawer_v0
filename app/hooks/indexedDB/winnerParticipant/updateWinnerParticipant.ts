import { initDB } from "../_main/useIndexedDB";

export async function updateWinnerParticipant(
  raffle_code: string
): Promise<boolean> {
  const db = await initDB();

  try {
    const tx = db.transaction("participant", "readwrite");
    const store = tx.objectStore("participant");

    // Use index to find the matching participant by raffle_code
    const index = store.index("raffle_code");
    const participant = await index.get(raffle_code);

    if (participant) {
      participant.is_drawn = "true";
      await store.put(participant);
      console.log(
        `Participant with raffle_code ${raffle_code} marked as drawn.`
      );
    } else {
      console.warn(`No participant found with raffle_code ${raffle_code}`);
      return false;
    }

    await tx.done;
    return true;
  } catch (error) {
    console.error("Error updating winner participant:", error);
    return false;
  }
}
