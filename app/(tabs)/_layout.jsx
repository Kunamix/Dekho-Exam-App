import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 1. Import the Hook
import { useTheme } from "../../context/ThemeContext";

// --- CUSTOM HEADER ---
const CustomHeader = () => {
  const router = useRouter();

  // 2. Consume the Global Theme Context
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
          {/* THEME TOGGLE BUTTON */}
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
  // 3. Consume Context here for Tab Bar styling
  const { activeColors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        header: () => <CustomHeader />, // No need to pass props, header uses context
        tabBarActiveTintColor: activeColors.secondary,
        tabBarInactiveTintColor: activeColors.textSecondary,
        tabBarShowLabel: true,

        tabBarStyle: {
          backgroundColor: activeColors.background,
          borderTopColor: activeColors.border,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 85 : 70,
          paddingBottom: Platform.OS === "ios" ? 28 : 12,
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

      {/* Center Tab */}
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

      <Tabs.Screen
        name="testRunner"
        options={{ href: null, header: () => null }}
      />
      <Tabs.Screen
        name="testResult"
        options={{ href: null, header: () => null }}
      />
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
    paddingBottom: 10,
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
