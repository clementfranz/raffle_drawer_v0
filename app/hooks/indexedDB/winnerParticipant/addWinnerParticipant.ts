import { initDB } from "../_main/useIndexedDB";
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
      winner_type: winnerType,
      is_drawn: true,
      draw_date: new Date().toISOString(),
      ...winnerModel,
      ...filteredParticipantData
    };

    // Add the winner data to the winnerParticipant store
    await store.add(winnerEntry);

    console.log(
      `Winner participant added: ${participantData.full_name} with type ${winnerType}`
    );
    return true;
  } catch (error) {
    console.error("Error adding winner participant:", error);
    return false;
  }
}
