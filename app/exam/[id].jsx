import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

// Components & Context
import { useTheme } from "../../context/ThemeContext";
import QuestionCard from "../../src/components/QuestionCard"; // Make sure this exists (code below)
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

// Hooks
import {
  useActiveExam,
  useTestInstructions,
} from "../../src/hooks/useTestEngine";

export default function ExamScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Test ID
  const { activeColors, isDark } = useTheme();

  // 1. Hooks
  const { data: instructions, loading: loadingInstructions } =
    useTestInstructions(id);
  const {
    loading: loadingExam,
    questions,
    timeLeft: serverTimeLeft,
    answers,
    initExam,
    markAnswer,
    submitExam,
  } = useActiveExam(id);

  // 2. Local State
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timer, setTimer] = useState(0); // Local timer in seconds

  // 3. Sync Timer with Server Time on Load
  useEffect(() => {
    if (serverTimeLeft > 0) {
      setTimer(serverTimeLeft);
    }
  }, [serverTimeLeft]);

  // 4. Countdown Logic
  useEffect(() => {
    if (!showInstructions && !loadingExam && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmitTest(true); // Auto-submit
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showInstructions, loadingExam, timer]);

  // 5. Prevent Back Button
  useEffect(() => {
    const backAction = () => {
      if (!showInstructions) {
        Alert.alert(
          "Quit Exam?",
          "Your progress will be lost (or saved if resumed later).",
          [
            { text: "Cancel", onPress: () => null, style: "cancel" },
            { text: "Quit", onPress: () => router.back() },
          ],
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => backHandler.remove();
  }, [showInstructions]);

  // Handlers
  const handleStartExam = async () => {
    await initExam(); // Call API to start/resume attempt
    setShowInstructions(false);
  };

  const handleSelectOption = (optionIndex) => {
    const currentQ = questions[currentQIndex];
    if (currentQ) {
      markAnswer(currentQ.id, optionIndex); // 1-based index passed to hook
    }
  };

  const handleSubmitTest = (autoSubmit = false) => {
    if (autoSubmit) {
      submitExam();
    } else {
      Alert.alert("Finish Test?", "Are you sure you want to submit?", [
        { text: "Cancel", style: "cancel" },
        { text: "Submit", onPress: () => submitExam() },
      ]);
    }
  };

  // Format Timer
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // --- RENDERING ---

  // Loading State
  if (loadingInstructions && showInstructions) {
    return (
      <ThemedScreen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={activeColors.primary} />
        </View>
      </ThemedScreen>
    );
  }

  return (
    <ThemedScreen>
      {/* 1. HEADER (Timer & Close) */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => BackHandler.exitApp()}
          style={{ padding: 4 }}
        >
          {/* We discourage closing via cross, prefer Finish button */}
        </TouchableOpacity>

        <View
          style={[
            styles.timerBadge,
            { backgroundColor: timer < 60 ? "#FEE2E2" : activeColors.inputBg },
          ]}
        >
          <Ionicons
            name="time-outline"
            size={18}
            color={timer < 60 ? activeColors.error : activeColors.text}
          />
          <ThemedText
            style={{
              marginLeft: 6,
              fontWeight: "700",
              color: timer < 60 ? activeColors.error : activeColors.text,
              fontVariant: ["tabular-nums"],
            }}
          >
            {formatTime(timer)}
          </ThemedText>
        </View>

        <TouchableOpacity onPress={() => handleSubmitTest(false)}>
          <ThemedText
            style={{ color: activeColors.primary, fontWeight: "bold" }}
          >
            Submit
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* 2. PROGRESS BAR */}
      <View
        style={[styles.progressBarBg, { backgroundColor: activeColors.border }]}
      >
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${questions.length > 0 ? ((currentQIndex + 1) / questions.length) * 100 : 0}%`,
              backgroundColor: activeColors.secondary,
            },
          ]}
        />
      </View>

      {/* 3. QUESTION AREA */}
      {loadingExam ? (
        <View style={styles.center}>
          <ActivityIndicator color={activeColors.primary} />
        </View>
      ) : questions.length > 0 ? (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.questionMeta}>
            <ThemedText variant="caption" style={{ fontWeight: "600" }}>
              Question {currentQIndex + 1} of {questions.length}
            </ThemedText>
            <ThemedText
              variant="caption"
              style={{ color: activeColors.textSecondary }}
            >
              Marks: +{instructions?.positiveMarks || 1}, -
              {instructions?.negativeMarks || 0.25}
            </ThemedText>
          </View>

          <QuestionCard
            question={questions[currentQIndex]}
            selectedOption={answers[questions[currentQIndex].id] || null}
            onSelect={handleSelectOption}
          />
        </ScrollView>
      ) : (
        <View style={styles.center}>
          <ThemedText>No questions found.</ThemedText>
        </View>
      )}

      {/* 4. FOOTER NAV */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: activeColors.card,
            borderTopColor: activeColors.border,
          },
        ]}
      >
        <TouchableOpacity
          disabled={currentQIndex === 0}
          onPress={() => setCurrentQIndex((p) => p - 1)}
          style={[styles.navBtn, { opacity: currentQIndex === 0 ? 0.3 : 1 }]}
        >
          <Ionicons name="chevron-back" size={20} color={activeColors.text} />
          <ThemedText style={{ fontWeight: "600" }}>Prev</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setAnswers((prev) => {
              // Clear selection logic if needed, or implement "Mark for Review"
              return prev;
            })
          }
        >
          {/* Optional: Center button for Review Tag */}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (currentQIndex < questions.length - 1) {
              setCurrentQIndex((p) => p + 1);
            } else {
              handleSubmitTest(false);
            }
          }}
          style={[styles.nextBtn, { backgroundColor: activeColors.primary }]}
        >
          <ThemedText style={{ color: "#FFF", fontWeight: "bold" }}>
            {currentQIndex === questions.length - 1 ? "Finish" : "Next"}
          </ThemedText>
          <Ionicons name="chevron-forward" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* ================= INSTRUCTIONS MODAL ================= */}
      <Modal
        visible={showInstructions}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {}}
      >
        <ThemedScreen>
          <View style={{ flex: 1, padding: 20 }}>
            <ThemedText
              variant="title"
              style={{ marginBottom: 10, fontSize: 22 }}
            >
              Instructions
            </ThemedText>
            <ThemedText style={{ opacity: 0.7, marginBottom: 20 }}>
              Please read carefully before starting.
            </ThemedText>

            <View
              style={[
                styles.infoCard,
                { backgroundColor: isDark ? activeColors.card : "#F3F4F6" },
              ]}
            >
              <View style={styles.infoRow}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={activeColors.primary}
                />
                <ThemedText style={{ marginLeft: 10 }}>
                  {instructions?.totalQuestions || 0} Questions
                </ThemedText>
              </View>
              <View style={styles.infoRow}>
                <Ionicons
                  name="timer-outline"
                  size={20}
                  color={activeColors.primary}
                />
                <ThemedText style={{ marginLeft: 10 }}>
                  {instructions?.durationMinutes || 0} Minutes
                </ThemedText>
              </View>
              <View style={styles.infoRow}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={activeColors.success}
                />
                <ThemedText style={{ marginLeft: 10 }}>
                  Correct: +{instructions?.positiveMarks}
                </ThemedText>
              </View>
              <View style={styles.infoRow}>
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color={activeColors.error}
                />
                <ThemedText style={{ marginLeft: 10 }}>
                  Wrong: -{instructions?.negativeMarks}
                </ThemedText>
              </View>
            </View>

            <ScrollView style={{ flex: 1, marginTop: 20 }}>
              <ThemedText style={styles.ruleText}>
                1. The clock will be set at the server. The countdown timer in
                the top right corner of screen will display the time remaining
                for you to complete the exam.
              </ThemedText>
              <ThemedText style={styles.ruleText}>
                2. Use "Next" and "Prev" buttons to navigate between questions.
              </ThemedText>
              <ThemedText style={styles.ruleText}>
                3. You can change your answer any time before submitting.
              </ThemedText>
              <ThemedText style={styles.ruleText}>
                4. The test will auto-submit when the timer reaches zero.
              </ThemedText>
              <ThemedText style={styles.ruleText}>
                5. Don't close the app or switch tabs frequently.
              </ThemedText>
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.startBtn,
                { backgroundColor: activeColors.primary },
              ]}
              onPress={handleStartExam}
            >
              <ThemedText style={styles.startBtnText}>
                I am ready to begin
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedScreen>
      </Modal>
    </ThemedScreen>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 4,
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
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
  questionMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 4,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    elevation: 10,
  },
  navBtn: { flexDirection: "row", alignItems: "center", gap: 5, padding: 10 },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },

  /* Instructions Modal Styles */
  infoCard: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ruleText: {
    marginBottom: 12,
    lineHeight: 22,
    opacity: 0.8,
  },
  startBtn: {
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 10,
  },
  startBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
