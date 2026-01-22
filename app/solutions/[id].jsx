import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";
import { useTestSolutions } from "../../src/hooks/useTestSolutions";

const FILTERS = ["All", "Correct", "Incorrect", "Skipped"];

export default function SolutionsScreen() {
  const router = useRouter();

  // ✅ FIX: The file is named [id].jsx, so the param is 'id'
  const { id } = useLocalSearchParams();

  const { activeColors, isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");

  // ✅ Pass 'id' as the attemptId
  const { loading, summary, questions, error } = useTestSolutions(id);

  // Filter Logic ...
  const filteredQuestions = questions.filter((q) => {
    const status = q.status?.toUpperCase() || "UNATTEMPTED";
    if (activeFilter === "All") return true;
    if (activeFilter === "Correct") return status === "CORRECT";
    if (activeFilter === "Incorrect") return status === "INCORRECT";
    if (activeFilter === "Skipped") return status === "UNATTEMPTED";
    return true;
  });

  if (loading) {
    return (
      <ThemedScreen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={activeColors.primary} />
          <ThemedText style={{ marginTop: 10 }}>
            Loading Solutions...
          </ThemedText>
        </View>
      </ThemedScreen>
    );
  }

  return (
    <ThemedScreen edges={["top", "left", "right"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color={activeColors.text} />
        </TouchableOpacity>
        <ThemedText variant="subtitle">Solutions</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      {/* SCORE SUMMARY
      {summary && (
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: isDark ? activeColors.card : "#F3F4F6" },
          ]}
        >
          <View style={styles.summaryItem}>
            <ThemedText
              style={[styles.summaryLabel, { color: activeColors.success }]}
            >
              Correct
            </ThemedText>
            <ThemedText style={styles.summaryValue}>
              {summary.correct || 0}
            </ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <ThemedText
              style={[styles.summaryLabel, { color: activeColors.error }]}
            >
              Wrong
            </ThemedText>
            <ThemedText style={styles.summaryValue}>
              {summary.incorrect || 0}
            </ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Score</ThemedText>
            <ThemedText style={styles.summaryValue}>
              {summary.score || 0}
            </ThemedText>
          </View>
        </View>
      )} */}

      {/* FILTERS */}
      <View style={{ height: 50 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    activeFilter === f
                      ? activeColors.secondary
                      : isDark
                        ? activeColors.card
                        : "#E5E7EB",
                },
              ]}
            >
              <ThemedText
                style={{
                  color: activeFilter === f ? "#FFF" : activeColors.text,
                  fontWeight: "600",
                  fontSize: 13,
                }}
              >
                {f}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* QUESTIONS LIST */}
      <FlatList
        data={filteredQuestions}
        keyExtractor={(item, index) => item.questionId || index.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: isDark ? activeColors.card : "#FFF",
                borderColor: activeColors.border,
              },
            ]}
          >
            <View style={styles.questionHeader}>
              <View style={styles.qBadge}>
                <ThemedText style={{ fontSize: 12, fontWeight: "700" }}>
                  Q{index + 1}
                </ThemedText>
              </View>
              <ThemedText style={styles.questionText}>
                {item.questionText}
              </ThemedText>
            </View>

            <View style={styles.optionsList}>
              {item.options.map((opt, idx) => {
                const optionIndex = idx + 1;
                const isCorrectAnswer = optionIndex === item.correctOption;
                const isUserSelected = optionIndex === item.userSelectedOption;

                let borderStyle = {
                  borderColor: activeColors.border,
                  backgroundColor: "transparent",
                };
                let iconName = "ellipse-outline";
                let iconColor = activeColors.textSecondary;

                if (isCorrectAnswer) {
                  borderStyle = {
                    borderColor: activeColors.success,
                    backgroundColor: isDark
                      ? "rgba(34, 197, 94, 0.1)"
                      : "#DCFCE7",
                  };
                  iconName = "checkmark-circle";
                  iconColor = activeColors.success;
                } else if (isUserSelected && !isCorrectAnswer) {
                  borderStyle = {
                    borderColor: activeColors.error,
                    backgroundColor: isDark
                      ? "rgba(239, 68, 68, 0.1)"
                      : "#FEE2E2",
                  };
                  iconName = "close-circle";
                  iconColor = activeColors.error;
                }

                return (
                  <View key={idx} style={[styles.optionBox, borderStyle]}>
                    <Ionicons
                      name={iconName}
                      size={20}
                      color={iconColor}
                      style={{ marginRight: 10 }}
                    />
                    <ThemedText style={{ flex: 1, fontSize: 14 }}>
                      {opt}
                    </ThemedText>
                  </View>
                );
              })}
            </View>

            {item.explanation && (
              <View
                style={[
                  styles.explanationBox,
                  { backgroundColor: isDark ? "#1F2937" : "#F3F4F6" },
                ]}
              >
                <ThemedText
                  style={{ fontWeight: "700", marginBottom: 4, fontSize: 13 }}
                >
                  Explanation:
                </ThemedText>
                <ThemedText
                  style={{ fontSize: 13, lineHeight: 20, opacity: 0.8 }}
                >
                  {item.explanation}
                </ThemedText>
              </View>
            )}
          </View>
        )}
      />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  summaryCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    marginHorizontal: 16,
    marginBottom: 15,
    borderRadius: 12,
  },
  summaryItem: { alignItems: "center" },
  summaryLabel: { fontSize: 12, fontWeight: "600", marginBottom: 4 },
  summaryValue: { fontSize: 18, fontWeight: "800" },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    height: 36,
    justifyContent: "center",
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 40 },
  card: { borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1 },
  questionHeader: { flexDirection: "row", marginBottom: 16, gap: 10 },
  qBadge: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    height: 24,
    justifyContent: "center",
  },
  questionText: { fontSize: 16, fontWeight: "600", lineHeight: 24, flex: 1 },
  optionsList: { gap: 10, marginBottom: 16 },
  optionBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  explanationBox: { padding: 12, borderRadius: 10 },
});
