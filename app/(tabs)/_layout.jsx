import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useTheme } from "../../context/ThemeContext";
import { useAuthUser } from "../../src/hooks/useAuthUser";

/* Utils */
const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

/* Header */
const CustomHeader = () => {
  const router = useRouter();
  const { isDark, toggleTheme, activeColors } = useTheme();
  const { user } = useAuthUser();

  const initials = useMemo(
    () => getInitials(user?.data?.name),
    [user?.data?.name],
  );
  console.log("User Initials:", user?.data?.name);

  return (
    <SafeAreaView
      edges={["top"]}
      style={[
        styles.headerContainer,
        {
          backgroundColor: activeColors.background,
          borderBottomColor: activeColors.border,
        },
      ]}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />
          <Text style={[styles.brand, { color: activeColors.text }]}>
            Dekho
            <Text style={{ color: activeColors.secondary }}>Exam</Text>
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.iconBtn, { backgroundColor: activeColors.inputBg }]}
          >
            <Ionicons
              name={isDark ? "sunny-outline" : "moon-outline"}
              size={20}
              color={isDark ? "#FFD700" : activeColors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile")}
            style={styles.avatarWrapper}
          >
            <View
              style={[styles.avatar, { backgroundColor: activeColors.primary }]}
            >
              <Text style={styles.avatarText}>{initials}</Text>
            </View>

            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: activeColors.success,
                  borderColor: activeColors.background,
                },
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

/* Tabs */
export default function TabLayout() {
  const { activeColors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        header: () => <CustomHeader />,
        tabBarActiveTintColor: activeColors.secondary,
        tabBarInactiveTintColor: activeColors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: activeColors.background,
            borderTopColor: activeColors.border,
            paddingBottom: insets.bottom || 10,
            height: 60 + (insets.bottom || 10),
          },
        ],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="tests"
        options={{
          title: "Tests",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "document-text" : "document-text-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="analysis"
        options={{
          title: "Analysis",
          tabBarIcon: () => (
            <View
              style={[
                styles.centerTab,
                {
                  backgroundColor: activeColors.secondary,
                  borderColor: activeColors.background,
                },
              ]}
            >
              <Ionicons name="stats-chart" size={26} color="#FFF" />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="pass"
        options={{
          title: "Pro Pass",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "diamond" : "diamond-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

/* Styles */
const styles = StyleSheet.create({
  headerContainer: { borderBottomWidth: 1, paddingHorizontal: 16 },
  headerContent: {
    height: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logo: { width: 34, height: 34, marginRight: 8, borderRadius: 8 },
  brand: { fontSize: 20, fontWeight: "800" },
  headerRight: { flexDirection: "row", gap: 12 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarWrapper: { width: 38, height: 38 },
  avatar: {
    flex: 1,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#FFF", fontWeight: "800" },
  statusDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  tabBar: { borderTopWidth: 1, paddingTop: 6 },
  tabLabel: { fontSize: 10, fontWeight: "700" },
  centerTab: {
    top: -16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    elevation: 10,
  },
});
