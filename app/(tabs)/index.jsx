import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { SearchBar } from "../../src/components/SearchBar";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

const CATEGORIES = [
  {
    id: "1",
    name: "SSC Exams",
    icon: "briefcase",
    color: "#E0F2FE",
    accent: "#007ACC",
  },
  {
    id: "2",
    name: "Banking",
    icon: "cash",
    color: "#FEF3C7",
    accent: "#F59E0B",
  },
  {
    id: "3",
    name: "Railways",
    icon: "train",
    color: "#FEE2E2",
    accent: "#EF4444",
  },
  {
    id: "4",
    name: "Teaching",
    icon: "school",
    color: "#D1FAE5",
    accent: "#10B981",
  },
  {
    id: "5",
    name: "Defence",
    icon: "shield",
    color: "#EDE9FE",
    accent: "#8B5CF6",
  },
  {
    id: "6",
    name: "State Exams",
    icon: "map",
    color: "#FFEDD5",
    accent: "#FB923C",
  },
];

const POPULAR_TESTS = [
  {
    id: "101",
    title: "SSC CGL Tier I - Full Mock",
    questions: 100,
    time: "60 mins",
    isFree: true,
    users: "12k",
  },
  {
    id: "102",
    title: "SBI PO Prelims Mock 3",
    questions: 100,
    time: "60 mins",
    isFree: false,
    users: "8k",
  },
  {
    id: "103",
    title: "RRB NTPC General Awareness",
    questions: 50,
    time: "30 mins",
    isFree: true,
    users: "15k",
  },
];

export default function IndexScreen() {
  const router = useRouter();
  const { activeColors, isDark } = useTheme();
  const [search, setSearch] = useState("");

  // --- FILTER LOGIC ---
  // Filter Categories
  const filteredCategories = CATEGORIES.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Filter Tests
  const filteredTests = POPULAR_TESTS.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.catCard,
        { backgroundColor: isDark ? activeColors.inputBg : item.color },
      ]}
      onPress={() => router.push(`/categories/${item.id}?name=${item.name}`)}
    >
      <View
        style={[
          styles.catIconContainer,
          { backgroundColor: isDark ? activeColors.card : "#FFF" },
        ]}
      >
        <Ionicons name={item.icon} size={24} color={item.accent} />
      </View>
      <ThemedText style={styles.catName} numberOfLines={1}>
        {item.name}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedScreen noPadding edges={["left", "right", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search for exams, tests..."
          />
        </View>

        {/* PROMO BANNER (Hide when searching to focus on results) */}
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

        {/* CATEGORIES SECTION */}
        {filteredCategories.length > 0 && (
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
        {filteredTests.length > 0 && (
          <View>
            <View style={[styles.sectionHeader, { marginTop: 25 }]}>
              <ThemedText variant="subtitle">
                {search ? "Matching Tests" : "Popular Tests"}
              </ThemedText>
            </View>

            <View style={styles.testsContainer}>
              {filteredTests.map((test) => (
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
                          backgroundColor: test.isFree
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
                          test.isFree
                            ? isDark
                              ? "#4ade80"
                              : "#166534"
                            : activeColors.textSecondary
                        }
                      >
                        {test.isFree ? "FREE" : "LOCKED"}
                      </ThemedText>
                    </View>
                    <Ionicons
                      name={test.isFree ? "lock-open" : "lock-closed"}
                      size={16}
                      color={
                        test.isFree
                          ? isDark
                            ? "#4ade80"
                            : "#166534"
                          : activeColors.textSecondary
                      }
                    />
                  </View>

                  <ThemedText style={styles.testTitle}>{test.title}</ThemedText>

                  <View style={styles.testInfo}>
                    <ThemedText variant="caption">
                      {test.questions} Qs
                    </ThemedText>
                    <View
                      style={[
                        styles.dot,
                        { backgroundColor: activeColors.textSecondary },
                      ]}
                    />
                    <ThemedText variant="caption">{test.time}</ThemedText>
                    <View
                      style={[
                        styles.dot,
                        { backgroundColor: activeColors.textSecondary },
                      ]}
                    />
                    <ThemedText variant="caption">
                      {test.users} Attempted
                    </ThemedText>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.attemptBtn,
                      {
                        backgroundColor: test.isFree
                          ? activeColors.secondary
                          : "transparent",
                        borderColor: activeColors.secondary,
                        borderWidth: test.isFree ? 0 : 1,
                      },
                    ]}
                  >
                    <ThemedText
                      style={styles.attemptText}
                      color={test.isFree ? "#FFF" : activeColors.secondary}
                    >
                      {test.isFree ? "Attempt Now" : "Unlock Now"}
                    </ThemedText>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* NO RESULTS FOUND STATE */}
        {search !== "" &&
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
  searchContainer: { paddingHorizontal: 20, marginBottom: 20 }, // Removed marginTop to fit closer to header

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
