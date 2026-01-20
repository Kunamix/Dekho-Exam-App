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
import { Colors } from "../../src/constants/Colors";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.primary }]}
    >
      <StatusBar style="light" />

      {/* ================= TOP SECTION ================= */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.topSection}>
          <Text style={styles.brandText}>Dekho Exam</Text>

          <Image
            source={require("../../assets/images/desk.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
      </TouchableWithoutFeedback>

      {/* ================= BOTTOM SHEET ================= */}
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
              Welcome back
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Enter your mobile number to continue
            </Text>

            <Text style={[styles.label, { color: theme.text }]}>
              Mobile number
            </Text>

            <View style={styles.inputRow}>
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

              <TextInput
                style={[
                  styles.input,
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

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: theme.secondary,
                  shadowColor: theme.secondary,
                },
              ]}
              onPress={handleGetOTP}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Continue</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#FFF"
                style={{ marginLeft: 8 }}
              />
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

  /* ---------- TOP ---------- */
  topSection: {
    height: height * 0.42,
    justifyContent: "center",
    alignItems: "center",
  },
  brandText: {
    position: "absolute",
    top: 24,
    left: 24,
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  illustration: {
    width: width * 0.9,
    height: height * 0.3,
  },

  /* ---------- SHEET ---------- */
  sheet: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 16,
    elevation: 30,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 24,
    opacity: 0.6,
  },
  sheetContent: {
    paddingBottom: 32,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },

  /* ---------- INPUT ---------- */
  inputRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  countryBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 16,
    height: 56,
    borderWidth: 1,
  },
  flag: { fontSize: 20, marginRight: 6 },
  countryText: { fontSize: 16, fontWeight: "700", marginRight: 4 },

  input: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 18,
    fontSize: 17,
    fontWeight: "600",
    borderWidth: 1,
  },

  /* ---------- BUTTON ---------- */
  button: {
    height: 56,
    borderRadius: 18,
    flexDirection: "row",
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
