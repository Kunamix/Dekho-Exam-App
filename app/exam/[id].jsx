import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

// Components
import { useTheme } from "../../context/ThemeContext";
import QuestionCard from "../../src/components/QuestionCard"; // We will create this below
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

// Mock Question Data
const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "If A + B = 10 and A - B = 4, find the value of A * B.",
    options: ["16", "21", "24", "20"],
    correct: 1, // Index of correct answer
  },
  {
    id: 2,
    question: "Which number completes the series? 2, 5, 10, 17, ...",
    options: ["24", "26", "25", "27"],
    correct: 1,
  },
  {
    id: 3,
    question:
      "A train running at 60km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: ["120m", "150m", "180m", "324m"],
    correct: 1,
  },
];

export default function ExamScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { activeColors, isDark } = useTheme();

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { 1: 0, 2: null }
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  // Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Time (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSelectOption = (optionIndex) => {
    setAnswers({ ...answers, [currentQIndex]: optionIndex });
  };

  const handleSubmit = () => {
    Alert.alert("Submit Test?", "Are you sure you want to finish?", [
      { text: "Cancel", style: "cancel" },
      { text: "Submit", onPress: () => router.replace(`/result/${id}`) },
    ]);
  };

  return (
    <ThemedScreen>
      {/* 1. Header with Timer */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={activeColors.text} />
        </TouchableOpacity>

        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={18} color={activeColors.error} />
          <ThemedText
            style={{
              color: activeColors.error,
              fontWeight: "bold",
              marginLeft: 5,
            }}
          >
            {formatTime(timeLeft)}
          </ThemedText>
        </View>

        <TouchableOpacity onPress={handleSubmit}>
          <ThemedText
            style={{ color: activeColors.primary, fontWeight: "bold" }}
          >
            Submit
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* 2. Progress Bar */}
      <View
        style={[styles.progressBarBg, { backgroundColor: activeColors.border }]}
      >
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${((currentQIndex + 1) / MOCK_QUESTIONS.length) * 100}%`,
              backgroundColor: activeColors.secondary,
            },
          ]}
        />
      </View>

      {/* 3. Question Card */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.questionCounter}>
          <ThemedText variant="caption">
            Question {currentQIndex + 1}/{MOCK_QUESTIONS.length}
          </ThemedText>
        </View>

        <QuestionCard
          data={MOCK_QUESTIONS[currentQIndex]}
          selectedOption={answers[currentQIndex]}
          onSelect={handleSelectOption}
        />
      </ScrollView>

      {/* 4. Bottom Navigation */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: activeColors.card,
            borderTopColor: activeColors.border,
          },
        ]}
      >
        <TouchableOpacity
          disabled={currentQIndex === 0}
          onPress={() => setCurrentQIndex((prev) => prev - 1)}
          style={[styles.navBtn, { opacity: currentQIndex === 0 ? 0.5 : 1 }]}
        >
          <Ionicons name="chevron-back" size={20} color={activeColors.text} />
          <ThemedText>Prev</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (currentQIndex < MOCK_QUESTIONS.length - 1) {
              setCurrentQIndex((prev) => prev + 1);
            } else {
              handleSubmit();
            }
          }}
          style={[styles.nextBtn, { backgroundColor: activeColors.primary }]}
        >
          <ThemedText style={{ color: "#FFF", fontWeight: "bold" }}>
            {currentQIndex === MOCK_QUESTIONS.length - 1 ? "Finish" : "Next"}
          </ThemedText>
          <Ionicons name="chevron-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
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
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  progressBarBg: {
    height: 4,
    width: "100%",
    borderRadius: 2,
    marginBottom: 20,
  },
  progressBarFill: { height: "100%", borderRadius: 2 },
  content: { paddingBottom: 100 },
  questionCounter: { marginBottom: 10 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
  },
  navBtn: { flexDirection: "row", alignItems: "center", gap: 5 },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
});
