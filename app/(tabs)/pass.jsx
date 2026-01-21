import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

// 1. Hooks & Services
import { usePayment } from "../../src/hooks/usePayment";
import { useSubscriptionPlans } from "../../src/hooks/useStudentData";

export default function PassScreen() {
  const { activeColors, isDark } = useTheme();

  // 2. Data & Payment Hooks
  const {
    data: plans = [],
    loading: loadingPlans,
    refetch,
  } = useSubscriptionPlans();
  const { buyPlan, loading: processingPayment } = usePayment();

  const [selectedPlanId, setSelectedPlanId] =
    (useState < string) | (null > null);

  // Auto-select the first plan when data loads
  useEffect(() => {
    if (!selectedPlanId && plans.length > 0) {
      setSelectedPlanId(plans[0].id);
    }
  }, [plans]);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  // 3. Payment Handler
  const handlePurchase = () => {
    if (!selectedPlan) return;

    buyPlan(selectedPlan, () => {
      refetch(); // Refresh data to show active status if needed
    });
  };

  const FeatureRow = ({ text }) => (
    <View style={styles.featureItem}>
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loadingPlans}
            onRefresh={refetch}
            tintColor={activeColors.primary}
          />
        }
      >
        {/* === HERO SECTION === */}
        <View
          style={[styles.heroCard, { backgroundColor: activeColors.primary }]}
        >
          <View style={styles.heroContent}>
            <View>
              <ThemedText style={styles.heroTitle}>DekhoExam PRO</ThemedText>
              <ThemedText style={styles.heroSubtitle}>
                Unlock premium access to all tests.
              </ThemedText>
            </View>
            <View style={styles.heroIconCircle}>
              <Ionicons name="diamond" size={28} color="#FFD700" />
            </View>
          </View>
        </View>

        {/* === FEATURES GRID === */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionHeader}>Premium Benefits</ThemedText>
          <View style={styles.featuresGrid}>
            <FeatureRow text="500+ Mock Tests" />
            <FeatureRow text="Detailed Analysis" />
            <FeatureRow text="All India Rank" />
            <FeatureRow text="Ad-Free Learning" />
            <FeatureRow text="Offline Mode" />
            <FeatureRow text="Expert Solutions" />
          </View>
        </View>

        {/* === PLANS SELECTION === */}
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionHeader}>Choose a Plan</ThemedText>

          {loadingPlans ? (
            <ActivityIndicator
              size="small"
              color={activeColors.primary}
              style={{ marginTop: 20 }}
            />
          ) : plans.length === 0 ? (
            <ThemedText style={{ opacity: 0.5, fontSize: 13 }}>
              No plans available currently.
            </ThemedText>
          ) : (
            plans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
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
                      borderWidth: isSelected ? 1.5 : 1,
                    },
                  ]}
                >
                  <View style={styles.planLeft}>
                    {/* Radio Button */}
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
                            { backgroundColor: activeColors.secondary },
                          ]}
                        />
                      )}
                    </View>

                    <View style={{ marginLeft: 12 }}>
                      <ThemedText style={styles.planName}>
                        {plan.name}
                      </ThemedText>
                      <ThemedText style={styles.planDuration}>
                        Valid for {plan.durationDays} days
                      </ThemedText>
                    </View>
                  </View>

                  <View style={styles.planRight}>
                    <ThemedText style={styles.planPrice}>
                      ₹{plan.price}
                    </ThemedText>
                    {/* Mock original price for UI effect */}
                    <ThemedText style={styles.planStrikePrice}>
                      ₹{Math.round(plan.price * 1.3)}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* === STICKY BOTTOM BAR === */}
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
            <ThemedText
              style={[styles.totalPrice, { color: activeColors.text }]}
            >
              ₹{selectedPlan.price}
            </ThemedText>
          </View>

          <TouchableOpacity
            style={[
              styles.payButton,
              {
                backgroundColor: activeColors.secondary,
                opacity: processingPayment ? 0.7 : 1,
              },
            ]}
            onPress={handlePurchase}
            disabled={processingPayment}
          >
            {processingPayment ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <ThemedText style={styles.payButtonText}>Buy Now</ThemedText>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },

  /* Hero Section */
  heroCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  heroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontWeight: "500",
  },
  heroIconCircle: {
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  /* Sections */
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
    opacity: 0.9,
  },

  /* Features Grid */
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%", // 2 items per row
    marginBottom: 4,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: "500",
    opacity: 0.8,
  },

  /* Plan Card */
  planCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
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
    alignItems: "flex-end",
  },
  planPrice: {
    fontSize: 16,
    fontWeight: "800",
  },
  planStrikePrice: {
    fontSize: 11,
    textDecorationLine: "line-through",
    opacity: 0.5,
  },

  /* Bottom Sticky Bar */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    elevation: 20, // High elevation for shadow on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalLabel: {
    fontSize: 11,
    opacity: 0.6,
    marginBottom: 2,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "800",
  },
  payButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    minWidth: 140,
    alignItems: "center",
  },
  payButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
