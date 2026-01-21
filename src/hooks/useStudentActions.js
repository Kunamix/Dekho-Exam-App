import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import {
    authService,
    handleApiError,
    testService,
} from "../../services/student.service";

// --- AUTH HOOKS ---

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (phone) => {
    try {
      setLoading(true);
      const res = await authService.login(phone);
      // Backend should return success message or OTP sent status
      return res;
    } catch (err) {
      const msg = handleApiError(err, "Login failed");
      Alert.alert("Error", msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};

export const useVerifyOtp = () => {
  const [loading, setLoading] = useState(false);

  const verify = async (phone, otp) => {
    try {
      setLoading(true);
      const res = await authService.verifyOtp(phone, otp);
      // Handle Token Storage here (AsyncStorage) usually
      return res;
    } catch (err) {
      const msg = handleApiError(err, "Verification failed");
      Alert.alert("Invalid OTP", msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { verify, loading };
};

// --- TEST ENGINE HOOKS ---

export const useStartTest = () => {
  const [loading, setLoading] = useState(false);

  const startTest = async (testId) => {
    try {
      setLoading(true);
      const res = await testService.startAttempt(testId);
      return res; // Returns { attemptId }
    } catch (err) {
      const msg = handleApiError(err, "Could not start test");
      Alert.alert("Error", msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { startTest, loading };
};

export const useSubmitTest = () => {
  const [loading, setLoading] = useState(false);

  const submit = async (attemptId) => {
    try {
      setLoading(true);
      const res = await testService.submitTest(attemptId);
      return res;
    } catch (err) {
      const msg = handleApiError(err, "Submission failed");
      Alert.alert("Error", msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading };
};

// Silent Save (No loading state needed for UI usually)
export const useSaveAnswer = () => {
  const save = async (attemptId, questionId, option) => {
    try {
      await testService.saveAnswer(attemptId, questionId, option);
    } catch (err) {
      console.log("Auto-save failed:", err.message);
      // We usually don't alert the user for every auto-save failure, just log it
    }
  };

  return { save };
};
