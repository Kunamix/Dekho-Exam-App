import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { sendOtp } from "../../src/api/auth.api";

const { width } = Dimensions.get("window");
const PRIMARY_COLOR = "#378cf4"; // The specific orange from your image

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGetOTP = async () => {
    Keyboard.dismiss();
    if (phone.length !== 10) {
      Alert.alert("Invalid Number", "Please enter a valid 10-digit number");
      return;
    }

    try {
      setLoading(true);
      const response = await sendOtp(phone);

      if (response && response.success) {
        const { verificationToken, phoneNumber } = response.data;
        await AsyncStorage.setItem("verificationToken", verificationToken);
        await AsyncStorage.setItem("authPhone", phoneNumber);

        router.push({
          pathname: "/(auth)/otp",
          params: { phone: phoneNumber },
        });
      } else {
        throw new Error(response.message || "Failed");
      }
    } catch (err) {
      Alert.alert("Failed", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar style="light" />

        {/* Background Decor */}
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />

        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {/* HEADER */}
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.backButton}
                >
                  {/* <Ionicons name="arrow-back" size={24} color="#FFF" /> */}
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Dekho Exam</Text>
                <View style={{ width: 24 }} />
              </View>

              {/* HERO ICON */}
              <View style={styles.heroContainer}>
                <MaterialCommunityIcons
                  name="cellphone-message"
                  size={80}
                  color="#FFF"
                />
                <View style={styles.heroGlow} />
              </View>

              {/* WHITE CARD */}
              <View style={styles.card}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Enter your mobile number</Text>

                  <View style={styles.phoneInputContainer}>
                    <Text style={styles.prefix}>+91</Text>
                    <View style={styles.verticalLine} />
                    <TextInput
                      style={styles.input}
                      placeholder="98765 43210"
                      placeholderTextColor="#C4C4C4"
                      keyboardType="number-pad"
                      maxLength={10}
                      value={phone}
                      onChangeText={setPhone}
                    />
                  </View>
                </View>

                <Text style={styles.helperText}>
                  We will send you a one time password (OTP)
                </Text>
                <Text style={styles.carrierText}>Carrier rates may apply</Text>

                {/* FLOATING ACTION BUTTON */}
                <View style={styles.fabContainer}>
                  <TouchableOpacity
                    style={styles.fab}
                    onPress={handleGetOTP}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <Ionicons name="arrow-forward" size={28} color="#FFF" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  /* Subtle Background Circles */
  bgCircle1: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  bgCircle2: {
    position: "absolute",
    top: 100,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
  heroContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  heroGlow: {
    position: "absolute",
    width: 60,
    height: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 50,
    bottom: -10,
    transform: [{ scaleX: 1.5 }],
  },
  /* Card Styles */
  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 30,
    paddingBottom: 50, // Space for the FAB
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  label: {
    fontSize: 14,
    color: "#8A8A8A",
    marginBottom: 16,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 8,
    marginBottom: 24,
  },
  prefix: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  verticalLine: {
    width: 1,
    height: 20,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  helperText: {
    textAlign: "center",
    color: "#666",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  carrierText: {
    textAlign: "center",
    color: PRIMARY_COLOR,
    fontSize: 12,
    fontWeight: "500",
  },
  /* Floating Button */
  fabContainer: {
    position: "absolute",
    bottom: -28, // Pulls the button halfway out of the card
    alignSelf: "center",
    borderRadius: 30,
    backgroundColor: "#FFF", // White ring border effect
    padding: 6,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});
