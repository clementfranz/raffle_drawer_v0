import axios from "axios";

const api = axios.create({
  baseURL: "http://raffle-draw-api.test/api", // your Laravel API base URL
  headers: {
    "Content-Type": "application/json"
    // Add Authorization if needed
  }
});

export default api;
