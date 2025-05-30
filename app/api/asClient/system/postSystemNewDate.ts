import api from "../axios"; // adjust the path if needed

export const postSystemNewDate = async () => {
  try {
    const response = await api.post("/system/register-date");
    return response.data;
  } catch (error) {
    console.error("Error registering new system date:", error);
    throw error;
  }
};
