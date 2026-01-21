import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../../context/ThemeContext";
// 1. Import Service
import { authService } from "../../services/student.service";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

// --- Helper for Text Avatar ---
const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export default function ProfileScreen() {
  const router = useRouter();
  const { activeColors, toggleTheme, isDark } = useTheme();

  const [user, setUser] = useState < any > null;
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await authService.getMe();
      setUser(res);
    } catch (err) {
      console.log("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await authService.logout();
          } catch (_) {
            // ignore API failure, force logout client-side
          } finally {
            await AsyncStorage.multiRemove([
              "accessToken",
              "refreshToken",
              "authPhone",
            ]);
            router.replace("/(auth)/login");
          }
        },
      },
    ]);
  };

  const MenuItem = ({ icon, label, onPress, isDestructive, value }) => (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: activeColors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: isDestructive ? "#FEE2E2" : activeColors.inputBg },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={isDestructive ? "#EF4444" : activeColors.text}
        />
      </View>
      <View style={styles.menuTextContainer}>
        <ThemedText
          style={{
            fontSize: 16,
            fontWeight: "500",
            color: isDestructive ? "#EF4444" : activeColors.text,
          }}
        >
          {label}
        </ThemedText>
        {value && <ThemedText variant="caption">{value}</ThemedText>}
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={activeColors.textSecondary}
      />
    </TouchableOpacity>
  );

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <ThemedScreen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={activeColors.primary} />
        </View>
      </ThemedScreen>
    );
  }

  return (
    <ThemedScreen edges={["left", "right", "bottom"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* USER PROFILE HEADER */}
        <View style={styles.userSection}>
          <View
            style={[
              styles.avatarContainer,
              { borderColor: activeColors.border },
            ]}
          >
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: activeColors.primary },
                ]}
              >
                <Text style={styles.avatarText}>
                  {getInitials(user?.name || "Student")}
                </Text>
              </View>
            )}

            {/* Edit Badge */}
            <TouchableOpacity
              style={[
                styles.editBadge,
                {
                  backgroundColor: activeColors.card,
                  borderColor: activeColors.border,
                },
              ]}
            >
              <Ionicons name="pencil" size={12} color={activeColors.text} />
            </TouchableOpacity>
          </View>

          <ThemedText style={styles.userName}>
            {user?.name || "Student User"}
          </ThemedText>
          <ThemedText variant="caption" style={{ fontSize: 14 }}>
            {user?.phoneNumber || "+91 98765 43210"}
          </ThemedText>
        </View>

        {/* STATS ROW (Optional) */}
        <View style={[styles.statsRow, { borderColor: activeColors.border }]}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>
              {user?.testsAttempted || 0}
            </ThemedText>
            <ThemedText variant="caption">Tests</ThemedText>
          </View>
          <View
            style={[
              styles.statDivider,
              { backgroundColor: activeColors.border },
            ]}
          />
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>Free</ThemedText>
            <ThemedText variant="caption">Plan</ThemedText>
          </View>
        </View>

        {/* MENU GROUPS */}
        <View style={styles.sectionHeader}>
          <ThemedText
            variant="caption"
            style={{ fontWeight: "700", opacity: 0.6 }}
          >
            ACCOUNT
          </ThemedText>
        </View>

        <View
          style={[
            styles.menuContainer,
            {
              backgroundColor: isDark ? activeColors.card : "#FFF",
              borderColor: activeColors.border,
            },
          ]}
        >
          <MenuItem
            icon="diamond-outline"
            label="My Subscription"
            value="Upgrade to Pro"
            onPress={() => router.push("/(tabs)/pass")}
          />
          <MenuItem
            icon="time-outline"
            label="Test History"
            onPress={() => router.push("/(tabs)/analysis")}
          />
          <MenuItem
            icon="person-outline"
            label="Personal Details"
            onPress={() => {}}
          />
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText
            variant="caption"
            style={{ fontWeight: "700", opacity: 0.6 }}
          >
            PREFERENCES
          </ThemedText>
        </View>

        <View
          style={[
            styles.menuContainer,
            {
              backgroundColor: isDark ? activeColors.card : "#FFF",
              borderColor: activeColors.border,
            },
          ]}
        >
          <MenuItem
            icon={isDark ? "sunny-outline" : "moon-outline"}
            label="Appearance"
            value={isDark ? "Dark Mode" : "Light Mode"}
            onPress={toggleTheme}
          />
          <MenuItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => {}}
          />
          <MenuItem
            icon="log-out-outline"
            label="Logout"
            isDestructive
            onPress={handleLogout}
          />
        </View>

        <ThemedText style={styles.versionText}>Version 1.0.0</ThemedText>
      </ScrollView>
    </ThemedScreen>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userSection: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 20,
  },
  /* Avatar Styles */
  avatarContainer: {
    marginBottom: 16,
    borderWidth: 1,
    padding: 4,
    borderRadius: 60,
    position: "relative",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFF",
    fontSize: 36,
    fontWeight: "700",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    elevation: 2,
  },

  userName: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },

  /* Stats Row */
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 1,
    borderRadius: 16,
    marginHorizontal: 20,
    paddingVertical: 12,
    borderStyle: "dashed",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
  },
  statDivider: {
    width: 1,
    height: "80%",
  },

  /* Menu */
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 10,
  },
  menuContainer: {
    borderRadius: 16,
    paddingHorizontal: 6,
    marginHorizontal: 20,
    borderWidth: 1,
    marginBottom: 10,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  // Remove border from last item manually if needed, or rely on overflow hidden
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  versionText: {
    textAlign: "center",
    opacity: 0.3,
    fontSize: 12,
    marginTop: 20,
    marginBottom: 20,
  },
});
