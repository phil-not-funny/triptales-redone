import axios from "axios";
import { API_URL } from "./config";
import https from "https";

const TOKEN_KEY = "token";
// Keep in sync with Jwt:ExpiresInHours in the backend appsettings.json.
const TOKEN_MAX_AGE = 3 * 60 * 60;

// The token is kept in a cookie (not localStorage) so that server components
// can read it and authenticate their own API calls - otherwise everything that
// is server-rendered (userLiked, userFollowing, ...) comes back anonymous.
export const getToken = (): string | null => {
  if (typeof document === "undefined") return null;
  const entry = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(TOKEN_KEY + "="));
  return entry ? decodeURIComponent(entry.slice(TOKEN_KEY.length + 1)) : null;
};

export const setToken = (token: string): void => {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_MAX_AGE}; SameSite=Lax${secure}`;
};

export const clearToken = (): void => {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: process.env.NODE_ENV === "production", // Enable SSL verification in production
  })
});

if (typeof window === "undefined") {
  api.interceptors.request.use(async (config) => {
    try {
      const { cookies } = await import("next/headers");
      const token = (await cookies()).get(TOKEN_KEY)?.value;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // Outside of a request scope there is no cookie store - stay anonymous.
    }
    return config;
  });
} else {
  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}

export default api;
