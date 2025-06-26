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
    rejectUnauthorized: process.env.NODE_ENV === "production", // Enable SSL verification in production
  })
});

export default api;
