import { initDB } from "../_main/useIndexedDB";
import { upSyncWinnerParticipant } from "../syncCloud/upSyncs/upSyncWinnerParticipant";
import * as Types from "../types";

// Define a model for the winner entry, which will fill in empty keys.
const winnerModel = {
  winner_status: false
};

export async function addWinnerParticipant(
  participantData: Types.ParticipantTypes.Participant,
  winnerType: "primary" | "backup"
): Promise<boolean> {
  const db = await initDB();

  try {
    const store = db
      .transaction("winnerParticipant", "readwrite")
      .objectStore("winnerParticipant");

    // Fill in missing keys from the model and the input data
    const { is_drawn, ...filteredParticipantData } = participantData;
    const winnerEntry = {
      is_drawn: true,
      draw_date: new Date().toISOString(),
      ...winnerModel,
      ...filteredParticipantData,
      winner_type: winnerType
    };

    // Add the winner data to the winnerParticipant store
    await store.add(winnerEntry);

    const addToSyncQueue = await upSyncWinnerParticipant(winnerEntry);

    if (addToSyncQueue) {
      console.log("Winner participant added to cloud sync queue...");
    }

    console.log(
      `Winner participant added: ${participantData.full_name} with type ${winnerType}`
    );
    return true;
  } catch (error) {
    console.error("Error adding winner participant:", error);
    return false;
  }
}
