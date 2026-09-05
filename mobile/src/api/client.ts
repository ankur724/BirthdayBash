import axios from "axios";
import { Platform } from "react-native";

// Android emulator can't reach "localhost" on the host machine — it needs 10.0.2.2.
// Override with EXPO_PUBLIC_API_URL in a .env file when testing on a physical device.
// EXPO_PUBLIC_API_URL is just the host:port (no path) — /api/v1 is appended here.
const DEFAULT_HOST = Platform.OS === "android" ? "10.0.2.2" : "localhost";

export const SERVER_ROOT = process.env.EXPO_PUBLIC_API_URL || `http://${DEFAULT_HOST}:8000`;

export const API_BASE_URL = `${SERVER_ROOT}/api/v1`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});
