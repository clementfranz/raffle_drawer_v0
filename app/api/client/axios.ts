import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL_DATA,
  headers: {
    "Content-Type": "application/json"
    // Add Authorization if needed
  }
});

export default api;
