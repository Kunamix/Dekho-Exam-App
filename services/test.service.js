import api from "../src/api/client";

export const testEngineService = {
  // 1. Get Pre-Exam Instructions
  getInstructions: async (testId) => {
    const { data } = await api.get(`/test/get-test-instruction/${testId}`);
    return data.data; // { name, durationMinutes, totalQuestions, positiveMarks, ... }
  },

  // 2. Start (or Resume) Attempt
  startAttempt: async (testId) => {
    const { data } = await api.post(`/test/start-test-attempt/${testId}`);
    return data.data; // { attemptId }
  },

  // 3. Fetch Questions for Active Attempt
  getQuestions: async (attemptId) => {
    const { data } = await api.get(`/test/get-attempt-questions/${attemptId}`);
    return data.data; // { questions: [...], timeLeftSeconds: 1200 }
  },

  // 4. Save Single Answer
  saveAnswer: async (attemptId, payload) => {
    const { data } = await api.post(`/test/save-answer/${attemptId}`, payload);
    return data.data;
  },

  // 5. Submit Test
  submitTest: async (attemptId) => {
    const { data } = await api.post(`/test/submit-test/${attemptId}`);
    return data.data; // { attemptId }
  },

  // 6. View Result Summary
  getResult: async (attemptId) => {
    const { data } = await api.get(`/test/get-test-result/${attemptId}`);
    return data.data; // { score, percentage, correct, incorrect, ... }
  },

  // 7. View Detailed Solutions
  viewSolution: async (attemptId) => {
    const { data } = await api.get(`/test/view-solution/${attemptId}`);
    return data.data;
  },
};
