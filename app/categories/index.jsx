import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { getAllCategories } from "../../src/api/category.api";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

export default function AllCategoriesScreen() {
  const router = useRouter();
  const { activeColors, isDark } = useTheme();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getAllCategories();
      setCategories(res); // interceptor already returns response.data
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.gridItem,
        {
          backgroundColor: isDark
            ? activeColors.card
            : item.color || activeColors.card,
          borderColor: activeColors.border,
        },
      ]}
      onPress={() => router.push(`/categories/${item.id}?name=${item.name}`)}
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: isDark ? activeColors.inputBg : "#FFF" },
        ]}
      >
        <Ionicons
          name={item.icon || "grid"}
          size={28}
          color={item.accent || activeColors.primary}
        />
      </View>

      <ThemedText style={styles.catName}>{item.name}</ThemedText>

      <ThemedText variant="caption" style={{ marginTop: 4 }}>
        {item.totalTests ? `${item.totalTests}+ Tests` : "Tests Available"}
      </ThemedText>
    </TouchableOpacity>
  );

  /* ================= STATES ================= */
  if (loading) {
    return (
      <ThemedScreen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={activeColors.primary} />
        </View>
      </ThemedScreen>
    );
  }

  if (error) {
    return (
      <ThemedScreen>
        <View style={styles.center}>
          <Ionicons name="alert-circle" size={28} color={activeColors.error} />
          <ThemedText style={{ marginTop: 10, color: activeColors.error }}>
            {error}
          </ThemedText>

          <TouchableOpacity style={styles.retryBtn} onPress={fetchCategories}>
            <ThemedText style={{ fontWeight: "700" }}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedScreen>
    );
  }

  return (
    <ThemedScreen>
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
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
      />
    </ThemedScreen>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backBtn: { padding: 4 },
  list: { paddingBottom: 20 },

  gridItem: {
    width: "48%",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  catName: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  retryBtn: {
    marginTop: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
});
