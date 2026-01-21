import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 1. Import Custom Hooks
import { Colors } from "../../src/constants/Colors";
import { useLogin, useVerifyOtp } from "../../src/hooks/useStudentActions";

const OTP_LENGTH = 6;

export default function OTPScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  // 2. Initialize Hooks
  const { verify, loading: verifying } = useVerifyOtp();
  const { login: resendOtp, loading: resending } = useLogin(); // Reusing login logic for resend

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const inputs = (useRef < Array < TextInput) | (null >> []);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");

  const loading = verifying || resending;

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timer <= 0) return;
    const i = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(i);
  }, [timer]);

  /* ================= OTP INPUT ================= */
  const handleChange = (text, index) => {
    const digit = text.replace(/[^0-9]/g, "");
    if (!digit) return;

    const updated = [...otp];
    updated[index] = digit;
    setOtp(updated);
    setError("");

    if (index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (updated.join("").length === OTP_LENGTH) {
      Keyboard.dismiss();
      handleVerify(updated.join(""));
    }
  };

  const handleBackspace = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      const updated = [...otp];
      if (updated[index]) {
        updated[index] = "";
        setOtp(updated);
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerify = async (code) => {
    if (code.length !== OTP_LENGTH) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setError("");

      // 3. Call Hook
      const response = await verify(phone, code);

      if (response) {
        // 🔐 Save tokens (Response structure depends on your backend)
        // Assuming response contains { accessToken, refreshToken }
        await AsyncStorage.multiSet([
          ["accessToken", response.accessToken],
          ["refreshToken", response.refreshToken],
        ]);

        // ✅ Go to app
        router.replace("/(tabs)");
      }
    } catch (err) {
      // Hook handles alert, we handle UI error state
      setError("Invalid OTP. Please try again.");
      setOtp(Array(OTP_LENGTH).fill("")); // Clear inputs on error
      inputs.current[0]?.focus();
    }
  };

  /* ================= RESEND OTP ================= */
  const handleResend = async () => {
    try {
      setError("");
      // 4. Call Hook
      await resendOtp(phone);

      setOtp(Array(OTP_LENGTH).fill(""));
      inputs.current[0]?.focus();
      setTimer(30);
    } catch (err) {
      console.log("Resend failed");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <StatusBar style={scheme === "dark" ? "light" : "dark"} />

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: theme.inputBg }]}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.content}>
            {/* ICON & TEXT */}
            <View style={styles.titleContainer}>
              <View
                style={[styles.iconCircle, { backgroundColor: theme.inputBg }]}
              >
                <Ionicons name="lock-closed" size={32} color={theme.primary} />
              </View>
              <Text style={[styles.title, { color: theme.text }]}>
                Verification Code
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                We have sent the verification code to{"\n"}
                <Text style={{ fontWeight: "600", color: theme.text }}>
                  +91 {phone}
                </Text>
              </Text>
            </View>

            {/* OTP INPUTS */}
            <View style={styles.otpRow}>
              {otp.map((d, i) => (
                <TextInput
                  key={i}
                  ref={(r) => (inputs.current[i] = r)}
                  value={d}
                  onChangeText={(t) => handleChange(t, i)}
                  onKeyPress={(e) => handleBackspace(e, i)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  editable={!loading}
                  style={[
                    styles.otpBox,
                    {
                      backgroundColor: theme.inputBg,
                      color: theme.text,
                      borderColor: error
                        ? "#EF4444"
                        : d
                          ? theme.primary
                          : "transparent",
                      borderWidth: d || error ? 1.5 : 0,
                    },
                  ]}
                />
              ))}
            </View>

            {/* ERROR */}
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={18} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* RESEND */}
            <View style={styles.resendContainer}>
              {timer > 0 ? (
                <Text style={{ color: theme.textSecondary }}>
                  Resend code in{" "}
                  <Text style={{ color: theme.primary, fontWeight: "600" }}>
                    00:{timer < 10 ? `0${timer}` : timer}
                  </Text>
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResend} disabled={loading}>
                  <Text style={[styles.resendLink, { color: theme.primary }]}>
                    Resend Code
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* BUTTON */}
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: theme.primary,
                  opacity:
                    loading || otp.join("").length < OTP_LENGTH ? 0.6 : 1,
                },
              ]}
              onPress={() => handleVerify(otp.join(""))}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Verify</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingVertical: 10 },
  backBtn: { padding: 10, borderRadius: 12 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  titleContainer: { alignItems: "center", marginBottom: 40 },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 10 },
  subtitle: { fontSize: 15, textAlign: "center", lineHeight: 24 },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  otpBox: {
    width: 50,
    height: 58,
    borderRadius: 14,
    fontSize: 24,
    fontWeight: "600",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 6,
  },
  errorText: { color: "#EF4444", fontSize: 14, fontWeight: "500" },
  resendContainer: { alignItems: "center", marginBottom: 40 },
  resendLink: { fontSize: 15, fontWeight: "700" },
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
