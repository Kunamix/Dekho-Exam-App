import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useColorScheme,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../../src/constants/Colors";

const { width, height } = Dimensions.get("window");

export default function OTPScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  // OTP State
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef([]);

  // Timer State
  const [timer, setTimer] = useState(30);

  // Timer Countdown Logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle Input Change
  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move Forward
    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
    // Move Backward on empty (handled in onKeyPress usually, but basic logic here)
    if (!text && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  // Handle Backspace specifically
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length === 4) {
      // Navigate to Home
      router.replace("/(tabs)");
    } else {
      alert("Please enter a valid 4-digit code");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: theme.primary }]}>
        <StatusBar style="light" />

        <SafeAreaView style={styles.safeArea}>
          {/* 1. HEADER & BACK BUTTON */}
          <View style={styles.topSection}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.imageWrapper}>
              {/* Reusing the Desk Image for consistency, or swap for a Lock/Shield image */}
              <Image
                source={require("../../assets/images/login.png")}
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>
          </View>
        </SafeAreaView>

        {/* 2. BOTTOM SHEET */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View
            style={[styles.bottomSheet, { backgroundColor: theme.background }]}
          >
            {/* Drag Handle */}
            <View
              style={[styles.sheetHandle, { backgroundColor: theme.border }]}
            />

            <ScrollView
              contentContainerStyle={styles.sheetContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.textBlock}>
                <Text style={[styles.title, { color: theme.text }]}>
                  Verification
                </Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  Enter the code sent to{" "}
                  <Text style={{ fontWeight: "800", color: theme.text }}>
                    +91 {phone}
                  </Text>
                </Text>
              </View>

              {/* OTP Inputs */}
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputs.current[index] = ref)}
                    style={[
                      styles.otpBox,
                      {
                        backgroundColor: theme.inputBg,
                        color: theme.text,
                        borderColor: digit ? theme.secondary : "transparent", // Highlight on fill
                        borderWidth: digit ? 2 : 1,
                      },
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    textAlign="center"
                  />
                ))}
              </View>

              {/* Resend Timer */}
              <View style={styles.resendContainer}>
                {timer > 0 ? (
                  <Text
                    style={[styles.resendText, { color: theme.textSecondary }]}
                  >
                    Resend code in{" "}
                    <Text
                      style={{ color: theme.secondary, fontWeight: "bold" }}
                    >
                      00:{timer < 10 ? `0${timer}` : timer}
                    </Text>
                  </Text>
                ) : (
                  <TouchableOpacity onPress={() => setTimer(30)}>
                    <Text style={[styles.linkText, { color: theme.secondary }]}>
                      Resend Code
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Verify Button */}
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: theme.secondary }]}
                activeOpacity={0.8}
                onPress={handleVerify}
              >
                <Text style={styles.btnText}>Verify & Login</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  // --- TOP SECTION ---
  topSection: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
  },
  backBtn: {
    position: "absolute",
    top: 20,
    left: 24,
    zIndex: 10,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)", // Glass effect
    borderRadius: 12,
  },
  imageWrapper: {
    width: width * 0.8,
    height: height * 0.35,
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  illustration: {
    width: "100%",
    height: "100%",
  },

  // --- BOTTOM SHEET ---
  keyboardView: {
    justifyContent: "flex-end",
  },
  bottomSheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 30,
    minHeight: height * 0.5, // Taller sheet for OTP
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 25,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
    opacity: 0.5,
  },
  sheetContent: {
    paddingBottom: 20,
  },

  // Typography
  textBlock: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },

  // OTP Inputs
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Spreads them evenly
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  otpBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    fontSize: 24,
    fontWeight: "bold",
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // Resend Timer
  resendContainer: {
    alignItems: "center",
    marginBottom: 30,
    height: 20, // Fixed height to prevent jump
  },
  resendText: {
    fontSize: 14,
    fontWeight: "500",
  },
  linkText: {
    fontSize: 15,
    fontWeight: "800",
  },

  // Button
  btn: {
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
