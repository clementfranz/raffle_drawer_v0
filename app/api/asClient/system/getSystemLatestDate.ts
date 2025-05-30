import api from "../axios"; // adjust the path if needed

export const getSystemLatestDate = async () => {
  try {
    const response = await api.get("/system/latest-date");
    return response.data;
  } catch (error) {
    console.error("Error fetching latest system date:", error);
    throw error;
  }
};
