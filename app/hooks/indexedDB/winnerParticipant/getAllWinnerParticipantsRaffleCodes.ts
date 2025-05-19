import { initDB } from "../_main/useIndexedDB";

export async function getAllWinnerParticipantsRaffleCodes(): Promise<string[]> {
  try {
    const db = await initDB();
    const store = db
      .transaction("winnerParticipant", "readonly")
      .objectStore("winnerParticipant");

    const allEntries = await store.getAll();

    return allEntries
      .map((entry) => entry?.raffle_code)
      .filter((code): code is string => typeof code === "string");
  } catch (error) {
    console.error(
      "❌ Failed to fetch raffle codes from winner participants:",
      error
    );
    return [];
  }
}
