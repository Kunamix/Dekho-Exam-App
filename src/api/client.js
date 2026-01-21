import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";

const apiClient = axios.create({
  baseURL: "http://192.168.1.37:8080/api/v1", // ⚠️ replace with VPS/domain later
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= REQUEST INTERCEPTOR ================= */
apiClient.interceptors.request.use(
  async (config) => {
    /**
     * ACCESS TOKEN (used after OTP verification)
     */
    const accessToken = await AsyncStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* ================= RESPONSE INTERCEPTOR ================= */
apiClient.interceptors.response.use(
  (response) => response.data,

  async (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message || error?.message || "Network Error";

    /**
     * 🔴 UNAUTHORIZED / SESSION EXPIRED
     * Backend throws:
     * 401 → invalid / expired access token
     */
    if (status === 401) {
      await AsyncStorage.multiRemove([
        "accessToken",
        "refreshToken",
        "verificationToken",
      ]);

      // Force user to login
      router.replace("/(auth)/login");
    }

    /**
     * 🔴 ACCOUNT BLOCKED / DEACTIVATED
     */
    if (status === 403) {
      await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);

      router.replace("/(auth)/login");
    }

    /**
     * 🔴 TOO MANY OTP ATTEMPTS
     */
    if (status === 429) {
      return Promise.reject("Too many attempts. Please request a new OTP.");
    }

    return Promise.reject(message);
  },
);

export default apiClient;
