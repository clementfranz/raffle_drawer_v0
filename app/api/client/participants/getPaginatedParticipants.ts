import api from "../axios";

interface Participant {
  id: number | string;
  [key: string]: any; // allow other keys too
}

export const getPaginatedParticipants = async (
  page = 1,
  size = 10
): Promise<{ data: Participant[] }> => {
  try {
    const response = await api.get(`/participants/page/${page}/size/${size}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching participants list:", error);
    throw error;
  }
};
