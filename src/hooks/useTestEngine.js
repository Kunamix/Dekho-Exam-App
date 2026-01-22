import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { testEngineService } from "../../services/test.service";

// Hook for Pre-Exam Instructions
export const useTestInstructions = (testId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInstructions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await testEngineService.getInstructions(testId);
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to load instructions");
    } finally {
      setLoading(false);
    }
  }, [testId]);

  useEffect(() => {
    if (testId) fetchInstructions();
  }, [fetchInstructions]);

  return { data, loading, error };
};

// Hook for Active Exam Session
export const useActiveExam = (testId) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds

  // Local state for answers to show immediate UI updates
  const [answers, setAnswers] = useState({});
  // 1. Initialize Exam (Start/Resume)
  const initExam = async () => {
    try {
      setLoading(true);
      // A. Start/Resume Attempt
      const startRes = await testEngineService.startAttempt(testId);
      const newAttemptId = startRes.attemptId;
      setAttemptId(newAttemptId);

      // B. Fetch Questions
      const qRes = await testEngineService.getQuestions(newAttemptId);
      setQuestions(qRes.questions);
      setTimeLeft(qRes.timeLeftSeconds);
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to start exam", [
        { text: "Go Back", onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 2. Mark Answer (Optimistic Update + Background Save)
  const markAnswer = async (questionId, option) => {
    if (!attemptId) return;

    // Optimistic Update
    setAnswers((prev) => ({ ...prev, [questionId]: option }));

    try {
      // Silent Save
      await testEngineService.saveAnswer(attemptId, {
        questionId,
        selectedOption: option,
      });
    } catch (error) {
      console.log("Auto-save failed for Q:", questionId);
    }
  };

  // 3. Submit Exam
  const submitExam = async () => {
    if (!attemptId) return;

    try {
      setLoading(true);
      await testEngineService.submitTest(attemptId);
      // Navigate to Result Screen
      router.replace({
        pathname: "/(tabs)/analysis", // Or specific result screen
        params: { attemptId },
      });
    } catch (err) {
      Alert.alert("Submission Failed", err.message);
      setLoading(false);
    }
  };

  return {
    loading,
    questions,
    timeLeft,
    attemptId,
    answers,
    initExam,
    markAnswer,
    submitExam,
  };
};

// Hook for Result Analysis
export const useTestResult = (attemptId) => {
  const [result, setResult] = useState < any > null;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        if (!attemptId) return;
        const res = await testEngineService.getResult(attemptId);
        setResult(res);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId]);

  return { result, loading };
};
