import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { createOrderApi, verifyPaymentApi } from "../services/payment.service";

export const usePayment = (onSuccess) => {
  const [loading, setLoading] = useState(false);

  const buyPlan = useCallback(
    async (plan) => {
      if (!plan?.id) {
        Alert.alert("Error", "Invalid subscription plan");
        return;
      }

      if (loading) return; // prevent double tap

      try {
        setLoading(true);

        // 1️⃣ Prefill details
        const phone = (await AsyncStorage.getItem("authPhone")) || "";

        // 2️⃣ Create Order (Backend)
        const orderData = await createOrderApi(plan.id);

        // 3️⃣ Razorpay Options
        const options = {
          description: `Subscription for ${plan.name}`,
          image: "https://razorpay.com/assets/razorpay-glyph.svg",
          currency: orderData.currency,
          key: orderData.key,
          amount: orderData.amount,
          name: "DekhoExam",
          order_id: orderData.orderId,
          prefill: {
            email: "student@dekhoexam.com",
            contact: phone,
            name: "Student",
          },
          theme: { color: "#378cf4" },
        };

        // 4️⃣ Open Razorpay Checkout
        const paymentData = await RazorpayCheckout.open(options);

        // 5️⃣ Verify Payment (Backend)
        await verifyPaymentApi({
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
        });

        Alert.alert("Success 🎉", "Plan activated successfully!");
        onSuccess?.();
      } catch (error) {
        // ❌ User cancelled payment
        if (error?.description === "Payment Cancelled") {
          console.log("Payment cancelled by user");
          return;
        }

        // ❌ Razorpay failure
        if (error?.error?.description) {
          Alert.alert("Payment Failed", error.error.description);
          return;
        }

        // ❌ Backend / API error
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Payment failed. Please try again.";

        Alert.alert("Error", message);
      } finally {
        setLoading(false);
      }
    },
    [loading, onSuccess],
  );

  return { buyPlan, loading };
};
