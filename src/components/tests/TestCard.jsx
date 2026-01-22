import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { ThemedText } from "../ThemedText";

function TestCard({ item, onPress }) {
  const { activeColors, isDark } = useTheme();
  const isFree = !item.isPaid;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: isDark ? activeColors.card : "#FFF",
          borderColor: isDark ? activeColors.border : "#E5E7EB",
        },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: isFree ? "#DCFCE7" : "#FEF3C7",
            },
          ]}
        >
          <ThemedText style={styles.badgeText}>
            {isFree ? "FREE" : "PREMIUM"}
          </ThemedText>
        </View>

        <ThemedText variant="caption">
          {item.category?.name ?? "General"}
        </ThemedText>
      </View>

      <ThemedText style={styles.title} numberOfLines={2}>
        {item.name}
      </ThemedText>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Ionicons name="document-text-outline" size={14} />
          <ThemedText variant="caption">{item.totalQuestions} Qs</ThemedText>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={14} />
          <ThemedText variant="caption">{item.durationMinutes} min</ThemedText>
        </View>
      </View>

      <View style={styles.action}>
        <ThemedText style={styles.actionText}>
          {isFree ? "Start Now" : "Unlock"}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

export default memo(TestCard);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  meta: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  action: {
    height: 44,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
