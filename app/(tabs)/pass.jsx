import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

// Razorpay Service
import { useState } from "react";
import { startPayment } from "../../services/paymentService";

export default function PassScreen() {
  const { activeColors } = useTheme();
  const [loading, setLoading] = useState(false);

  const FeatureItem = ({ text }) => (
    <View style={styles.featureRow}>
      <Ionicons
        name="checkmark-circle"
        size={20}
        color={activeColors.success}
      />
      <ThemedText style={styles.featureText}>{text}</ThemedText>
    </View>
  );

  /* ================= PAYMENT HANDLER ================= */
  const handleBuyPass = async () => {
    try {
      setLoading(true);

      const paymentData = await startPayment({
        amount: 499,
        email: "student@dekhoexam.com",
        contact: "9999999999",
        packageName: "DekhoExam PRO",
      });

      Alert.alert(
        "Payment Successful 🎉",
        `Payment ID:\n${paymentData.razorpay_payment_id}`,
      );

      // TODO (Production):
      // Send paymentData to backend for verification
      // Unlock PRO features
    } catch (error) {
      if (error?.code !== 0) {
        Alert.alert(
          "Payment Failed",
          error?.description || "Payment cancelled",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedScreen edges={["left", "right", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= HERO ================= */}
        <View style={[styles.hero, { backgroundColor: activeColors.primary }]}>
          <View style={styles.heroIcon}>
            <Ionicons name="diamond" size={36} color="#FFD700" />
          </View>

          <ThemedText style={styles.heroTitle}>DekhoExam PRO</ThemedText>

          <ThemedText style={styles.heroSubtitle}>
            Unlock unlimited access to all tests, analysis, and rankings.
          </ThemedText>
        </View>

        {/* ================= FEATURES ================= */}
        <View style={styles.features}>
          <FeatureItem text="500+ Full Mock Tests" />
          <FeatureItem text="Detailed Solutions & Analysis" />
          <FeatureItem text="All India Rank Prediction" />
          <FeatureItem text="Ad-Free Experience" />
        </View>

        {/* ================= PLAN ================= */}
        <View
          style={[
            styles.planCard,
            {
              borderColor: activeColors.secondary,
              backgroundColor: activeColors.card,
            },
          ]}
        >
          <View>
            <ThemedText style={styles.planTitle}>12 Months Pass</ThemedText>
            <ThemedText variant="caption" style={styles.strikePrice}>
              ₹999
            </ThemedText>
          </View>

          <View style={styles.priceRight}>
            <ThemedText
              style={[styles.finalPrice, { color: activeColors.secondary }]}
            >
              ₹499
            </ThemedText>

            <View style={styles.discountBadge}>
              <ThemedText style={styles.discountText}>SAVE 50%</ThemedText>
            </View>
          </View>
        </View>

        {/* ================= BUY BUTTON ================= */}
        <TouchableOpacity
          style={[styles.buyBtn, { backgroundColor: activeColors.secondary }]}
          activeOpacity={0.85}
          onPress={handleBuyPass}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <ThemedText style={styles.buyText}>Buy Pass Now</ThemedText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ThemedScreen>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },

  hero: {
    alignItems: "center",
    padding: 28,
    borderRadius: 24,
    marginBottom: 32,
  },
  heroIcon: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  heroTitle: {
    color: "#FFF",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },

  features: {
    marginBottom: 32,
    paddingHorizontal: 12,
    gap: 14,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "500",
  },

  planCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 22,
    borderRadius: 18,
    borderWidth: 2,
    marginBottom: 26,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  strikePrice: {
    textDecorationLine: "line-through",
    marginTop: 4,
  },
  priceRight: {
    alignItems: "flex-end",
  },
  finalPrice: {
    fontSize: 24,
    fontWeight: "800",
  },
  discountBadge: {
    marginTop: 4,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 11,
    color: "#166534",
    fontWeight: "800",
  },

  buyBtn: {
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    elevation: 6,
  },
  buyText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
});
