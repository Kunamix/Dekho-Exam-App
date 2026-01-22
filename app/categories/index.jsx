import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

// 1. Import Hook
import { useCategories } from "../../src/hooks/useStudentData";

// UI Constants
const CAT_PALETTE = [
  { color: "#E0F2FE", accent: "#007ACC", icon: "briefcase" },
  { color: "#FEF3C7", accent: "#F59E0B", icon: "cash" },
  { color: "#FEE2E2", accent: "#EF4444", icon: "train" },
  { color: "#D1FAE5", accent: "#10B981", icon: "school" },
  { color: "#EDE9FE", accent: "#8B5CF6", icon: "shield" },
  { color: "#FFEDD5", accent: "#FB923C", icon: "map" },
];

export default function AllCategoriesScreen() {
  const router = useRouter();
  const { activeColors, isDark } = useTheme();

  // 2. Use Hook
  const { data: categories = [], loading, error, refetch } = useCategories();

  /* ================= RENDER ================= */
  const renderCategory = ({ item, index }) => {
    // Assign Theme based on index
    const theme = CAT_PALETTE[index % CAT_PALETTE.length];

    return (
      <TouchableOpacity
        style={[
          styles.gridItem,
          {
            backgroundColor: isDark ? activeColors.card : theme.color, // Use palette color
            borderColor: activeColors.border,
          },
        ]}
        onPress={() =>
          router.push({
            pathname: `/categories/${item.id}`,
            params: { name: item.name },
          })
        }
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: isDark ? activeColors.inputBg : "#FFF" },
          ]}
        >
          <Ionicons
            name={theme.icon || "grid"}
            size={28}
            color={theme.accent}
          />
        </View>

        <ThemedText style={styles.catName} numberOfLines={2}>
          {item.name}
        </ThemedText>

        <ThemedText variant="caption" style={{ marginTop: 4, opacity: 0.7 }}>
          {item.testsCount ? `${item.testsCount}+ Tests` : "Explore"}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  /* ================= ERROR STATE ================= */
  if (error && !loading && categories.length === 0) {
    return (
      <ThemedScreen>
        <View style={styles.center}>
          <Ionicons name="alert-circle" size={40} color="#EF4444" />
          <ThemedText
            style={{
              marginTop: 10,
              color: activeColors.textSecondary,
              textAlign: "center",
            }}
          >
            {error || "Failed to load categories."}
          </ThemedText>

          <TouchableOpacity
            style={[styles.retryBtn, { borderColor: activeColors.border }]}
            onPress={refetch}
          >
            <ThemedText style={{ fontWeight: "700" }}>Try Again</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedScreen>
    );
  }

  return (
    <ThemedScreen edges={["top", "left", "right"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={activeColors.text} />
        </TouchableOpacity>

        <ThemedText variant="title" style={{ fontSize: 20 }}>
          All Categories
        </ThemedText>

        <View style={{ width: 24 }} />
      </View>

      {/* LIST */}
      {loading && categories.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={activeColors.primary} />
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              tintColor={activeColors.primary}
            />
          }
        />
      )}
    </ThemedScreen>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  backBtn: { padding: 4 },
  list: { paddingBottom: 20, paddingTop: 10 },

  gridItem: {
    width: "48%",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  catName: {
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  retryBtn: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
});
