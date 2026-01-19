import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
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

// Import your Color Constants
import { Colors } from "../../src/constants/Colors";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const [phone, setPhone] = useState("");

  const handleGetOTP = () => {
    Keyboard.dismiss();
    if (phone.length === 10) {
      router.push({ pathname: "/(auth)/otp", params: { phone } });
    } else {
      alert("Please enter a valid 10-digit number");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {/* Container Background matches the Illustration's Blue */}
      <View style={[styles.container, { backgroundColor: theme.primary }]}>
        <StatusBar style="light" />

        <SafeAreaView style={styles.safeArea}>
          {/* 1. HEADER & ILLUSTRATION */}
          <View style={styles.topSection}>
            {/* Clean Logo Header */}
            <View style={styles.headerRow}>
              <Text style={styles.brandText}>Dekho Exam</Text>
            </View>

            {/* Floating 3D Image */}
            <View style={styles.imageWrapper}>
              <Image
                source={require("../../assets/images/desk.png")}
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>
          </View>
        </SafeAreaView>

        {/* 2. MODERN BOTTOM SHEET */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View
            style={[styles.bottomSheet, { backgroundColor: theme.background }]}
          >
            {/* Decorative Handle Bar */}
            <View
              style={[styles.sheetHandle, { backgroundColor: theme.border }]}
            />

            <ScrollView
              contentContainerStyle={styles.sheetContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.textBlock}>
                <Text style={[styles.title, { color: theme.text }]}>
                  Welcome Back!
                </Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  Start your study session by logging in.
                </Text>
              </View>

              {/* Modern Input Group */}
              <Text style={[styles.label, { color: theme.text }]}>
                Mobile Number
              </Text>

              <View style={styles.inputGroup}>
                {/* Country Code */}
                <View
                  style={[
                    styles.countryBox,
                    {
                      backgroundColor: theme.inputBg,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text style={styles.flag}>🇮🇳</Text>
                  <Text style={[styles.countryText, { color: theme.text }]}>
                    +91
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={12}
                    color={theme.textSecondary}
                  />
                </View>

                {/* Phone Input */}
                <TextInput
                  style={[
                    styles.inputField,
                    {
                      backgroundColor: theme.inputBg,
                      color: theme.text,
                      borderColor: theme.border,
                    },
                  ]}
                  placeholder="98765 43210"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="number-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              {/* Primary Action Button */}
              <TouchableOpacity
                style={[
                  styles.btn,
                  {
                    backgroundColor: theme.secondary,
                    shadowColor: theme.secondary,
                  },
                ]}
                activeOpacity={0.8}
                onPress={handleGetOTP}
              >
                <Text style={styles.btnText}>Get OTP</Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#FFF"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>

              {/* Footer */}
              <View style={styles.footer}>
                <Text
                  style={[styles.footerText, { color: theme.textSecondary }]}
                >
                  New here?{" "}
                </Text>
                <TouchableOpacity onPress={() => alert("Go to Signup")}>
                  <Text style={[styles.linkText, { color: theme.secondary }]}>
                    Create Account
                  </Text>
                </TouchableOpacity>
              </View>
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
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  headerRow: {
    position: "absolute",
    top: 20,
    left: 24,
    zIndex: 10,
  },
  brandText: {
    color: "#FFFFFF",
    fontWeight: "800", // Extra Bold
    fontSize: 22,
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  imageWrapper: {
    width: width * 2.2,
    height: height * 0.45,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    // Soft shadow to make the desk float
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  illustration: {
    width: "90%",
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
    minHeight: height * 0.45,
    // Heavy shadow for "Card" effect
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
    marginBottom: 25,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
    marginLeft: 4,
  },

  // Inputs
  inputGroup: {
    flexDirection: "row",
    marginBottom: 30,
    gap: 12,
  },
  countryBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 16,
    height: 58,
    borderWidth: 1,
    borderColor: "transparent", // Setup for future focus state
  },
  flag: { fontSize: 22, marginRight: 6 },
  countryText: {
    fontSize: 16,
    fontWeight: "700",
    marginRight: 4,
  },
  inputField: {
    flex: 1,
    borderRadius: 16,
    height: 58,
    paddingHorizontal: 18,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
    borderWidth: 1,
    borderColor: "transparent",
  },

  // Button
  btn: {
    height: 60,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    // Vibrant Glow Shadow
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

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 15,
    fontWeight: "500",
  },
  linkText: {
    fontSize: 15,
    fontWeight: "800",
  },
});
