import { useEffect, useState } from "react";
import { testService } from "../../services/student.service";

export const useTestSolutions = (attemptId) => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if attemptId exists
    if (!attemptId) return;

    const fetchSolutions = async () => {
      try {
        setLoading(true);
        console.log(`Fetching solutions for: ${attemptId}`);

        // Call the service
        const res = await testService.viewSolution(attemptId);
        console.log("Solutions fetched:", res);
        // Handle response structure (adjust if your API wraps it differently)
        if (res) {
          setSummary(res.stats || res.summary); // Handle different naming conventions
          setQuestions(res.solutions || res.questions || []);
        }
      } catch (err) {
        console.error("Failed to load solutions", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, [attemptId]);

  return { loading, summary, questions, error };
};
