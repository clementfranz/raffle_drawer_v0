import api from "../axios"; // adjust path as needed

export const getParticipantsTotalCount = async () => {
  try {
    const response = await api.get("/participants/count");
    return response.data;
  } catch (error) {
    console.error("Error fetching participants count:", error);
    throw error;
  }
};
