import { initDB } from "../_main/useIndexedDB";

/**
 * Retrieves the most recent 'draw_date' from the winnerParticipant store using index and reverse cursor.
 */
export async function getWinnerParticipantsLatestEntryDate(): Promise<Date | null> {
  try {
    const db = await initDB();
    const store = db
      .transaction("winnerParticipant", "readonly")
      .objectStore("winnerParticipant");

    const index = store.index("draw_date");
    const cursor = await index.openCursor(null, "prev"); // 'prev' for descending order

    if (cursor?.value?.draw_date) {
      const date = new Date(cursor.value.draw_date);
      return isNaN(date.getTime()) ? null : date;
    }

    return null;
  } catch (error) {
    console.error(
      "❌ Failed to fetch latest 'draw_date' from winner participants:",
      error
    );
    return null;
  }
}
