import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

export default function ResultScreen() {
  const router = useRouter();
  const { activeColors, isDark } = useTheme();

  return (
    <ThemedScreen>
      <View style={styles.container}>
        {/* Success Icon */}
        <Ionicons
          name="checkmark-circle"
          size={80}
          color={activeColors.success}
          style={{ marginBottom: 20 }}
        />
        <ThemedText variant="title">Test Submitted!</ThemedText>
        <ThemedText variant="subtitle" style={{ marginBottom: 40 }}>
          Score: 18/25
        </ThemedText>

        {/* Stats Grid */}
        <View
          style={[
            styles.statsCard,
            {
              backgroundColor: isDark ? activeColors.card : "#FFF",
              borderColor: activeColors.border,
            },
          ]}
        >
          <View style={styles.statRow}>
            <ThemedText>Correct</ThemedText>
            <ThemedText
              style={{ color: activeColors.success, fontWeight: "bold" }}
            >
              18
            </ThemedText>
          </View>
          <View
            style={[
              styles.statRow,
              {
                borderTopWidth: 1,
                borderTopColor: activeColors.border,
                paddingTop: 10,
                marginTop: 10,
              },
            ]}
          >
            <ThemedText>Incorrect</ThemedText>
            <ThemedText
              style={{ color: activeColors.error, fontWeight: "bold" }}
            >
              5
            </ThemedText>
          </View>
          <View
            style={[
              styles.statRow,
              {
                borderTopWidth: 1,
                borderTopColor: activeColors.border,
                paddingTop: 10,
                marginTop: 10,
              },
            ]}
          >
            <ThemedText>Skipped</ThemedText>
            <ThemedText
              style={{ color: activeColors.textSecondary, fontWeight: "bold" }}
            >
              2
            </ThemedText>
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: activeColors.primary }]}
          onPress={() => router.push("/(tabs)/analysis")}
        >
          <ThemedText style={{ color: "#FFF", fontWeight: "bold" }}>
            View Solutions
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: activeColors.text,
            },
          ]}
          onPress={() => router.replace("/(tabs)/tests")}
        >
          <ThemedText style={{ color: activeColors.text, fontWeight: "bold" }}>
            Back to Tests
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  statsCard: {
    width: "80%",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 40,
  },
  statRow: { flexDirection: "row", justifyContent: "space-between" },
  btn: {
    width: "80%",
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
});
