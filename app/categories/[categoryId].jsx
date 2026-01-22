import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

import { usePayment } from "../../src/hooks/usePayment";
import {
  useCategoryAccess,
  useTestsByCategory,
} from "../../src/hooks/useStudentData";

export default function CategoryDetailsScreen() {
  const router = useRouter();
  const { categoryId, name } = useLocalSearchParams();

  const { activeColors, isDark } = useTheme();

  /* ================= SAFETY ================= */
  if (!categoryId) {
    return (
      <ThemedScreen>
        <View style={styles.center}>
          <ThemedText>Invalid category.</ThemedText>
        </View>
      </ThemedScreen>
    );
  }

  /* ================= DATA ================= */
  const {
    data: tests = [],
    loading: loadingTests,
    refetch: refetchTests,
  } = useTestsByCategory(categoryId);

  console.log("Tests in Category:", tests);

  const {
    data: accessInfo,
    loading: loadingAccess,
    refetch: refetchAccess,
  } = useCategoryAccess(categoryId);

  const { buyPlan, loading: processingPayment } = usePayment();

  /* ================= DERIVED ================= */
  const isLoading = loadingTests || loadingAccess;

  const userHasAccess = accessInfo?.hasAccess === true;
  const hasPremiumTests = tests.some((t) => t.isPaid === true);

  const showBanner = !isLoading && hasPremiumTests && userHasAccess === false;

  /* ================= HELPERS ================= */
  const handleRefetch = async () => {
    await Promise.all([refetchTests(), refetchAccess()]);
  };

  const handleTestPress = (test) => {
    if (!test.isPaid || userHasAccess) {
      router.push(`/exam/${test.id}`);
      return;
    }

    handleUnlockCategory();
  };

  const handleUnlockCategory = () => {
    if (!accessInfo?.planId) {
      Alert.alert(
        "Unavailable",
        "This category does not have a purchasable plan.",
      );
      return;
    }

    buyPlan(
      {
        id: accessInfo.planId,
        name: accessInfo.planName || "Category Pass",
        price: accessInfo.price || 0,
      },
      async () => {
        await handleRefetch();
        Alert.alert(
          "Unlocked",
          "You can now attempt all tests in this category.",
        );
      },
    );
  };

  /* ================= RENDER ITEM ================= */
  const renderTestItem = ({ item }) => {
    const isUnlocked = !item.isPaid || userHasAccess;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleTestPress(item)}
        style={[
          styles.card,
          {
            backgroundColor: isDark ? activeColors.card : "#FFF",
            borderColor: activeColors.border,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <ThemedText style={styles.title} numberOfLines={2}>
            {item.name}
          </ThemedText>

          <Ionicons
            name={isUnlocked ? "lock-open" : "lock-closed"}
            size={18}
            color={
              isUnlocked ? activeColors.success : activeColors.textSecondary
            }
          />
        </View>

        <View style={styles.metaRow}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: isUnlocked
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
                fontWeight: "700",
                color: isUnlocked
                  ? isDark
                    ? "#4ade80"
                    : "#166534"
                  : isDark
                    ? "#facc15"
                    : "#B45309",
              }}
            >
              {!item.isPaid ? "FREE" : isUnlocked ? "OWNED" : "PREMIUM"}
            </ThemedText>
          </View>

          <ThemedText variant="caption" style={{ marginLeft: 10 }}>
            {item.totalQuestions || 0} Qs • {item.durationMinutes || 0} mins
          </ThemedText>
        </View>

        <TouchableOpacity
          onPress={() => handleTestPress(item)}
          style={[
            styles.startBtn,
            {
              backgroundColor: isUnlocked
                ? activeColors.secondary
                : "transparent",
              borderColor: activeColors.secondary,
              borderWidth: isUnlocked ? 0 : 1,
              borderStyle: isUnlocked ? "solid" : "dashed",
            },
          ]}
        >
          <ThemedText
            style={{
              color: isUnlocked ? "#FFF" : activeColors.secondary,
              fontWeight: "700",
            }}
          >
            {isUnlocked ? "Start Test" : "Unlock Now"}
          </ThemedText>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  /* ================= UI ================= */
  return (
    <ThemedScreen edges={["top"]}>
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: activeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={activeColors.text} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <ThemedText variant="title" numberOfLines={1}>
            {name || "Category"}
          </ThemedText>
          <ThemedText variant="caption">
            {tests.length} Tests Available
          </ThemedText>
        </View>
      </View>

      {/* LIST */}
      {isLoading && tests.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={activeColors.primary} />
        </View>
      ) : (
        <FlatList
          data={tests}
          renderItem={renderTestItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.list,
            showBanner && { paddingBottom: 120 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefetch}
              tintColor={activeColors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <ThemedText style={{ opacity: 0.5 }}>No tests found.</ThemedText>
            </View>
          }
        />
      )}

      {/* BOTTOM PURCHASE BANNER */}
      {showBanner && (
        <View
          style={[
            styles.bottomBanner,
            {
              backgroundColor: isDark ? activeColors.card : "#FFF",
              borderTopColor: activeColors.border,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <ThemedText style={{ fontSize: 20, fontWeight: "800" }}>
                ₹{accessInfo?.price ?? "--"}
              </ThemedText>

              {accessInfo?.price && (
                <ThemedText
                  style={{
                    textDecorationLine: "line-through",
                    fontSize: 13,
                    opacity: 0.6,
                  }}
                >
                  ₹{Math.round(accessInfo.price * 1.5)}
                </ThemedText>
              )}
            </View>

            <ThemedText
              variant="caption"
              style={{ color: activeColors.secondary, fontWeight: "600" }}
            >
              Unlock {accessInfo?.planName || "Full Access"}
            </ThemedText>
          </View>

          <TouchableOpacity
            onPress={handleUnlockCategory}
            disabled={processingPayment}
            style={[
              styles.bannerBtn,
              {
                backgroundColor: activeColors.secondary,
                opacity: processingPayment ? 0.7 : 1,
              },
            ]}
          >
            {processingPayment ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <ThemedText style={{ color: "#FFF", fontWeight: "700" }}>
                Buy Now
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ThemedScreen>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: { padding: 4 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },

  list: { padding: 16 },

  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: "700", flex: 1, marginRight: 10 },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  startBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  bottomBanner: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    elevation: 20,
  },
  bannerBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 120,
    alignItems: "center",
  },
});
