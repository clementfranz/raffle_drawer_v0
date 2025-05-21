import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // your Laravel API base URL
  headers: {
    "Content-Type": "application/json"
    // Add Authorization if needed
  }
});

export default api;
