import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

const ALL_CATEGORIES = [
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
  { id: "7", name: "UPSC", icon: "book", color: "#F3E8FF", accent: "#9333EA" },
  {
    id: "8",
    name: "Engineering",
    icon: "construct",
    color: "#E0E7FF",
    accent: "#4338CA",
  },
];

export default function AllCategoriesScreen() {
  const router = useRouter();
  const { activeColors, isDark } = useTheme();

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.gridItem,
        {
          backgroundColor: isDark ? activeColors.card : item.color,
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
        <Ionicons name={item.icon} size={28} color={item.accent} />
      </View>
      <ThemedText style={styles.catName}>{item.name}</ThemedText>
      <ThemedText variant="caption" style={{ marginTop: 4 }}>
        120+ Tests
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedScreen>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={activeColors.text} />
        </TouchableOpacity>
        <ThemedText variant="title" style={{ fontSize: 20 }}>
          All Categories
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={ALL_CATEGORIES}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={{ justifyContent: "space-between" }}
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
  list: { paddingBottom: 20 },
  gridItem: {
    width: "48%",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
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
  catName: { fontWeight: "bold", fontSize: 16, textAlign: "center" },
});
