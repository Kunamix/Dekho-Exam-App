import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { Alert } from "react-native";

// 1. Dynamic Base URL (Use .env file or fallback to local IP)
// Create a .env file in root: EXPO_PUBLIC_API_URL=http://192.168.1.37:8080/api/v1
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.37:8080/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= REQUEST INTERCEPTOR ================= */
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // 2. Add Token
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      // Debug Logging (Only in Dev)
      if (__DEV__) {
        console.log(`[API Req] ${config.method?.toUpperCase()} ${config.url}`);
      }
    } catch (error) {
      console.error("Error reading token", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/* ================= RESPONSE INTERCEPTOR ================= */
apiClient.interceptors.response.use(
  (response) => {
    // Debug Logging
    if (__DEV__) {
      console.log(`[API Res] ${response.status} ${response.config.url}`);
    }
    // 3. Unwrap Data directly
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    // Extract server error message or fallback
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    if (__DEV__) {
      console.error(`[API Error] ${status} - ${message}`);
    }

    // 🔴 401: UNAUTHORIZED (Token Expired or Invalid)
    if (status === 401) {
      console.warn("Session expired. Logging out...");

      await AsyncStorage.multiRemove([
        "accessToken",
        "refreshToken",
        "userProfile",
      ]);

      // Prevent redirect loop if already on login/auth pages
      // Note: In a pure JS function we can't check current route easily without passing hooks,
      // so we blindly replace. Expo Router handles this gracefully usually.
      router.replace("/(auth)/login");

      return Promise.reject("Session expired. Please login again.");
    }

    // 🔴 403: FORBIDDEN (Account Blocked)
    if (status === 403) {
      await AsyncStorage.clear();
      Alert.alert(
        "Access Denied",
        "Your account may be suspended. Contact support.",
      );
      router.replace("/(auth)/login");
      return Promise.reject(message);
    }

    // 🔴 429: TOO MANY REQUESTS
    if (status === 429) {
      return Promise.reject("Too many attempts. Please try again later.");
    }

    // 🔴 500: SERVER ERROR
    if (status && status >= 500) {
      return Promise.reject("Server error. We are working on it.");
    }

    // Return the extracted message string for easy display in UI
    return Promise.reject(message);
  },
);

export default apiClient;
