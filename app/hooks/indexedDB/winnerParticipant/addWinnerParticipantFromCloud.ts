import { initDB } from "../_main/useIndexedDB";
import * as Types from "../types";

export async function addWinnerParticipantFromCloud(
  participantData: Types.WinnerParticipantTypes.WinnerParticipant
): Promise<boolean> {
  const db = await initDB();

  try {
    const store = db
      .transaction("winnerParticipant", "readwrite")
      .objectStore("winnerParticipant");

    // Modify the incoming data
    const { won_at, id_entry, ...rest } = participantData;
    const updatedData = {
      ...rest,
      draw_date: won_at,
      id_entry: String(id_entry)
    };

    await store.add(updatedData);

    console.log(
      `☁️ Synced winner participant from cloud: ${participantData.full_name}`
    );
    return true;
  } catch (error) {
    console.error("❌ Error syncing winner participant from cloud:", error);
    return false;
  }
}
