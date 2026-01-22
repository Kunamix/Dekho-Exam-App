import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import {
  createOrderApi,
  verifyPaymentApi,
} from "../../services/payment.service";

export const usePayment = (onSuccess) => {
  const [loading, setLoading] = useState(false);

  const buyPlan = useCallback(
    async (plan) => {
      if (!plan?.id) {
        Alert.alert("Error", "Invalid subscription plan");
        return;
      }

      if (loading) return;

      try {
        setLoading(true);

        /* ================= USER PROFILE ================= */
        const raw = await AsyncStorage.getItem("userProfile");

        if (!raw) {
          throw new Error("User not logged in");
        }

        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch {
          throw new Error("Corrupted user session");
        }

        // ✅ Normalize profile (critical fix)
        const user = parsed?.data;

        if (!user?.id) {
          throw new Error("Invalid user session");
        }

        console.log("User Profile for Payment:", user);

        /* ================= CREATE ORDER ================= */
        const orderData = await createOrderApi(plan.id);
        // { orderId, amount, currency, key }

        if (!orderData?.orderId || !orderData?.key) {
          throw new Error("Failed to initialize payment");
        }

        /* ================= RAZORPAY OPTIONS ================= */
        const options = {
          name: "DekhoExam",
          description: `Subscription for ${plan.name}`,
          image: "https://razorpay.com/assets/razorpay-glyph.svg",

          currency: orderData.currency,
          key: orderData.key, // ✅ FROM BACKEND ONLY
          amount: orderData.amount,
          order_id: orderData.orderId,

          prefill: {
            name: user.name || "Student",
            email: user.email || "",
            contact: user.phoneNumber || "",
          },

          theme: { color: "#378cf4" },
        };

        /* ================= OPEN CHECKOUT ================= */
        const paymentData = await RazorpayCheckout.open(options);

        if (!paymentData?.razorpay_payment_id) {
          throw new Error("Payment was not completed");
        }

        /* ================= VERIFY PAYMENT ================= */
        await verifyPaymentApi({
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
        });

        Alert.alert("Success 🎉", "Plan activated successfully!");
        onSuccess?.();
      } catch (error) {
        // ❌ User cancelled
        if (error?.description === "Payment Cancelled") {
          console.log("Payment cancelled by user");
          return;
        }

        // ❌ Razorpay error
        if (error?.error?.description) {
          Alert.alert("Payment Failed", error.error.description);
          return;
        }

        // ❌ App / Backend error
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
