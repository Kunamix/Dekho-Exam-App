import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { ThemedText } from "../ThemedText";

const CAT_PALETTE = [
  { color: "#E0F2FE", accent: "#007ACC", icon: "briefcase" },
  { color: "#FEF3C7", accent: "#F59E0B", icon: "cash" },
  { color: "#FEE2E2", accent: "#EF4444", icon: "train" },
  { color: "#D1FAE5", accent: "#10B981", icon: "school" },
  { color: "#EDE9FE", accent: "#8B5CF6", icon: "shield" },
  { color: "#FFEDD5", accent: "#FB923C", icon: "map" },
];

function CategoryCard({ item, index, width, onPress }) {
  const { activeColors, isDark } = useTheme();
  const theme = CAT_PALETTE[index % CAT_PALETTE.length];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        {
          width,
          backgroundColor: isDark ? activeColors.card : "#FFF",
          borderColor: isDark ? activeColors.border : "#F3F4F6",
        },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: theme.color }]}>
        <Ionicons name={theme.icon} size={22} color={theme.accent} />
      </View>

      <ThemedText style={styles.name} numberOfLines={1}>
        {item.name}
      </ThemedText>

      <ThemedText variant="caption" style={styles.count}>
        {item._count?.tests ?? 0} Tests
      </ThemedText>
    </TouchableOpacity>
  );
}

export default memo(CategoryCard);

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
    textAlign: "center",
  },
  count: {
    fontSize: 10,
    opacity: 0.6,
  },
});
