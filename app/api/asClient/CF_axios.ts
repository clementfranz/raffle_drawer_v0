import axios from "axios";

const CF_api = axios.create({
  baseURL: import.meta.env.VITE_CF_API_URL_DATA,
  headers: {
    "Content-Type": "application/json"
    // Add Authorization if needed
  }
});

export default CF_api;
