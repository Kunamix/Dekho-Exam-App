import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { SearchBar } from "../../src/components/SearchBar";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

// Mock History Data
const HISTORY_DATA = [
  {
    id: "1",
    title: "SSC CGL Tier I - Full Mock",
    score: "85/100",
    accuracy: "90%",
    date: "2 Oct, 2023",
    status: "Passed",
  },
  {
    id: "2",
    title: "SBI PO Prelims Mock 3",
    score: "62/100",
    accuracy: "75%",
    date: "1 Oct, 2023",
    status: "Average",
  },
  {
    id: "3",
    title: "RRB NTPC Gen. Awareness",
    score: "40/50",
    accuracy: "88%",
    date: "28 Sep, 2023",
    status: "Passed",
  },
  {
    id: "4",
    title: "English Grammar - Noun",
    score: "15/30",
    accuracy: "50%",
    date: "25 Sep, 2023",
    status: "Failed",
  },
  {
    id: "5",
    title: "Maths Sectional - Algebra",
    score: "22/25",
    accuracy: "95%",
    date: "20 Sep, 2023",
    status: "Passed",
  },
];

export default function HistoryScreen() {
  const router = useRouter();
  const { activeColors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter Logic
  const filteredHistory = HISTORY_DATA.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderHistoryItem = ({ item }) => {
    // Status Color Logic
    let statusColor = activeColors.textSecondary;
    if (item.status === "Passed") statusColor = activeColors.success;
    if (item.status === "Failed") statusColor = activeColors.error;
    if (item.status === "Average") statusColor = "#F59E0B"; // Orange

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.card,
          {
            backgroundColor: isDark ? activeColors.card : "#FFF",
            borderColor: activeColors.border,
          },
        ]}
        onPress={() => router.push(`/solutions/${item.id}`)}
      >
        {/* Header: Title & Date */}
        <View style={styles.cardHeader}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <ThemedText style={styles.title} numberOfLines={1}>
              {item.title}
            </ThemedText>
            <ThemedText variant="caption" style={{ marginTop: 2 }}>
              {item.date}
            </ThemedText>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor + "15" },
            ]}
          >
            <ThemedText
              style={{ fontSize: 10, fontWeight: "bold", color: statusColor }}
            >
              {item.status.toUpperCase()}
            </ThemedText>
          </View>
        </View>

        <View
          style={[styles.divider, { backgroundColor: activeColors.border }]}
        />

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <ThemedText variant="caption">Score</ThemedText>
            <ThemedText style={{ fontWeight: "bold", fontSize: 16 }}>
              {item.score}
            </ThemedText>
          </View>

          <View
            style={[
              styles.verticalLine,
              { backgroundColor: activeColors.border },
            ]}
          />

          <View style={styles.statItem}>
            <ThemedText variant="caption">Accuracy</ThemedText>
            <ThemedText style={{ fontWeight: "bold", fontSize: 16 }}>
              {item.accuracy}
            </ThemedText>
          </View>

          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <ThemedText
                style={{
                  color: activeColors.secondary,
                  fontWeight: "bold",
                  fontSize: 13,
                }}
              >
                View Solution
              </ThemedText>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={activeColors.secondary}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedScreen>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={activeColors.text} />
        </TouchableOpacity>
        <ThemedText variant="title" style={{ fontSize: 20 }}>
          Test History
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={{ marginBottom: 20 }}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search past tests..."
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Ionicons
              name="document-text-outline"
              size={60}
              color={activeColors.textSecondary}
            />
            <ThemedText
              style={{ marginTop: 10, color: activeColors.textSecondary }}
            >
              No history found.
            </ThemedText>
          </View>
        }
      />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backBtn: { padding: 4 },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },

  // List
  listContent: { paddingBottom: 30 },

  // Card
  card: { borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: { fontSize: 16, fontWeight: "600" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },

  divider: { height: 1, marginVertical: 12, opacity: 0.5 },

  // Stats
  statsRow: { flexDirection: "row", alignItems: "center" },
  statItem: { marginRight: 20 },
  verticalLine: { width: 1, height: 25, marginRight: 20 },
});
