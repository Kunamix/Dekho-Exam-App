import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { SearchBar } from "../../src/components/SearchBar";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

// 1. Import Hook
import { useTestHistory } from "../../src/hooks/useStudentData";

export default function HistoryScreen() {
  const router = useRouter();
  const { activeColors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Fetch Real Data
  const { data: history = [], loading, refetch } = useTestHistory();

  // 3. Filter Logic
  const filteredHistory = history.filter((item) =>
    item.testName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderHistoryItem = ({ item }) => {
    // Determine Status & Color based on Percentage
    // (You can adjust these thresholds)
    let status = "Average";
    let statusColor = "#F59E0B"; // Orange

    if (item.percentage >= 80) {
      status = "Excellent";
      statusColor = activeColors.success;
    } else if (item.percentage < 40) {
      status = "Needs Improvement";
      statusColor = activeColors.error;
    }

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
        onPress={() =>
          router.push({
            pathname: "/solutions/[id]", // Must match filename exactly
            params: { id: item.attemptId }, // Key must be 'id'
          })
        }
      >
        {/* Header: Title & Date */}
        <View style={styles.cardHeader}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <ThemedText style={styles.title} numberOfLines={1}>
              {item.testName}
            </ThemedText>
            <ThemedText variant="caption" style={{ marginTop: 2 }}>
              {new Date(item.submittedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
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
              {status.toUpperCase()}
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
              {item.accuracy}%
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
                View Report
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
    <ThemedScreen edges={["top", "left", "right"]}>
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
      {loading && history.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={activeColors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.attemptId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              tintColor={activeColors.primary}
            />
          }
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <Ionicons
                name="document-text-outline"
                size={60}
                color={activeColors.textSecondary}
                style={{ opacity: 0.5 }}
              />
              <ThemedText
                style={{ marginTop: 10, color: activeColors.textSecondary }}
              >
                No history found.
              </ThemedText>
            </View>
          }
        />
      )}
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  backBtn: { padding: 4 },

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
