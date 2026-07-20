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

if (typeof window === "undefined") {
  api.interceptors.request.use(async (config) => {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    config.headers.Cookie = cookieStore.toString();
    return config;
  });
}

export default api;
