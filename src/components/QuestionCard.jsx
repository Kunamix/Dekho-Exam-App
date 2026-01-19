import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { ThemedText } from "./ThemedText";

export default function QuestionCard({ data, selectedOption, onSelect }) {
  const { activeColors, isDark } = useTheme();

  return (
    <View>
      {/* Question Text */}
      <ThemedText style={styles.questionText}>{data.question}</ThemedText>

      {/* Options List */}
      <View style={styles.optionsContainer}>
        {data.options.map((option, index) => {
          const isSelected = selectedOption === index;

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => onSelect(index)}
              style={[
                styles.optionBtn,
                {
                  backgroundColor: isSelected
                    ? activeColors.secondary
                    : isDark
                      ? activeColors.inputBg
                      : "#FFF",
                  borderColor: isSelected
                    ? activeColors.secondary
                    : activeColors.border,
                },
              ]}
            >
              {/* Option Circle (A, B, C, D) */}
              <View
                style={[
                  styles.optionCircle,
                  {
                    borderColor: isSelected
                      ? "#FFF"
                      : activeColors.textSecondary,
                    backgroundColor: isSelected
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                  },
                ]}
              >
                <ThemedText
                  style={{
                    color: isSelected ? "#FFF" : activeColors.textSecondary,
                    fontWeight: "bold",
                  }}
                >
                  {String.fromCharCode(65 + index)}
                </ThemedText>
              </View>

              {/* Option Text */}
              <ThemedText
                style={[
                  styles.optionText,
                  { color: isSelected ? "#FFF" : activeColors.text },
                ]}
              >
                {option}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  questionText: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 25,
    lineHeight: 28,
  },
  optionsContainer: { gap: 15 },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    // Soft Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  optionText: { fontSize: 16, fontWeight: "500" },
});
