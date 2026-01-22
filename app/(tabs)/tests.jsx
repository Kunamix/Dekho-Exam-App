import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo, useCallback, useState } from "react";
import {
  Alert,
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

import { usePopularTests } from "../../src/hooks/useStudentData";

const FILTERS = ["All", "Free", "Premium"];

/* -------------------------------------------------------------------------- */
/*                               Test Card                                    */
/* -------------------------------------------------------------------------- */

const TestCard = memo(({ item, onPress }) => {
  const { activeColors, isDark } = useTheme();
  const isFree = !item.isPaid;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDark ? activeColors.card : "#FFF",
          borderColor: activeColors.border,
        },
      ]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: isFree
                ? isDark
                  ? "rgba(22,163,74,0.2)"
                  : "#DCFCE7"
                : isDark
                  ? "rgba(234,179,8,0.2)"
                  : "#FEF3C7",
            },
          ]}
        >
          <ThemedText
            style={{
              fontSize: 10,
              fontWeight: "800",
              color: isFree
                ? isDark
                  ? "#4ade80"
                  : "#166534"
                : isDark
                  ? "#facc15"
                  : "#B45309",
            }}
          >
            {isFree ? "FREE" : "PREMIUM"}
          </ThemedText>
        </View>

        <Ionicons
          name={isFree ? "lock-open" : "lock-closed"}
          size={16}
          color={isFree ? activeColors.success : activeColors.textSecondary}
        />
      </View>

      <ThemedText style={styles.title} numberOfLines={2}>
        {item.name}
      </ThemedText>

      <View style={styles.metaRow}>
        <ThemedText variant="caption">{item.totalQuestions ?? 0} Qs</ThemedText>

        <View
          style={[styles.dot, { backgroundColor: activeColors.textSecondary }]}
        />

        <ThemedText variant="caption">
          {item.durationMinutes ?? 0} mins
        </ThemedText>

        {item.category?.name && (
          <>
            <View
              style={[
                styles.dot,
                { backgroundColor: activeColors.textSecondary },
              ]}
            />
            <ThemedText variant="caption">{item.category.name}</ThemedText>
          </>
        )}
      </View>

      <View
        style={[
          styles.actionBtn,
          {
            backgroundColor: isFree ? "transparent" : activeColors.secondary,
            borderColor: activeColors.secondary,
            borderWidth: isFree ? 1 : 0,
            borderStyle: isFree ? "dashed" : "solid",
          },
        ]}
      >
        <ThemedText
          style={{
            color: isFree ? activeColors.secondary : "#FFF",
            fontWeight: "700",
          }}
        >
          {isFree ? "Start Test" : "Unlock Now"}
        </ThemedText>

        {!isFree && (
          <Ionicons
            name="arrow-forward"
            size={16}
            color="#FFF"
            style={{ marginLeft: 6 }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
});

/* -------------------------------------------------------------------------- */
/*                               Skeleton                                     */
/* -------------------------------------------------------------------------- */

function TestSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skelLineSmall} />
      <View style={styles.skelLineBig} />
      <View style={styles.skelLineMid} />
      <View style={styles.skelButton} />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Screen                                       */
/* -------------------------------------------------------------------------- */

export default function TestsScreen() {
  const router = useRouter();
  const { activeColors, isDark } = useTheme();

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const { data: tests = [], loading, refetch } = usePopularTests();

  /* ----------------------------- Filter Logic ----------------------------- */

  const filteredTests = tests
    .filter((test) => {
      const type = test.isPaid ? "Premium" : "Free";
      if (activeFilter === "All") return true;
      return type === activeFilter;
    })
    .filter((test) => test.name.toLowerCase().includes(search.toLowerCase()));

  /* --------------------------- Navigation Logic ---------------------------- */

  const handleTestPress = useCallback(
    (test) => {
      if (!test.isPaid) {
        router.push(`/exam/${test.id}`);
        return;
      }

      if (test.category?.id) {
        router.push({
          pathname: `/categories/${test.category.id}`,
          params: { name: test.category.name },
        });
        return;
      }

      Alert.alert("Premium Content", "This test requires a subscription.");
      router.push("/(tabs)/pass");
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <TestCard item={item} onPress={() => handleTestPress(item)} />
    ),
    [handleTestPress],
  );

  return (
    <ThemedScreen edges={["left", "right", "bottom"]}>
      <View style={styles.header}></View>

      {/* Search */}
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search tests..."
      />

      {/* Filters */}
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
                fontSize: 13,
              }}
            >
              {filter}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {loading && tests.length === 0 ? (
        <>
          {[...Array(3)].map((_, i) => (
            <TestSkeleton key={i} />
          ))}
        </>
      ) : (
        <FlatList
          data={filteredTests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              tintColor={activeColors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <ThemedText>No tests found.</ThemedText>
            </View>
          }
        />
      )}
    </ThemedScreen>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  header: { marginBottom: 12 },

  filterContainer: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 16,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  list: { paddingBottom: 20 },

  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 8,
  },

  actionBtn: {
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  empty: {
    alignItems: "center",
    marginTop: 50,
    opacity: 0.6,
  },

  /* Skeleton */
  skeletonCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  skelLineSmall: {
    width: 60,
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginBottom: 12,
  },
  skelLineBig: {
    width: "80%",
    height: 18,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginBottom: 16,
  },
  skelLineMid: {
    width: "60%",
    height: 14,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginBottom: 16,
  },
  skelButton: {
    height: 40,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
  },
});
