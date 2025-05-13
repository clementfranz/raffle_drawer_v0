import api from "../axios"; // adjust path as needed

export const getParticipantById = async (id: number) => {
  try {
    const response = await api.get(`/participants/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching participant:", error);
    throw error;
  }
};
