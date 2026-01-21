// src/api/auth.api.js
import apiClient from "./client";

export const sendOtp = (phoneNumber) => {
  return apiClient.post("/auth/login", {
    phoneNumber,
  });
};

export const verifyOtp = (otpCode, verificationToken, deviceId) => {
  return apiClient.post(
    "/auth/verify",
    { otpCode },
    {
      headers: {
        Authorization: `Bearer ${verificationToken}`,
        "x-device-id": deviceId,
      },
    },
  );
};

export const logout = (refreshToken) => {
  return apiClient.post("/auth/logout", { refreshToken });
};

export const getMe = () => {
  return apiClient.get("/auth/me");
};
