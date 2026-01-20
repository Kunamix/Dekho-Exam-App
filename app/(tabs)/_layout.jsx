import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// 1. Import SafeAreaInsets
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useTheme } from "../../context/ThemeContext";

const CustomHeader = () => {
  const router = useRouter();
  const { isDark, toggleTheme, activeColors } = useTheme();

  return (
    <SafeAreaView
      edges={["top"]}
      style={[
        styles.headerContainer,
        {
          backgroundColor: activeColors.background,
          borderColor: activeColors.border,
        },
      ]}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.headerTitle, { color: activeColors.text }]}>
            Dekho<Text style={{ color: activeColors.secondary }}>Exam</Text>
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.iconBtn, { backgroundColor: activeColors.inputBg }]}
          >
            <Ionicons
              name={isDark ? "sunny" : "moon"}
              size={20}
              color={isDark ? "#FFD700" : activeColors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile")}
            style={styles.profileBtn}
          >
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=12" }}
              style={styles.avatar}
            />
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

export default function TabLayout() {
  const { activeColors } = useTheme();

  // 2. Get safe area insets (bottom is crucial here)
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        header: () => <CustomHeader />,
        tabBarActiveTintColor: activeColors.secondary,
        tabBarInactiveTintColor: activeColors.textSecondary,
        tabBarShowLabel: true,

        tabBarStyle: {
          backgroundColor: activeColors.background,
          borderTopColor: activeColors.border,
          borderTopWidth: 1,

          // 3. DYNAMIC HEIGHT & PADDING CALCULATION
          // Base height (60) + Safe Area Bottom Inset
          height: 60 + (insets.bottom > 0 ? insets.bottom : 10),

          // Padding bottom matches the inset (or defaults to 10px)
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,

          paddingTop: 8,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
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
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="analysis"
        options={{
          title: "Analysis",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.centerTab,
                {
                  backgroundColor: activeColors.secondary,
                  shadowColor: activeColors.secondary,
                  borderColor: activeColors.background,
                },
              ]}
            >
              <Ionicons name="stats-chart" size={26} color="#FFF" />
            </View>
          ),
          tabBarLabelStyle: {
            marginTop: 22,
            fontWeight: "800",
            color: activeColors.secondary,
          },
        }}
      />

      <Tabs.Screen
        name="pass"
        options={{
          title: "Pro Pass",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "diamond" : "diamond-outline"}
              size={24}
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
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* <Tabs.Screen
        name="testRunner"
        options={{ href: null, header: () => null }}
      /> */}
      {/* <Tabs.Screen
        name="testResult"
        options={{ href: null, header: () => null }}
      /> */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logoContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 8,
  },
  logoImage: { width: "100%", height: "100%" },
  headerTitle: { fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  avatar: { width: "100%", height: "100%", borderRadius: 20 },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
  },
  centerTab: {
    alignItems: "center",
    justifyContent: "center",
    top: -15,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 4,
  },
});
