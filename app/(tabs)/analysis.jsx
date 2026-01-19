import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Import Router
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

// Mock Data for History
const RECENT_ATTEMPTS = [
  {
    id: "1",
    title: "SSC CGL Tier I - Full Mock",
    score: "85/100",
    accuracy: "90%",
    date: "2 Oct, 2023",
  },
  {
    id: "2",
    title: "SBI PO Prelims Mock 3",
    score: "62/100",
    accuracy: "75%",
    date: "1 Oct, 2023",
  },
  {
    id: "3",
    title: "RRB NTPC Gen. Awareness",
    score: "40/50",
    accuracy: "88%",
    date: "28 Sep, 2023",
  },
];

export default function AnalysisScreen() {
  const router = useRouter(); // Initialize Router
  const { activeColors, isDark } = useTheme();

  // 1. Stat Box Component
  const StatBox = ({ label, value, icon, color }) => (
    <View
      style={[
        styles.statBox,
        {
          backgroundColor: isDark ? activeColors.card : "#FFF",
          borderColor: activeColors.border,
        },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View>
        <ThemedText style={{ fontSize: 22, fontWeight: "bold" }}>
          {value}
        </ThemedText>
        <ThemedText variant="caption">{label}</ThemedText>
      </View>
    </View>
  );

  // 2. History Item Component
  const AttemptCard = ({ item }) => (
    <View
      style={[
        styles.historyCard,
        {
          backgroundColor: isDark ? activeColors.card : "#FFF",
          borderColor: activeColors.border,
        },
      ]}
    >
      {/* Test Title & Date */}
      <View style={styles.historyHeader}>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.historyTitle}>{item.title}</ThemedText>
          <ThemedText variant="caption">{item.date}</ThemedText>
        </View>
        <View
          style={[styles.scoreBadge, { backgroundColor: activeColors.inputBg }]}
        >
          <ThemedText
            style={{ fontWeight: "bold", color: activeColors.primary }}
          >
            {item.score}
          </ThemedText>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Footer Actions */}
      <View style={styles.historyFooter}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="disc" size={16} color={activeColors.success} />
          <ThemedText variant="caption" style={{ marginLeft: 5 }}>
            Acc: {item.accuracy}
          </ThemedText>
        </View>

        {/* VIEW SOLUTIONS BUTTON */}
        <TouchableOpacity
          style={[styles.solutionBtn, { borderColor: activeColors.secondary }]}
          onPress={() => router.push(`/solutions/${item.id}`)} // Navigate to Solutions
        >
          <ThemedText
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: activeColors.secondary,
            }}
          >
            View Solutions
          </ThemedText>
          <Ionicons
            name="arrow-forward"
            size={14}
            color={activeColors.secondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ThemedScreen edges={["left", "right", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText variant="title" style={{ marginBottom: 20 }}>
          Your Performance
        </ThemedText>

        {/* Top Stats Grid */}
        <View style={styles.grid}>
          <StatBox
            label="Tests Taken"
            value="42"
            icon="document-text"
            color="#3B82F6"
          />
          <StatBox
            label="Avg Score"
            value="78%"
            icon="trophy"
            color="#F59E0B"
          />
          <StatBox label="Accuracy" value="85%" icon="disc" color="#10B981" />
          <StatBox label="Time/Ques" value="45s" icon="time" color="#EF4444" />
        </View>

        {/* Weekly Chart */}
        <View
          style={[
            styles.chartCard,
            { backgroundColor: isDark ? activeColors.card : "#FFF" },
          ]}
        >
          <ThemedText variant="subtitle" style={{ marginBottom: 15 }}>
            Weekly Progress
          </ThemedText>
          <View style={styles.chartArea}>
            {[40, 60, 35, 80, 55, 90, 70].map((h, i) => (
              <View key={i} style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${h}%`,
                      backgroundColor: activeColors.secondary,
                    },
                  ]}
                />
                <ThemedText variant="caption" style={{ marginTop: 5 }}>
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Attempts Section */}
        <View style={styles.sectionHeader}>
          <ThemedText variant="subtitle">Recent Attempts</ThemedText>
          <TouchableOpacity onPress={() => router.push("/history")}>
            <ThemedText variant="link">View All</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.historyList}>
          {RECENT_ATTEMPTS.map((attempt) => (
            <AttemptCard key={attempt.id} item={attempt} />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 20 },

  // Stats Grid
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 15, marginBottom: 25 },
  statBox: {
    width: "47%",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  // Chart
  chartCard: { padding: 20, borderRadius: 20, elevation: 2, marginBottom: 30 },
  chartArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 150,
    alignItems: "flex-end",
  },
  barContainer: { alignItems: "center", width: 20 },
  bar: { width: 8, borderRadius: 4 },

  // History Section
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  historyList: { gap: 12 },

  // History Card
  historyCard: { borderRadius: 16, borderWidth: 1, padding: 16 },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  historyTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  scoreBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
    opacity: 0.5,
  },
  historyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  solutionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
});
