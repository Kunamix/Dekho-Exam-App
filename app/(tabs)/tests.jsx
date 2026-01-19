import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

const ALL_TESTS = [
  {
    id: "1",
    title: "SSC CGL Tier I Full Mock 1",
    type: "Free",
    questions: 100,
    time: "60 m",
  },
  {
    id: "2",
    title: "SSC CGL Tier I Full Mock 2",
    type: "Premium",
    questions: 100,
    time: "60 m",
  },
  {
    id: "3",
    title: "Maths Sectional Test - Algebra",
    type: "Free",
    questions: 25,
    time: "20 m",
  },
  {
    id: "4",
    title: "English Grammar - Noun",
    type: "Premium",
    questions: 30,
    time: "25 m",
  },
  {
    id: "5",
    title: "Reasoning - Blood Relation",
    type: "Premium",
    questions: 20,
    time: "15 m",
  },
];

const FILTERS = ["All", "Free", "Premium"];

export default function TestsScreen() {
  const router = useRouter();
  const { activeColors, isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredTests =
    activeFilter === "All"
      ? ALL_TESTS
      : ALL_TESTS.filter((t) => t.type === activeFilter);

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
          <View
            style={[
              styles.badge,
              { backgroundColor: isFree ? "#DCFCE7" : "#FEF3C7" },
            ]}
          >
            <ThemedText
              style={{
                fontSize: 10,
                fontWeight: "bold",
                color: isFree ? "#166534" : "#B45309",
              }}
            >
              {item.type.toUpperCase()}
            </ThemedText>
          </View>
          <Ionicons
            name={isFree ? "lock-open" : "lock-closed"}
            size={16}
            color={activeColors.textSecondary}
          />
        </View>

        <ThemedText style={styles.title}>{item.title}</ThemedText>

        <View style={styles.metaRow}>
          <ThemedText variant="caption">{item.questions} Qs</ThemedText>
          <View
            style={[
              styles.dot,
              { backgroundColor: activeColors.textSecondary },
            ]}
          />
          <ThemedText variant="caption">{item.time}</ThemedText>
        </View>

        <View
          style={[styles.actionBtn, { borderColor: activeColors.secondary }]}
        >
          <ThemedText
            style={{ color: activeColors.secondary, fontWeight: "bold" }}
          >
            {isFree ? "Start Test" : "Unlock"}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedScreen edges={["left", "right", "bottom"]}>
      <View style={styles.header}>
        <ThemedText variant="title">Test Library</ThemedText>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
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
                      ? activeColors.inputBg
                      : "#F3F4F6",
              },
            ]}
          >
            <ThemedText
              style={{
                color: activeFilter === filter ? "#FFF" : activeColors.text,
                fontWeight: "600",
              }}
            >
              {filter}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTests}
        renderItem={renderTestItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 15 },
  filterContainer: { flexDirection: "row", gap: 10, marginBottom: 20 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  list: { paddingBottom: 20 },
  card: { padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  dot: { width: 3, height: 3, borderRadius: 1.5, marginHorizontal: 8 },
  actionBtn: {
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
  },
});
