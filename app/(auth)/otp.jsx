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
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer <= 0) return;
    const i = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(i);
  }, [timer]);

  const handleChange = (text, index) => {
    const next = [...otp];
    next[index] = text;
    setOtp(next);
    if (text && index < 3) inputs.current[index + 1]?.focus();
    if (!text && index > 0) inputs.current[index - 1]?.focus();
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.join("").length === 6) {
      router.replace("/(tabs)");
    } else {
      alert("Enter valid 6-digit code");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.primary }]}
    >
      <StatusBar style="light" />

      {/* TOP */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.top}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color="#FFF" />
          </TouchableOpacity>

          <Image
            source={require("../../assets/images/login.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
      </TouchableWithoutFeedback>

      {/* BOTTOM */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.sheet, { backgroundColor: theme.background }]}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetContent}
          >
            <View style={[styles.handle, { backgroundColor: theme.border }]} />

            <Text style={[styles.title, { color: theme.text }]}>
              Verify OTP
            </Text>

            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Enter the 6-digit code sent to{" "}
              <Text style={{ fontWeight: "700", color: theme.text }}>
                +91 {phone}
              </Text>
            </Text>

            {/* OTP */}
            <View style={styles.otpRow}>
              {otp.map((d, i) => (
                <TextInput
                  key={i}
                  ref={(r) => (inputs.current[i] = r)}
                  value={d}
                  onChangeText={(t) => handleChange(t, i)}
                  onKeyPress={(e) => handleKeyPress(e, i)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  style={[
                    styles.otpBox,
                    {
                      backgroundColor: theme.inputBg,
                      color: theme.text,
                      borderColor: d ? theme.secondary : theme.border,
                    },
                  ]}
                />
              ))}
            </View>

            {/* RESEND */}
            <View style={styles.resend}>
              {timer > 0 ? (
                <Text style={{ color: theme.textSecondary }}>
                  Resend in{" "}
                  <Text style={{ color: theme.secondary, fontWeight: "700" }}>
                    00:{timer < 10 ? `0${timer}` : timer}
                  </Text>
                </Text>
              ) : (
                <TouchableOpacity onPress={() => setTimer(30)}>
                  <Text
                    style={{
                      color: theme.secondary,
                      fontWeight: "700",
                    }}
                  >
                    Resend Code
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* CTA */}
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: theme.secondary,
                  shadowColor: theme.secondary,
                },
              ]}
              activeOpacity={0.85}
              onPress={handleVerify}
            >
              <Text style={styles.buttonText}>Verify & Continue</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1 },

  /* TOP */
  top: {
    height: height * 0.38,
    justifyContent: "center",
    alignItems: "center",
  },
  backBtn: {
    position: "absolute",
    top: 24,
    left: 24,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 12,
  },
  illustration: {
    width: width * 0.75,
    height: height * 0.28,
  },

  /* SHEET */
  sheet: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 14,
    elevation: 20,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 24,
    opacity: 0.5,
  },
  sheetContent: {
    paddingBottom: 32,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 28,
  },

  /* OTP */
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 26,
    paddingHorizontal: 10,
  },
  otpBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    fontSize: 22,
    fontWeight: "700",
    borderWidth: 1.5,
  },

  /* RESEND */
  resend: {
    alignItems: "center",
    marginBottom: 26,
    minHeight: 18,
  },

  /* BUTTON */
  button: {
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});
