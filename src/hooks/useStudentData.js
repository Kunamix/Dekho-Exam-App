import { useCallback, useEffect, useState } from "react";
import {
  contentService,
  handleApiError,
  subscriptionService,
  testService,
} from "../../services/student.service";

// ------------------------------
// Generic Hook Factory (GET)
// ------------------------------
function useFetchData(apiCall, initialData, dependencyVal) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    // ✅ Only block if dependency is REQUIRED and missing
    if (
      dependencyVal !== undefined &&
      (dependencyVal === "" || dependencyVal == null)
    ) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(handleApiError(err, "Failed to fetch data"));
    } finally {
      setLoading(false);
    }
  }, [apiCall, dependencyVal]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ------------------------------
// EXPORTED HOOKS
// ------------------------------

export const useCategories = () =>
  useFetchData(async () => {
    const res = await contentService.getCategories();
    return res.categories; // ✅ extract array
  }, []);

export const useTestsByCategory = (categoryId) =>
  useFetchData(
    () => contentService.getTestsByCategory(categoryId),
    [],
    categoryId,
  );

export const useCategoryAccess = (categoryId) =>
  useFetchData(
    () => contentService.checkCategoryAccess(categoryId),
    null,
    categoryId,
  );

export const usePopularTests = () =>
  useFetchData(() => contentService.getPopularTests(), []);

export const useTestHistory = () =>
  useFetchData(() => testService.getHistory(), []);

export const useTestResult = (attemptId) =>
  useFetchData(() => testService.getResult(attemptId), null, attemptId);

export const useSubscriptionPlans = () =>
  useFetchData(() => subscriptionService.getAllPlans(), []);
