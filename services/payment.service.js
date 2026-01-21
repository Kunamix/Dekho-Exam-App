import api from "../src/api/client";

// 1. Create Order ID on Backend
export const createOrderApi = async (planId) => {
  const { data } = await api.post("/payment/create-order", { planId });
  return data.data; // Returns { orderId, key, amount, currency, ... }
};

// 2. Verify Payment on Backend
export const verifyPaymentApi = async (payload) => {
  const { data } = await api.post("/payment/verify", payload);
  return data;
};
