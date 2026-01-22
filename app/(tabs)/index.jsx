import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
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

import { CategoriesSection } from "../../src/components/categories/CategoriesSection";
import { PopularTestsSection } from "../../src/components/tests/PopularTestsSection";

import { useCategories, usePopularTests } from "../../src/hooks/useStudentData";

export default function IndexScreen() {
  const router = useRouter();
  const { activeColors, isDark } = useTheme();
  const [search, setSearch] = useState("");

  const {
    data: categories = [],
    loading: catLoading,
    refetch: refetchCategories,
  } = useCategories();

  const {
    data: popularTests = [],
    loading: testsLoading,
    refetch: refetchTests,
  } = usePopularTests();

  const isSearching = search.trim().length > 0;

  /* 🔍 FILTER LOGIC */
  const filteredCategories = categories
    .filter((c) => c.isActive)
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const filteredTests = popularTests.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  const onRefresh = useCallback(() => {
    refetchCategories();
    refetchTests();
  }, [refetchCategories, refetchTests]);

  return (
    <ThemedScreen noPadding edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={catLoading || testsLoading}
            onRefresh={onRefresh}
            tintColor={activeColors.primary}
          />
        }
      >
        {/* HEADER */}
        {!isSearching && (
          <View style={styles.header}>
            <ThemedText style={styles.welcome}>Welcome Back,</ThemedText>
            <ThemedText style={styles.username}>Student 👋</ThemedText>
          </View>
        )}

        {/* SEARCH BAR */}
        <View
          style={[
            styles.searchWrapper,
            { backgroundColor: isDark ? "#000" : "#F9FAFB" },
          ]}
        >
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search exams, tests, topics..."
          />
        </View>

        {/* CATEGORIES HEADER WITH SEE ALL */}
        {!isSearching && filteredCategories.length > 0 && (
          <View style={styles.sectionHeader}>
            <ThemedText variant="subtitle">Explore Exams</ThemedText>
            <TouchableOpacity onPress={() => router.push("/categories")}>
              <ThemedText
                style={[styles.seeAll, { color: activeColors.secondary }]}
              >
                See All
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {/* CATEGORIES */}
        <CategoriesSection
          title={isSearching ? "Categories" : undefined}
          categories={filteredCategories}
          isSearching={isSearching}
          loading={catLoading}
        />

        {/* POPULAR TESTS */}
        {(filteredTests.length > 0 || testsLoading) && (
          <PopularTestsSection tests={filteredTests} loading={testsLoading} />
        )}

        {/* EMPTY STATE */}
        {isSearching &&
          filteredCategories.length === 0 &&
          filteredTests.length === 0 && (
            <View style={styles.emptyState}>
              <ThemedText style={{ opacity: 0.6 }}>
                No results found for "{search}"
              </ThemedText>
            </View>
          )}

        <View style={{ height: 80 }} />
      </ScrollView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 10,
  },
  welcome: {
    fontSize: 14,
    opacity: 0.7,
  },
  username: {
    fontSize: 22,
    fontWeight: "800",
  },
  searchWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 40,
  },
});
