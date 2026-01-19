import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

// Components & Context
import { useTheme } from "../../context/ThemeContext";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

// Mock Solution Data
const MOCK_SOLUTIONS = [
  {
    id: 1,
    question: "If A + B = 10 and A - B = 4, find the value of A * B.",
    options: ["16", "21", "24", "20"],
    correctOption: 1, // Index 1 -> "21"
    userSelected: 1, // User chose Correct
    explanation:
      "Add both equations: 2A = 14 => A = 7. Put A in eq1: 7 + B = 10 => B = 3. Therefore A*B = 7*3 = 21.",
  },
  {
    id: 2,
    question: "Which number completes the series? 2, 5, 10, 17, ...",
    options: ["24", "26", "25", "27"],
    correctOption: 1, // Index 1 -> "26"
    userSelected: 0, // User chose Wrong ("24")
    explanation:
      "The pattern is n^2 + 1. (1^2+1=2), (2^2+1=5)... so (5^2+1 = 26).",
  },
  {
    id: 3,
    question:
      "A train running at 60km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: ["120m", "150m", "180m", "324m"],
    correctOption: 1, // Index 1 -> "150m"
    userSelected: null, // User Skipped
    explanation:
      "Speed = 60*(5/18) = 50/3 m/s. Distance = Speed × Time = (50/3) * 9 = 150m.",
  },
];

const FILTERS = ["All", "Incorrect", "Correct", "Skipped"];

export default function SolutionsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { activeColors, isDark } = useTheme();

  const [activeFilter, setActiveFilter] = useState("All");

  // Logic to Filter Questions
  const filteredQuestions = MOCK_SOLUTIONS.filter((q) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Correct") return q.userSelected === q.correctOption;
    if (activeFilter === "Incorrect")
      return q.userSelected !== null && q.userSelected !== q.correctOption;
    if (activeFilter === "Skipped") return q.userSelected === null;
    return true;
  });

  // Render a Single Question Card
  const renderQuestionItem = ({ item, index }) => {
    const isSkipped = item.userSelected === null;
    const isCorrect = item.userSelected === item.correctOption;
    const isWrong = !isSkipped && !isCorrect;

    // Status Badge Logic
    let statusColor = activeColors.textSecondary;
    let statusText = "Skipped";
    let statusIcon = "remove-circle-outline";

    if (isCorrect) {
      statusColor = activeColors.success;
      statusText = "Correct";
      statusIcon = "checkmark-circle";
    } else if (isWrong) {
      statusColor = activeColors.error;
      statusText = "Wrong";
      statusIcon = "close-circle";
    }

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? activeColors.card : "#FFF",
            borderColor: activeColors.border,
          },
        ]}
      >
        {/* Question Header */}
        <View style={styles.cardHeader}>
          <View style={styles.qNumber}>
            <ThemedText style={{ fontWeight: "bold", fontSize: 14 }}>
              Q{index + 1}
            </ThemedText>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor + "20" },
            ]}
          >
            <Ionicons name={statusIcon} size={16} color={statusColor} />
            <ThemedText
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: statusColor,
                marginLeft: 4,
              }}
            >
              {statusText}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.questionText}>{item.question}</ThemedText>

        {/* Options */}
        <View style={styles.optionsList}>
          {item.options.map((opt, idx) => {
            // Determine Styling for each option
            let borderColor = activeColors.border;
            let bgColor = "transparent";
            let icon = null;

            // 1. If this option is the CORRECT ANSWER -> Always Green
            if (idx === item.correctOption) {
              borderColor = activeColors.success;
              bgColor = isDark ? "rgba(16, 185, 129, 0.15)" : "#DCFCE7";
              icon = "checkmark-circle";
            }
            // 2. If this option was WRONGLY SELECTED -> Red
            else if (idx === item.userSelected) {
              borderColor = activeColors.error;
              bgColor = isDark ? "rgba(239, 68, 68, 0.15)" : "#FEE2E2";
              icon = "close-circle";
            }

            return (
              <View
                key={idx}
                style={[
                  styles.optionBox,
                  { borderColor, backgroundColor: bgColor },
                ]}
              >
                <ThemedText style={{ flex: 1, color: activeColors.text }}>
                  {opt}
                </ThemedText>
                {icon && <Ionicons name={icon} size={20} color={borderColor} />}
              </View>
            );
          })}
        </View>

        {/* Explanation Section */}
        <View
          style={[
            styles.explanationBox,
            { backgroundColor: activeColors.inputBg },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Ionicons name="bulb" size={18} color={activeColors.secondary} />
            <ThemedText
              style={{
                fontWeight: "bold",
                marginLeft: 5,
                color: activeColors.secondary,
              }}
            >
              Explanation:
            </ThemedText>
          </View>
          <ThemedText variant="caption" style={{ color: activeColors.text }}>
            {item.explanation}
          </ThemedText>
        </View>
      </View>
    );
  };

  return (
    <ThemedScreen>
      {/* Top Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={activeColors.text} />
        </TouchableOpacity>
        <ThemedText variant="title" style={{ fontSize: 20 }}>
          Solutions
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    activeFilter === filter
                      ? activeColors.secondary
                      : isDark
                        ? activeColors.card
                        : "#F3F4F6",
                  borderWidth: 1,
                  borderColor:
                    activeFilter === filter
                      ? activeColors.secondary
                      : "transparent",
                },
              ]}
            >
              <ThemedText
                style={{
                  color: activeFilter === filter ? "#FFF" : activeColors.text,
                  fontWeight: "600",
                  fontSize: 13,
                }}
              >
                {filter}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Solutions List */}
      <FlatList
        data={filteredQuestions}
        renderItem={renderQuestionItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  backBtn: { padding: 5 },
  filterContainer: { marginBottom: 15, height: 40 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  listContent: { paddingBottom: 30 },

  // Card Styles
  card: { borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  qNumber: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#E0F2FE",
    borderRadius: 6,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    lineHeight: 24,
  },

  // Options
  optionsList: { gap: 10, marginBottom: 15 },
  optionBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
  },

  // Explanation
  explanationBox: { padding: 12, borderRadius: 10 },
});
