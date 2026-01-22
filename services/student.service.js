import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/api/client";

// --- Helper: Consistent Error Handling ---
const handleApiError = (error, defaultMsg) => {
  const message = error.response?.data?.message || error.message || defaultMsg;
  console.log(`API Error [${defaultMsg}]:`, message);
  return message;
};

// ==========================================
// 1. AUTH SERVICES
// ==========================================
export const authService = {
  login: async (phone) => {
    const { data } = await api.post("/auth/login", { phoneNumber: phone });
    return data;
  },
  verifyOtp: async (otp) => {
    const { data } = await api.post("/auth/verify-otp", {
      otpCode: otp,
    });
    return data;
  },
  logout: async () => {
    const { data } = await api.post("/auth/logout");
    return data;
  },
  async getMe() {
    const res = await api.get("/auth/me");

    // ✅ Cache user
    await AsyncStorage.setItem("userProfile", JSON.stringify(res.data));

    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put(`/user/update-profile`, data);
    return res.data;
  },
};

// ==========================================
// 2. CONTENT SERVICES
// ==========================================
export const contentService = {
  getCategories: async () => {
    const { data } = await api.get("/category/categories");
    console.log("Fetched Categories:", data);
    return data.data;
  },
  checkCategoryAccess: async (categoryId) => {
    const { data } = await api.get(
      `/category/check-category-access/${categoryId}`,
    );

    const response = data.data;
    return {
      hasAccess: response.isUnlocked,
      planId: response.purchaseOption?.id,
      planName: response.purchaseOption?.name,
      price: response.purchaseOption?.price,
      duration: response.purchaseOption?.durationDays,
    };
  },
  getTestsByCategory: async (categoryId) => {
    const { data } = await api.get(
      `/test/get-test-by-category-id/${categoryId}`,
    );
    console.log(`Fetched Tests for Category ${categoryId}:`, data);
    return data.data;
  },
  getPopularTests: async () => {
    const { data } = await api.get("/test/get-popular-tests");
    console.log("Fetched Popular Tests:", data);
    return data.data;
  },
};

// ==========================================
// 3. TEST ENGINE SERVICES
// ==========================================
export const testService = {
  getInstructions: async (testId) => {
    const { data } = await api.get(`/test/get-test-instruction/${testId}`);
    return data.data;
  },
  startAttempt: async (testId) => {
    const { data } = await api.post(`/test/start-test-attempt/${testId}`);
    return data.data; // Returns { attemptId: "..." }
  },
  getQuestions: async (attemptId) => {
    const { data } = await api.get(`/test/get-attempt-questions/${attemptId}`);
    return data.data;
  },
  saveAnswer: async (attemptId, questionId, option) => {
    const { data } = await api.post(`/test/save-answer/${attemptId}`, {
      questionId,
      selectedOption: option,
    });
    return data.data;
  },
  submitTest: async (attemptId) => {
    const { data } = await api.post(`/test/submit-test/${attemptId}`);
    return data.data;
  },
  getResult: async (attemptId) => {
    const { data } = await api.get(`/test/get-test-result/${attemptId}`);
    return data.data;
  },
  getHistory: async () => {
    const { data } = await api.get("/test/attempt-history");
    return data.data;
  },
  viewSolution: async (attemptId) => {
    const { data } = await api.get(`/test/view-solution/${attemptId}`);
    console.log("Fetched Solutions for Attempt:", attemptId, data);
    return data.data;
  },
};

// ==========================================
// 4. SUBSCRIPTION SERVICES
// ==========================================
export const subscriptionService = {
  getAllPlans: async () => {
    const { data } = await api.get("/subscription/get-all-subscriptions");
    console.log("Fetched Subscription Plans:", data);
    return data.data;
  },
  getMySubscriptions: async () => {
    const { data } = await api.get("/subscription/my-subscriptions");
    return data.data;
  },
};

export { handleApiError };

