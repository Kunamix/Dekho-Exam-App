import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { SearchBar } from "../../src/components/SearchBar";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

// 1. Import Custom Hooks
import {
  usePopularTests,
  useStudentCategories,
} from "../../src/hooks/useStudentData";

// UI Constants (Colors for categories)
const CAT_PALETTE = [
  { color: "#E0F2FE", accent: "#007ACC", icon: "briefcase" },
  { color: "#FEF3C7", accent: "#F59E0B", icon: "cash" },
  { color: "#FEE2E2", accent: "#EF4444", icon: "train" },
  { color: "#D1FAE5", accent: "#10B981", icon: "school" },
  { color: "#EDE9FE", accent: "#8B5CF6", icon: "shield" },
  { color: "#FFEDD5", accent: "#FB923C", icon: "map" },
];

export default function IndexScreen() {
  const router = useRouter();
  const { activeColors, isDark } = useTheme();
  const [search, setSearch] = useState("");

  // 2. Fetch Data using Hooks
  const {
    data: categories = [],
    loading: catLoading,
    refetch: refetchCat,
  } = useStudentCategories();

  const {
    data: tests = [],
    loading: testsLoading,
    refetch: refetchTests,
  } = usePopularTests();

  // 3. Refresh Logic
  const onRefresh = () => {
    refetchCat();
    refetchTests();
  };

  const isLoading = catLoading || testsLoading;

  // --- FILTER LOGIC ---
  const filteredCategories = categories.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredTests = tests.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const renderCategory = ({ item, index }) => {
    // Assign color based on index
    const theme = CAT_PALETTE[index % CAT_PALETTE.length];

    return (
      <TouchableOpacity
        style={[
          styles.catCard,
          { backgroundColor: isDark ? activeColors.inputBg : theme.color },
        ]}
        onPress={() =>
          router.push({
            pathname: `/categories/${item.id}`,
            params: { name: item.name },
          })
        }
      >
        <View
          style={[
            styles.catIconContainer,
            { backgroundColor: isDark ? activeColors.card : "#FFF" },
          ]}
        >
          <Ionicons name={theme.icon} size={24} color={theme.accent} />
        </View>
        <ThemedText style={styles.catName} numberOfLines={1}>
          {item.name}
        </ThemedText>
        {/* Optional: Show test count if backend provides it */}
        {item.testsCount !== undefined && (
          <ThemedText
            variant="caption"
            style={{ fontSize: 10, marginTop: 2, opacity: 0.7 }}
          >
            {item.testsCount} Tests
          </ThemedText>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ThemedScreen noPadding edges={["left", "right", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={activeColors.primary}
          />
        }
      >
        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search for exams, tests..."
          />
        </View>

        {/* PROMO BANNER (Hide when searching) */}
        {search === "" && (
          <TouchableOpacity
            style={[styles.banner, { backgroundColor: activeColors.primary }]}
          >
            <View style={styles.bannerContent}>
              <View style={styles.bannerTextContainer}>
                <ThemedText
                  variant="title"
                  style={styles.bannerTitle}
                  color="#FFF"
                >
                  DekhoExam{" "}
                  <ThemedText style={{ color: "#FFD700", fontWeight: "800" }}>
                    PRO
                  </ThemedText>
                </ThemedText>
                <ThemedText
                  style={styles.bannerSubtitle}
                  color="rgba(255,255,255,0.9)"
                >
                  Unlock 500+ Tests & Analysis
                </ThemedText>
                <View style={styles.bannerBtn}>
                  <ThemedText
                    style={styles.bannerBtnText}
                    color={activeColors.primary}
                  >
                    Get Started
                  </ThemedText>
                </View>
              </View>
              <Ionicons
                name="trophy"
                size={80}
                color="rgba(255,255,255,0.2)"
                style={styles.bannerIcon}
              />
            </View>
          </TouchableOpacity>
        )}

        {/* LOADING INDICATOR (Initial Load) */}
        {isLoading && categories.length === 0 && (
          <ActivityIndicator
            size="large"
            color={activeColors.primary}
            style={{ marginTop: 20 }}
          />
        )}

        {/* CATEGORIES SECTION */}
        {!isLoading && filteredCategories.length > 0 && (
          <View>
            <View style={styles.sectionHeader}>
              <ThemedText variant="subtitle">
                {search ? "Matching Categories" : "Explore Categories"}
              </ThemedText>
              {!search && (
                <TouchableOpacity onPress={() => router.push("/categories")}>
                  <ThemedText variant="link">See All</ThemedText>
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filteredCategories}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.catList}
            />
          </View>
        )}

        {/* POPULAR TESTS */}
        {!isLoading && filteredTests.length > 0 && (
          <View>
            <View style={[styles.sectionHeader, { marginTop: 25 }]}>
              <ThemedText variant="subtitle">
                {search ? "Matching Tests" : "Popular Tests"}
              </ThemedText>
            </View>

            <View style={styles.testsContainer}>
              {filteredTests.map((test) => {
                const isFree = !test.isPaid; // Map backend 'isPaid' to UI logic
                return (
                  <TouchableOpacity
                    key={test.id}
                    style={[
                      styles.testCard,
                      {
                        backgroundColor: isDark ? activeColors.card : "#FFF",
                        borderColor: activeColors.border,
                      },
                    ]}
                    onPress={() => router.push(`/exam/${test.id}`)}
                  >
                    <View style={styles.testHeader}>
                      <View
                        style={[
                          styles.tag,
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
                          style={styles.tagText}
                          color={
                            isFree
                              ? isDark
                                ? "#4ade80"
                                : "#166534"
                              : activeColors.textSecondary
                          }
                        >
                          {isFree ? "FREE" : "LOCKED"}
                        </ThemedText>
                      </View>
                      <Ionicons
                        name={isFree ? "lock-open" : "lock-closed"}
                        size={16}
                        color={
                          isFree
                            ? isDark
                              ? "#4ade80"
                              : "#166534"
                            : activeColors.textSecondary
                        }
                      />
                    </View>

                    <ThemedText style={styles.testTitle}>
                      {test.name}
                    </ThemedText>

                    <View style={styles.testInfo}>
                      <ThemedText variant="caption">
                        {test.totalQuestions} Qs
                      </ThemedText>
                      <View
                        style={[
                          styles.dot,
                          { backgroundColor: activeColors.textSecondary },
                        ]}
                      />
                      <ThemedText variant="caption">
                        {test.durationMinutes} mins
                      </ThemedText>
                      <View
                        style={[
                          styles.dot,
                          { backgroundColor: activeColors.textSecondary },
                        ]}
                      />
                      <ThemedText variant="caption">
                        {/* Placeholder or real data if available */}
                        {test.attemptsCount
                          ? `${test.attemptsCount} Users`
                          : "Popular"}
                      </ThemedText>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.attemptBtn,
                        {
                          backgroundColor: isFree
                            ? activeColors.secondary
                            : "transparent",
                          borderColor: activeColors.secondary,
                          borderWidth: isFree ? 0 : 1,
                        },
                      ]}
                    >
                      <ThemedText
                        style={styles.attemptText}
                        color={isFree ? "#FFF" : activeColors.secondary}
                      >
                        {isFree ? "Attempt Now" : "Unlock Now"}
                      </ThemedText>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* NO RESULTS FOUND STATE */}
        {!isLoading &&
          search !== "" &&
          filteredCategories.length === 0 &&
          filteredTests.length === 0 && (
            <View style={{ alignItems: "center", marginTop: 50, opacity: 0.5 }}>
              <Ionicons
                name="search-outline"
                size={60}
                color={activeColors.textSecondary}
              />
              <ThemedText
                style={{ marginTop: 10, color: activeColors.textSecondary }}
              >
                No results found for "{search}"
              </ThemedText>
            </View>
          )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingTop: 16 },
  searchContainer: { paddingHorizontal: 20, marginBottom: 20 },

  // Banner
  banner: {
    marginHorizontal: 20,
    borderRadius: 20,
    height: 140,
    padding: 20,
    justifyContent: "center",
    marginBottom: 25,
    shadowColor: "#007ACC",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  bannerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },
  bannerIcon: {
    position: "absolute",
    right: -20,
    bottom: -30,
    transform: [{ rotate: "-15deg" }],
  },
  bannerTextContainer: { zIndex: 1 },
  bannerTitle: { marginBottom: 4 },
  bannerSubtitle: { marginBottom: 15 },
  bannerBtn: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  bannerBtnText: { fontWeight: "700", fontSize: 12 },

  // Sections
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  catList: { paddingHorizontal: 20, paddingBottom: 10 },
  catCard: {
    width: 100,
    height: 110,
    borderRadius: 16,
    marginRight: 12,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  catIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  catName: { fontSize: 12, fontWeight: "600", textAlign: "center" },

  // Tests
  testsContainer: { paddingHorizontal: 20 },
  testCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  testHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 10, fontWeight: "800" },
  testTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  testInfo: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  dot: { width: 3, height: 3, borderRadius: 1.5, marginHorizontal: 8 },
  attemptBtn: {
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  attemptText: { fontWeight: "700", fontSize: 14 },
});
