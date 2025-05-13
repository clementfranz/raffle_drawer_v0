import api from "../axios";

export const getPaginatedParticipants = async (page = 1, size = 10) => {
  try {
    const response = await api.get(`/participants/page/${page}/size/${size}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching participants list:", error);
    throw error;
  }
};
