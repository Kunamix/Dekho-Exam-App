import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

export default function SubscriptionScreen() {
  const router = useRouter();
  const { activeColors, isDark } = useTheme();

  // Mock Plan Data (Change isPro to true/false to see different states)
  const isPro = true;

  return (
    <ThemedScreen>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={activeColors.text} />
        </TouchableOpacity>
        <ThemedText variant="title" style={{ fontSize: 20 }}>
          My Subscription
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Current Plan Card */}
        <View
          style={[
            styles.planCard,
            {
              backgroundColor: isPro ? activeColors.primary : activeColors.card,
              borderColor: activeColors.border,
            },
          ]}
        >
          <View style={styles.planHeader}>
            <View>
              <ThemedText
                style={{
                  color: isPro ? "#FFF" : activeColors.text,
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {isPro ? "DekhoExam PRO" : "Free Plan"}
              </ThemedText>
              <ThemedText
                style={{
                  color: isPro
                    ? "rgba(255,255,255,0.8)"
                    : activeColors.textSecondary,
                  fontSize: 14,
                }}
              >
                {isPro
                  ? "Valid till 25 Oct, 2024"
                  : "Upgrade to unlock full access"}
              </ThemedText>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isPro ? "#FFD700" : activeColors.inputBg },
              ]}
            >
              <ThemedText
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: isPro ? "#000" : activeColors.text,
                }}
              >
                {isPro ? "ACTIVE" : "BASIC"}
              </ThemedText>
            </View>
          </View>

          {isPro && (
            <View style={styles.planDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="checkmark-circle" size={18} color="#FFF" />
                <ThemedText style={{ color: "#FFF", marginLeft: 8 }}>
                  All Tests Unlocked
                </ThemedText>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="checkmark-circle" size={18} color="#FFF" />
                <ThemedText style={{ color: "#FFF", marginLeft: 8 }}>
                  Ad-Free Experience
                </ThemedText>
              </View>
            </View>
          )}
        </View>

        {/* Upsell / Renewal Section */}
        <View style={styles.actionSection}>
          <ThemedText variant="subtitle" style={{ marginBottom: 10 }}>
            {isPro ? "Extend your plan" : "Why Upgrade?"}
          </ThemedText>

          <TouchableOpacity
            style={[styles.upgradeBtn, { borderColor: activeColors.secondary }]}
            onPress={() => router.push("/(tabs)/pass")}
          >
            <View>
              <ThemedText
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: activeColors.text,
                }}
              >
                {isPro ? "Renew Subscription" : "Get DekhoExam PRO"}
              </ThemedText>
              <ThemedText
                variant="caption"
                style={{ color: activeColors.secondary }}
              >
                Starts at ₹499/year
              </ThemedText>
            </View>
            <Ionicons
              name="arrow-forward-circle"
              size={32}
              color={activeColors.secondary}
            />
          </TouchableOpacity>
        </View>

        {/* Transaction History Mock */}
        <ThemedText
          variant="subtitle"
          style={{ marginTop: 30, marginBottom: 15 }}
        >
          Payment History
        </ThemedText>
        <View
          style={[
            styles.historyCard,
            {
              backgroundColor: isDark ? activeColors.card : "#FFF",
              borderColor: activeColors.border,
            },
          ]}
        >
          <View style={styles.historyRow}>
            <View>
              <ThemedText style={{ fontWeight: "600" }}>Annual Plan</ThemedText>
              <ThemedText variant="caption">25 Oct, 2023</ThemedText>
            </View>
            <ThemedText
              style={{ fontWeight: "bold", color: activeColors.success }}
            >
              ₹499
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backBtn: { padding: 4 },

  planCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 5,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  planDetails: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    gap: 8,
  },
  detailRow: { flexDirection: "row", alignItems: "center" },

  actionSection: { marginBottom: 10 },
  upgradeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
  },

  historyCard: { borderRadius: 16, borderWidth: 1, padding: 16 },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
