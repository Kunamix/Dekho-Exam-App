import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Replace with your actual backend URL (e.g., http://192.168.1.5:5000/api/v1)
const BASE_URL = "https://dekho-exam.onrender.com/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- REQUEST INTERCEPTOR (The Critical Part) ---
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // 1. Log what we are trying to do
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);

      // 2. Try to get the token
      const token = await AsyncStorage.getItem("accessToken");

      // 3. Log the token status (don't log the full token for security, just presence)
      console.log("[API Client] Token found in storage?", !!token);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("[API Client] Attached 'Authorization' header");
      } else {
        console.warn(
          "[API Client] ⚠️ No token found! Request sent without auth.",
        );
      }
    } catch (error) {
      console.error("[API Client] Error retrieving token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// --- RESPONSE INTERCEPTOR (For Debugging Errors) ---
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `[API Response] ${response.status} from ${response.config.url}`,
    );
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with a status code other than 2xx
      console.error(
        `[API Error] ${error.response.status} - ${error.response.data?.message || "Unknown error"}`,
      );

      if (error.response.status === 401) {
        console.error("🔒 Unauthorized! Token might be invalid or expired.");
        // Optional: Trigger logout here
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error(
        "[API Error] No response from server. Is the backend running?",
      );
    } else {
      console.error("[API Error] Request setup failed:", error.message);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
