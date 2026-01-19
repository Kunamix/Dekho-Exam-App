import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

// Mock Data: In real app, fetch based on categoryId
const CATEGORY_TESTS = [
  {
    id: "1",
    title: "Tier I - Full Mock Test 1",
    type: "Free",
    questions: 100,
    time: "60 m",
  },
  {
    id: "2",
    title: "Tier I - Full Mock Test 2",
    type: "Premium",
    questions: 100,
    time: "60 m",
  },
  {
    id: "3",
    title: "Tier I - Previous Year 2022",
    type: "Free",
    questions: 100,
    time: "60 m",
  },
  {
    id: "4",
    title: "Subject Test - Quantitative Aptitude",
    type: "Premium",
    questions: 25,
    time: "20 m",
  },
  {
    id: "5",
    title: "Subject Test - General Awareness",
    type: "Free",
    questions: 50,
    time: "15 m",
  },
];

export default function CategoryDetailsScreen() {
  const router = useRouter();
  const { categoryId, name } = useLocalSearchParams(); // Get category name from URL
  const { activeColors, isDark } = useTheme();

  const renderTestItem = ({ item }) => {
    const isFree = item.type === "Free";
    return (
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
        <View style={styles.cardHeader}>
          <ThemedText style={styles.title}>{item.title}</ThemedText>
          <Ionicons
            name={isFree ? "lock-open" : "lock-closed"}
            size={18}
            color={isFree ? activeColors.success : activeColors.textSecondary}
          />
        </View>

        <View style={styles.metaRow}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: isFree
                  ? isDark
                    ? "rgba(22, 163, 74, 0.2)"
                    : "#DCFCE7"
                  : activeColors.inputBg,
              },
            ]}
          >
            <ThemedText
              style={{
                fontSize: 10,
                fontWeight: "bold",
                color: isFree
                  ? isDark
                    ? "#4ade80"
                    : "#166534"
                  : activeColors.textSecondary,
              }}
            >
              {item.type.toUpperCase()}
            </ThemedText>
          </View>
          <ThemedText variant="caption" style={{ marginLeft: 10 }}>
            {item.questions} Qs • {item.time}
          </ThemedText>
        </View>

        <TouchableOpacity
          style={[
            styles.startBtn,
            {
              backgroundColor: isFree ? activeColors.secondary : "transparent",
              borderWidth: isFree ? 0 : 1,
              borderColor: activeColors.secondary,
            },
          ]}
        >
          <ThemedText
            style={{
              color: isFree ? "#FFF" : activeColors.secondary,
              fontWeight: "bold",
            }}
          >
            {isFree ? "Start Test" : "Unlock Now"}
          </ThemedText>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedScreen>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={activeColors.text} />
        </TouchableOpacity>
        <View>
          <ThemedText variant="title" style={{ fontSize: 20 }}>
            {name || "Category"}
          </ThemedText>
          <ThemedText variant="caption">
            {CATEGORY_TESTS.length} Tests Available
          </ThemedText>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={CATEGORY_TESTS}
        renderItem={renderTestItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 15,
  },
  backBtn: { padding: 4 },
  list: { paddingBottom: 20 },
  card: { padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: "bold", flex: 1, marginRight: 10 },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  startBtn: { paddingVertical: 10, alignItems: "center", borderRadius: 10 },
});
