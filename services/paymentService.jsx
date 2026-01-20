// services/paymentService.js
import RazorpayCheckout from "react-native-razorpay";

const RAZORPAY_KEY_ID = "pCVpBeCJD0bcoUXyMrYj9Dme"; // REAL test key

export const startPayment = ({ amount, email, contact }) => {
  const options = {
    key: "rzp_test_S62qF6mXE2t4Tx",
    amount: amount * 100, // in paise
    currency: "INR",
    name: "DekhoExam",
    description: "DekhoExam PRO Subscription",
    image: "https://razorpay.com/assets/razorpay-glyph.svg", // MUST be HTTPS
    prefill: {
      email,
      contact,
    },
    theme: { color: "#007ACC" },
  };

  return RazorpayCheckout.open(options);
};
