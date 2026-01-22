import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

import { usePayment } from "../../src/hooks/usePayment";
import { useSubscriptionPlans } from "../../src/hooks/useStudentData";

export default function PassScreen() {
  const { activeColors, isDark } = useTheme();

  const { data: apiResponse, loading, refetch } = useSubscriptionPlans();
  const { buyPlan, loading: processing } = usePayment();

  const plans = Array.isArray(apiResponse)
    ? apiResponse
    : apiResponse?.plans || [];

  const [selectedPlanId, setSelectedPlanId] = useState(null);

  useEffect(() => {
    if (!selectedPlanId && plans.length > 0) {
      setSelectedPlanId(plans[0].id);
    }
  }, [plans]);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  const handlePurchase = () => {
    if (!selectedPlan) {
      Alert.alert("Select Plan", "Please select a plan to continue.");
      return;
    }

    buyPlan(selectedPlan, () => {
      refetch();
      Alert.alert("Success", "Subscription activated successfully!");
    });
  };

  const Feature = ({ text }) => (
    <View style={styles.featureRow}>
      <Ionicons
        name="checkmark-circle"
        size={18}
        color={activeColors.success}
      />
      <ThemedText style={styles.featureText}>{text}</ThemedText>
    </View>
  );

  return (
    <ThemedScreen edges={["left", "right", "bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            tintColor={activeColors.primary}
          />
        }
      >
        {/* HERO */}
        <View style={[styles.hero, { backgroundColor: activeColors.primary }]}>
          <View>
            <ThemedText style={styles.heroTitle}>DekhoExam PRO</ThemedText>
            <ThemedText style={styles.heroSubtitle}>
              All tests. Full analysis. One pass.
            </ThemedText>
          </View>
          <View style={styles.heroBadge}>
            <Ionicons name="diamond" size={26} color="#FFD700" />
          </View>
        </View>

        {/* FEATURES */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>What you’ll get</ThemedText>

          <View style={styles.featuresGrid}>
            <Feature text="500+ Mock Tests" />
            <Feature text="Detailed Performance Analysis" />
            <Feature text="All India Rank" />
            <Feature text="Expert Solutions" />
            <Feature text="Offline Access" />
            <Feature text="Ad-Free Experience" />
          </View>
        </View>

        {/* PLANS */}
        <View style={[styles.section, { marginBottom: 120 }]}>
          <ThemedText style={styles.sectionTitle}>Choose your plan</ThemedText>

          {loading && plans.length === 0 ? (
            <ActivityIndicator
              size="large"
              color={activeColors.primary}
              style={{ marginTop: 20 }}
            />
          ) : (
            plans.map((plan, index) => {
              const isSelected = plan.id === selectedPlanId;
              const isPopular = index === 0;

              return (
                <TouchableOpacity
                  key={plan.id}
                  activeOpacity={0.9}
                  onPress={() => setSelectedPlanId(plan.id)}
                  style={[
                    styles.planCard,
                    {
                      backgroundColor: isDark ? activeColors.card : "#FFF",
                      borderColor: isSelected
                        ? activeColors.secondary
                        : activeColors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                >
                  {isPopular && (
                    <View style={styles.popularBadge}>
                      <ThemedText style={styles.popularText}>
                        MOST POPULAR
                      </ThemedText>
                    </View>
                  )}

                  <View style={styles.planLeft}>
                    <View
                      style={[
                        styles.radioOuter,
                        {
                          borderColor: isSelected
                            ? activeColors.secondary
                            : activeColors.textSecondary,
                        },
                      ]}
                    >
                      {isSelected && (
                        <View
                          style={[
                            styles.radioInner,
                            {
                              backgroundColor: activeColors.secondary,
                            },
                          ]}
                        />
                      )}
                    </View>

                    <View style={{ marginLeft: 14 }}>
                      <ThemedText style={styles.planName}>
                        {plan.name}
                      </ThemedText>
                      <ThemedText style={styles.planDuration}>
                        {plan.durationDays} days access
                      </ThemedText>
                    </View>
                  </View>

                  <View style={styles.planRight}>
                    <ThemedText style={styles.planPrice}>
                      ₹{plan.price}
                    </ThemedText>
                    <ThemedText style={styles.planStrike}>
                      ₹{Math.round(plan.price * 1.3)}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* BOTTOM CTA */}
      {selectedPlan && (
        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: isDark ? activeColors.card : "#FFF",
              borderTopColor: activeColors.border,
            },
          ]}
        >
          <View>
            <ThemedText style={styles.totalLabel}>Total Payable</ThemedText>
            <ThemedText style={styles.totalPrice}>
              ₹{selectedPlan.price}
            </ThemedText>
          </View>

          <TouchableOpacity
            onPress={handlePurchase}
            disabled={processing}
            style={[
              styles.payBtn,
              {
                backgroundColor: activeColors.secondary,
                opacity: processing ? 0.7 : 1,
              },
            ]}
          >
            {processing ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <ThemedText style={styles.payText}>Buy Now</ThemedText>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ThemedScreen>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
  },

  hero: {
    borderRadius: 18,
    padding: 22,
    marginBottom: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 6,
  },

  heroSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
  },

  heroBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },

  section: {
    marginBottom: 26,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 14,
  },

  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  featureRow: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
  },

  featureText: {
    marginLeft: 8,
    fontSize: 13,
    opacity: 0.85,
  },

  planCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    position: "relative",
  },

  popularBadge: {
    position: "absolute",
    top: -10,
    right: 14,
    backgroundColor: "#FACC15",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  popularText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#000",
  },

  planLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  planName: {
    fontSize: 15,
    fontWeight: "700",
  },

  planDuration: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },

  planRight: {
    position: "absolute",
    right: 16,
    top: 16,
    alignItems: "flex-end",
  },

  planPrice: {
    fontSize: 18,
    fontWeight: "800",
  },

  planStrike: {
    fontSize: 11,
    opacity: 0.5,
    textDecorationLine: "line-through",
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 11,
    opacity: 0.6,
  },

  totalPrice: {
    fontSize: 22,
    fontWeight: "800",
  },

  payBtn: {
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 12,
  },

  payText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
