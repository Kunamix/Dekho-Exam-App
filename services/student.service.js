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
  verifyOtp: async (phone, otp) => {
    const { data } = await api.post("/auth/verify-otp", {
      phoneNumber: phone,
      otp,
    });
    return data;
  },
  logout: async () => {
    const { data } = await api.post("/auth/logout");
    return data;
  },
  getMe: async () => {
    const { data } = await api.get("/auth/me");
    return data.data;
  },
};

// ==========================================
// 2. CONTENT SERVICES
// ==========================================
export const contentService = {
  getCategories: async () => {
    const { data } = await api.get("/category/categories");
    return data.data;
  },
  checkCategoryAccess: async (categoryId) => {
    const { data } = await api.get(
      `/category/check-category-access/${categoryId}`,
    );
    return data.data; // Returns { isUnlocked: boolean, purchaseOption: ... }
  },
  getTestsByCategory: async (categoryId) => {
    const { data } = await api.get(
      `/test/get-test-by-category-id/${categoryId}`,
    );
    return data.data;
  },
  getPopularTests: async () => {
    const { data } = await api.get("/test/get-popular-tests");
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
};

// ==========================================
// 4. SUBSCRIPTION SERVICES
// ==========================================
export const subscriptionService = {
  getAllPlans: async () => {
    const { data } = await api.get("/subscription/get-all-subscriptions");
    return data.data;
  },
  getMySubscriptions: async () => {
    const { data } = await api.get("/subscription/my-subscriptions");
    return data.data;
  },
};

export { handleApiError };

