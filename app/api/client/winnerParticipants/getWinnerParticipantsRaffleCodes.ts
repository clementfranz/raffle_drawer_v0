import api from "../axios";

export const getWinnerParticipantsRaffleCodes = async (): Promise<string[]> => {
  try {
    const response = await api.get("/winner-participants/all/raffle-codes");
    return response.data; // because it's a plain array
  } catch (error) {
    console.error("Error fetching winner participant raffle codes:", error);
    throw error;
  }
};
