import { initDB } from "../_main/useIndexedDB";

export async function removeWinnerParticipant(
  id_entry: string,
  raffle_code: string
): Promise<boolean> {
  const db = await initDB();

  try {
    const tx = db.transaction("winnerParticipant", "readwrite");
    const store = tx.objectStore("winnerParticipant");

    // Use the id_entry index to find the matching entry's key
    const key = await store.index("id_entry").getKey(id_entry);

    if (!key) {
      console.warn(`No winner participant found with id_entry: ${id_entry}`);
      return false;
    }

    // Get the full entry data to check if raffle_code matches
    const participant = await store.get(key);

    if (!participant || participant.raffle_code !== raffle_code) {
      console.warn(
        `Raffle code does not match or participant not found for id_entry: ${id_entry}`
      );
      return false;
    }

    // If raffle_code matches, delete the entry
    await store.delete(key);
    await tx.done;

    console.log(
      `Winner participant removed with id_entry: ${id_entry} and raffle_code: ${raffle_code}`
    );
    return true;
  } catch (error) {
    console.error("Error removing winner participant:", error);
    return false;
  }
}
