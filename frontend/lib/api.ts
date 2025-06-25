import axios from "axios";
import { API_URL } from "./config";
import https from "https";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // This is not recommended for production, but it clears errors so what gives
  })
});

export default api;
