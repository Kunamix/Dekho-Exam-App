import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Linking,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

const FAQS = [
  {
    id: 1,
    question: "How do I reset my password?",
    answer: "Go to settings > security to update your password.",
  },
  {
    id: 2,
    question: "Can I download tests offline?",
    answer: "Yes, premium members can download tests for offline access.",
  },
  {
    id: 3,
    question: "How do I contact support?",
    answer: "You can email us at support@dekhoexam.com or call our helpline.",
  },
];

export default function SupportScreen() {
  const router = useRouter();
  const { activeColors, isDark } = useTheme();
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ThemedScreen>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={activeColors.text} />
        </TouchableOpacity>
        <ThemedText variant="title" style={{ fontSize: 20 }}>
          Help & Support
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Contact Options */}
        <View style={styles.contactContainer}>
          <ThemedText variant="subtitle" style={{ marginBottom: 15 }}>
            Contact Us
          </ThemedText>
          <View style={styles.contactRow}>
            <TouchableOpacity
              style={[
                styles.contactCard,
                {
                  backgroundColor: isDark ? activeColors.card : "#FFF",
                  borderColor: activeColors.border,
                },
              ]}
              onPress={() => Linking.openURL("mailto:support@dekhoexam.com")}
            >
              <Ionicons name="mail" size={28} color={activeColors.primary} />
              <ThemedText style={{ marginTop: 8, fontWeight: "600" }}>
                Email Us
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.contactCard,
                {
                  backgroundColor: isDark ? activeColors.card : "#FFF",
                  borderColor: activeColors.border,
                },
              ]}
              onPress={() => Linking.openURL("tel:+919876543210")}
            >
              <Ionicons name="call" size={28} color={activeColors.secondary} />
              <ThemedText style={{ marginTop: 8, fontWeight: "600" }}>
                Call Us
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <ThemedText
          variant="subtitle"
          style={{ marginBottom: 15, marginTop: 10 }}
        >
          Frequently Asked Questions
        </ThemedText>

        {FAQS.map((faq) => (
          <TouchableOpacity
            key={faq.id}
            activeOpacity={0.8}
            onPress={() => toggleExpand(faq.id)}
            style={[
              styles.faqItem,
              {
                backgroundColor: isDark ? activeColors.card : "#FFF",
                borderColor: activeColors.border,
              },
            ]}
          >
            <View style={styles.faqHeader}>
              <ThemedText style={{ flex: 1, fontWeight: "600" }}>
                {faq.question}
              </ThemedText>
              <Ionicons
                name={expandedId === faq.id ? "chevron-up" : "chevron-down"}
                size={20}
                color={activeColors.textSecondary}
              />
            </View>
            {expandedId === faq.id && (
              <View style={styles.faqBody}>
                <ThemedText style={{ color: activeColors.textSecondary }}>
                  {faq.answer}
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  contactContainer: { marginBottom: 30 },
  contactRow: { flexDirection: "row", gap: 15 },
  contactCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  faqItem: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    overflow: "hidden",
  },
  faqHeader: { flexDirection: "row", alignItems: "center", padding: 15 },
  faqBody: { paddingHorizontal: 15, paddingBottom: 15 },
});
