import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

// Import Custom Hook
import { useTestHistory } from "../../src/hooks/useStudentData";

export default function AnalysisScreen() {
  const router = useRouter();
  const { activeColors, isDark } = useTheme();

  // 1. Fetch Real Data
  const { data: history = [], loading, refetch } = useTestHistory();

  // 2. Calculate Stats from History
  const totalTests = history.length;
  const avgScore =
    totalTests > 0
      ? Math.round(
          history.reduce((acc, curr) => acc + (curr.percentage || 0), 0) /
            totalTests,
        )
      : 0;
  const avgAccuracy =
    totalTests > 0
      ? Math.round(
          history.reduce((acc, curr) => acc + (curr.accuracy || 0), 0) /
            totalTests,
        )
      : 0;

  // 3. Stat Box Component
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

  // 4. History Item Component
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
          <ThemedText style={styles.historyTitle} numberOfLines={1}>
            {item.testName}
          </ThemedText>
          <ThemedText variant="caption">
            {new Date(item.submittedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </ThemedText>
        </View>
        <View
          style={[styles.scoreBadge, { backgroundColor: activeColors.inputBg }]}
        >
          <ThemedText
            style={{ fontWeight: "bold", color: activeColors.primary }}
          >
            {item.percentage}%
          </ThemedText>
        </View>
      </View>

      <View
        style={[styles.divider, { backgroundColor: activeColors.border }]}
      />

      {/* Footer Actions */}
      <View style={styles.historyFooter}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="disc" size={16} color={activeColors.success} />
          <ThemedText variant="caption" style={{ marginLeft: 5 }}>
            Acc: {item.accuracy}%
          </ThemedText>
        </View>

        {/* VIEW SOLUTIONS BUTTON */}
        <TouchableOpacity
          style={[styles.solutionBtn, { borderColor: activeColors.secondary }]}
          onPress={() => router.push(`/solutions/${item.attemptId}`)}
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
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
        <ThemedText variant="title" style={{ marginBottom: 20 }}>
          Your Performance
        </ThemedText>

        {/* Top Stats Grid */}
        <View style={styles.grid}>
          <StatBox
            label="Tests Taken"
            value={totalTests.toString()}
            icon="document-text"
            color="#3B82F6"
          />
          <StatBox
            label="Avg Score"
            value={`${avgScore}%`}
            icon="trophy"
            color="#F59E0B"
          />
          <StatBox
            label="Accuracy"
            value={`${avgAccuracy}%`}
            icon="disc"
            color="#10B981"
          />
          <StatBox label="Best Rank" value="#1" icon="ribbon" color="#EF4444" />
        </View>

        {/* Weekly Chart (Static for now, dynamic logic is complex without a library) */}
        <View
          style={[
            styles.chartCard,
            { backgroundColor: isDark ? activeColors.card : "#FFF" },
          ]}
        >
          <ThemedText variant="subtitle" style={{ marginBottom: 15 }}>
            Last 7 Attempts
          </ThemedText>
          <View style={styles.chartArea}>
            {/* Map last 7 history items or fill with dummy if empty */}
            {(history.length > 0
              ? history.slice(0, 7)
              : [0, 0, 0, 0, 0, 0, 0]
            ).map((h, i) => (
              <View key={i} style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${typeof h === "number" ? h : h.percentage || 10}%`, // Safe height
                      backgroundColor: activeColors.secondary,
                      opacity: typeof h === "number" ? 0.3 : 1,
                    },
                  ]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Recent Attempts Section */}
        <View style={styles.sectionHeader}>
          <ThemedText variant="subtitle">Recent Attempts</ThemedText>
        </View>

        {loading && history.length === 0 ? (
          <ActivityIndicator size="small" color={activeColors.primary} />
        ) : (
          <View style={styles.historyList}>
            {history.length === 0 ? (
              <ThemedText
                style={{ textAlign: "center", marginTop: 20, opacity: 0.5 }}
              >
                No tests attempted yet.
              </ThemedText>
            ) : (
              history.map((attempt) => (
                <AttemptCard key={attempt.attemptId} item={attempt} />
              ))
            )}
          </View>
        )}

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
  barContainer: {
    alignItems: "center",
    width: 20,
    height: "100%",
    justifyContent: "flex-end",
  },
  bar: { width: 8, borderRadius: 4, minHeight: 4 },

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
