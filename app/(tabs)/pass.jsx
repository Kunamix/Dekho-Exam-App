import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

export default function PassScreen() {
  const { activeColors } = useTheme();

  const FeatureItem = ({ text }) => (
    <View style={styles.featureRow}>
      <Ionicons
        name="checkmark-circle"
        size={20}
        color={activeColors.success}
      />
      <ThemedText style={{ marginLeft: 10 }}>{text}</ThemedText>
    </View>
  );

  return (
    <ThemedScreen edges={["left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Hero Section */}
        <View style={[styles.hero, { backgroundColor: activeColors.primary }]}>
          <Ionicons
            name="diamond"
            size={60}
            color="#FFD700"
            style={{ marginBottom: 10 }}
          />
          <ThemedText
            style={{ color: "#FFF", fontSize: 24, fontWeight: "bold" }}
          >
            DekhoExam PRO
          </ThemedText>
          <ThemedText
            style={{
              color: "rgba(255,255,255,0.8)",
              textAlign: "center",
              marginTop: 5,
            }}
          >
            Unlock unlimited access to all tests and detailed analysis.
          </ThemedText>
        </View>

        {/* Features List */}
        <View style={styles.features}>
          <FeatureItem text="500+ Full Mock Tests" />
          <FeatureItem text="Detailed Solution & Analysis" />
          <FeatureItem text="All India Rank Prediction" />
          <FeatureItem text="Ad-Free Experience" />
        </View>

        {/* Pricing Cards */}
        <TouchableOpacity
          style={[styles.planCard, { borderColor: activeColors.secondary }]}
        >
          <View>
            <ThemedText style={{ fontWeight: "bold", fontSize: 18 }}>
              12 Months Pass
            </ThemedText>
            <ThemedText
              variant="caption"
              style={{ textDecorationLine: "line-through" }}
            >
              ₹999
            </ThemedText>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <ThemedText
              style={{
                fontWeight: "bold",
                fontSize: 22,
                color: activeColors.secondary,
              }}
            >
              ₹499
            </ThemedText>
            <View
              style={{
                backgroundColor: "#DCFCE7",
                paddingHorizontal: 6,
                borderRadius: 4,
              }}
            >
              <ThemedText
                style={{ fontSize: 10, color: "#166534", fontWeight: "bold" }}
              >
                50% OFF
              </ThemedText>
            </View>
          </View>
        </TouchableOpacity>

        {/* Buy Button */}
        <TouchableOpacity
          style={[styles.buyBtn, { backgroundColor: activeColors.secondary }]}
        >
          <ThemedText
            style={{ color: "#FFF", fontWeight: "bold", fontSize: 18 }}
          >
            Buy Pass Now
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  hero: {
    alignItems: "center",
    padding: 30,
    borderRadius: 20,
    marginBottom: 30,
  },
  features: { marginBottom: 30, paddingHorizontal: 10, gap: 15 },
  featureRow: { flexDirection: "row", alignItems: "center" },
  planCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 20,
    backgroundColor: "rgba(255, 159, 28, 0.05)",
  },
  buyBtn: {
    height: 55,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 5,
  },
});
