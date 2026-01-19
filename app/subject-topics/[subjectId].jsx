import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

// Components
import { useTheme } from "../../context/ThemeContext";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

// Mock Data
const TOPICS = [
  { id: "1", title: "Number System", questions: 25, progress: 80 },
  { id: "2", title: "Algebra", questions: 30, progress: 40 },
  { id: "3", title: "Geometry", questions: 20, progress: 0 },
  { id: "4", title: "Trigonometry", questions: 15, progress: 0 },
  { id: "5", title: "Data Interpretation", questions: 50, progress: 10 },
];

export default function SubjectTopicsScreen() {
  const { subjectId } = useLocalSearchParams();
  const router = useRouter();
  const { activeColors, isDark } = useTheme();

  const renderTopic = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDark ? activeColors.card : "#FFF",
          borderColor: activeColors.border,
        },
      ]}
      onPress={() => router.push(`/exam/${item.id}`)}
    >
      <View style={styles.cardLeft}>
        <View
          style={[styles.iconBox, { backgroundColor: activeColors.inputBg }]}
        >
          <Ionicons name="book" size={20} color={activeColors.primary} />
        </View>
        <View>
          <ThemedText style={styles.topicTitle}>{item.title}</ThemedText>
          <ThemedText variant="caption">{item.questions} Questions</ThemedText>
        </View>
      </View>

      <View style={styles.cardRight}>
        {item.progress > 0 ? (
          <View style={styles.progressBadge}>
            <ThemedText
              style={{
                fontSize: 10,
                fontWeight: "bold",
                color: activeColors.success,
              }}
            >
              {item.progress}% Done
            </ThemedText>
          </View>
        ) : (
          <Ionicons
            name="play-circle"
            size={28}
            color={activeColors.secondary}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedScreen>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={activeColors.text} />
        </TouchableOpacity>
        <ThemedText variant="title" style={{ fontSize: 22 }}>
          Topics
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={TOPICS}
        renderItem={renderTopic}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: { padding: 8 },
  listContent: { paddingBottom: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  topicTitle: { fontWeight: "700", fontSize: 16, marginBottom: 4 },
  progressBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#DCFCE7",
    borderRadius: 8,
  },
});
