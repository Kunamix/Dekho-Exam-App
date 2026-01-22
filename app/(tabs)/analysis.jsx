import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo, useMemo } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

import { useTestHistory } from "../../src/hooks/useStudentData";

/* -------------------------------------------------------------------------- */
/* Stat Box                                      */
/* -------------------------------------------------------------------------- */

const StatBox = memo(({ label, value, icon, color }) => {
  const { activeColors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.statBox,
        {
          backgroundColor: isDark ? activeColors.card : "#FFF",
          borderColor: activeColors.border,
        },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>

      <View>
        <ThemedText style={styles.statValue}>{value}</ThemedText>
        <ThemedText variant="caption">{label}</ThemedText>
      </View>
    </View>
  );
});

/* -------------------------------------------------------------------------- */
/* Attempt Card                                    */
/* -------------------------------------------------------------------------- */

const AttemptCard = memo(({ item, onPress }) => {
  const { activeColors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.historyCard,
        {
          backgroundColor: isDark ? activeColors.card : "#FFF",
          borderColor: activeColors.border,
        },
      ]}
    >
      <View style={styles.historyHeader}>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.historyTitle} numberOfLines={1}>
            {item.testName}
          </ThemedText>
          <ThemedText variant="caption">
            {new Date(item.submittedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </ThemedText>
        </View>

        <View
          style={[styles.scoreBadge, { backgroundColor: activeColors.inputBg }]}
        >
          <ThemedText
            style={{ fontWeight: "700", color: activeColors.primary }}
          >
            {item.percentage ?? 0}%
          </ThemedText>
        </View>
      </View>

      <View
        style={[styles.divider, { backgroundColor: activeColors.border }]}
      />

      <View style={styles.historyFooter}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="disc" size={16} color={activeColors.success} />
          <ThemedText variant="caption" style={{ marginLeft: 6 }}>
            Acc: {item.accuracy ?? 0}%
          </ThemedText>
        </View>

        <TouchableOpacity
          style={[styles.solutionBtn, { borderColor: activeColors.secondary }]}
          onPress={onPress}
        >
          <ThemedText
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: activeColors.secondary,
            }}
          >
            View Solutions
          </ThemedText>
          <Ionicons
            name="arrow-forward"
            size={14}
            color={activeColors.secondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
});

/* -------------------------------------------------------------------------- */
/* Skeleton                                      */
/* -------------------------------------------------------------------------- */

function AttemptSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skelLineBig} />
      <View style={styles.skelLineSmall} />
      <View style={styles.skelLineMid} />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Screen                                        */
/* -------------------------------------------------------------------------- */

export default function AnalysisScreen() {
  const router = useRouter();
  const { activeColors, isDark } = useTheme();

  const { data: history = [], loading, refetch } = useTestHistory();

  /* ----------------------------- Stats Logic ----------------------------- */

  const stats = useMemo(() => {
    const total = history.length;

    if (total === 0) {
      return { total: 0, avgScore: 0, avgAccuracy: 0 };
    }

    const scoreSum = history.reduce((acc, h) => acc + (h.percentage ?? 0), 0);
    const accSum = history.reduce((acc, h) => acc + (h.accuracy ?? 0), 0);

    return {
      total,
      avgScore: Math.round(scoreSum / total),
      avgAccuracy: Math.round(accSum / total),
    };
  }, [history]);

  const lastSeven = history.slice(0, 7);

  return (
    <ThemedScreen edges={["left", "right", "bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            tintColor={activeColors.primary}
          />
        }
      >
        <ThemedText variant="subtitle" style={{ marginBottom: 20 }}>
          Your Performance
        </ThemedText>

        {/* Stats Grid */}
        <View style={styles.grid}>
          <StatBox
            label="Tests Taken"
            value={stats.total.toString()}
            icon="document-text"
            color="#3B82F6"
          />
          <StatBox
            label="Avg Score"
            value={`${stats.avgScore}%`}
            icon="trophy"
            color="#F59E0B"
          />
          <StatBox
            label="Accuracy"
            value={`${stats.avgAccuracy}%`}
            icon="disc"
            color="#10B981"
          />
          <StatBox label="Best Rank" value="#1" icon="ribbon" color="#EF4444" />
        </View>

        {/* Chart */}
        <View
          style={[
            styles.chartCard,
            { backgroundColor: isDark ? activeColors.card : "#FFF" },
          ]}
        >
          <ThemedText variant="subtitle" style={{ marginBottom: 15 }}>
            Last 7 Attempts
          </ThemedText>

          <View style={styles.chartArea}>
            {(lastSeven.length > 0 ? lastSeven : Array(7).fill(null)).map(
              (h, i) => (
                <View key={i} style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${h?.percentage ?? 10}%`,
                        backgroundColor: activeColors.secondary,
                        opacity: h ? 1 : 0.3,
                      },
                    ]}
                  />
                </View>
              ),
            )}
          </View>
        </View>

        {/* Recent Attempts */}
        <ThemedText variant="subtitle" style={{ marginBottom: 15 }}>
          Recent Attempts
        </ThemedText>

        {loading && history.length === 0 ? (
          <>
            {[...Array(3)].map((_, i) => (
              <AttemptSkeleton key={i} />
            ))}
          </>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.attemptId}
            scrollEnabled={false}
            contentContainerStyle={styles.historyList}
            ListEmptyComponent={
              <ThemedText
                style={{ textAlign: "center", opacity: 0.5, marginTop: 20 }}
              >
                No tests attempted yet.
              </ThemedText>
            }
            renderItem={({ item }) => (
              <AttemptCard
                item={item}
                // ✅ FIX: Use Object Syntax for push to pass params correctly
                onPress={() =>
                  router.push({
                    pathname: "/solutions/[id]", // Must match filename exactly
                    params: { id: item.attemptId }, // Key must be 'id'
                  })
                }
              />
            )}
          />
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </ThemedScreen>
  );
}

/* -------------------------------------------------------------------------- */
/* Styles                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginBottom: 25,
  },

  statBox: {
    width: "47%",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },

  statValue: {
    fontSize: 22,
    fontWeight: "700",
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  chartCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
  },

  chartArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 150,
    alignItems: "flex-end",
  },

  barContainer: {
    width: 20,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  bar: {
    width: 8,
    borderRadius: 4,
    minHeight: 4,
  },

  historyList: {
    gap: 12,
  },

  historyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },

  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  historyTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  divider: {
    height: 1,
    marginVertical: 10,
    opacity: 0.5,
  },

  historyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  solutionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },

  /* Skeleton */
  skeletonCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },

  skelLineBig: {
    width: "80%",
    height: 18,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginBottom: 10,
  },

  skelLineSmall: {
    width: "50%",
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginBottom: 14,
  },

  skelLineMid: {
    width: "60%",
    height: 14,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
  },
});
