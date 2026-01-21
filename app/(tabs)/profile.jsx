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
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { getMe, logoutUser } from "../../src/api/auth.api";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

export default function ProfileScreen() {
  const router = useRouter();
  const { activeColors, toggleTheme, isDark } = useTheme();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await getMe();
      setUser(res);
    } catch (err) {
      Alert.alert("Error", err);
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
            await logoutUser();
          } catch (_) {
            // ignore API failure
          } finally {
            await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
            router.replace("/(auth)/login");
          }
        },
      },
    ]);
  };

  const MenuItem = ({ icon, label, onPress, isDestructive }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: activeColors.inputBg }]}>
        <Ionicons
          name={icon}
          size={20}
          color={isDestructive ? "#EF4444" : activeColors.text}
        />
      </View>
      <ThemedText
        style={{
          flex: 1,
          marginLeft: 15,
          color: isDestructive ? "#EF4444" : activeColors.text,
        }}
      >
        {label}
      </ThemedText>
      <Ionicons
        name="chevron-forward"
        size={18}
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
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* USER INFO */}
        <View style={styles.userSection}>
          <Image
            source={{
              uri:
                user?.avatar ||
                "https://ui-avatars.com/api/?name=User&background=007ACC&color=fff",
            }}
            style={styles.avatar}
          />
          <ThemedText style={styles.userName}>
            {user?.name || "Student"}
          </ThemedText>
          <ThemedText variant="caption">{user?.phoneNumber}</ThemedText>
        </View>

        {/* MENU */}
        <View
          style={[
            styles.menuContainer,
            { backgroundColor: isDark ? activeColors.card : "#FFF" },
          ]}
        >
          <MenuItem
            icon="diamond-outline"
            label="My Subscription"
            onPress={() => router.push("/subscription")}
          />
          <MenuItem
            icon="receipt-outline"
            label="Test History"
            onPress={() => router.push("/history")}
          />
          <MenuItem
            icon={isDark ? "sunny-outline" : "moon-outline"}
            label="Switch Theme"
            onPress={toggleTheme}
          />
          <MenuItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => router.push("/support")}
          />
          <MenuItem
            icon="log-out-outline"
            label="Logout"
            isDestructive
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  userSection: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  menuContainer: {
    borderRadius: 16,
    padding: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
