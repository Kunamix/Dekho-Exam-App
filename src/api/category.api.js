import apiClient from "./client";

/* ================= CATEGORY APIs ================= */

export const getAllCategories = () => {
  return apiClient.get("/categories");
};

export const getCategoryById = (id) => {
  return apiClient.get(`/categories/${id}`);
};
