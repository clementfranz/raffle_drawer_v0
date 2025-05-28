import api from "../axios"; // adjust path as needed

export const deleteAllDatabaseParticipants = async () => {
  try {
    const response = await api.delete("/participants/all");
    return response.data;
  } catch (error) {
    console.error("Error deleting all participants:", error);
    throw error;
  }
};
