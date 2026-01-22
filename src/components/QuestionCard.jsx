import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";

export default function QuestionCard({ question, selectedOption, onSelect }) {
  // 🛑 HARD GUARD (CRITICAL)
  if (!question) {
    return (
      <View style={styles.center}>
        <ThemedText style={{ opacity: 0.6 }}>Question not available</ThemedText>
      </View>
    );
  }

  const options = [
    question.option1,
    question.option2,
    question.option3,
    question.option4,
  ];

  return (
    <View style={styles.container}>
      {/* QUESTION */}
      <ThemedText style={styles.questionText}>
        {question.questionText}
      </ThemedText>

      {/* OPTIONS */}
      {options.map((opt, index) => {
        if (!opt) return null;

        const optionIndex = index + 1;
        const isSelected = selectedOption === optionIndex;

        return (
          <TouchableOpacity
            key={optionIndex}
            onPress={() => onSelect(optionIndex)}
            style={[styles.option, isSelected && styles.optionSelected]}
          >
            <Ionicons
              name={isSelected ? "radio-button-on" : "radio-button-off"}
              size={20}
              color={isSelected ? "#2563EB" : "#9CA3AF"}
            />
            <ThemedText style={styles.optionText}>{opt}</ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  container: {
    marginBottom: 30,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    lineHeight: 24,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },
  optionSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  optionText: {
    marginLeft: 10,
    flex: 1,
    lineHeight: 22,
  },
});
