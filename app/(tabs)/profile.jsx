import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { authService } from "../../services/student.service";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";
import { useUpdateProfile } from "../../src/hooks/useStudentActions";

/* -------------------------------------------------------------------------- */
/* Utils */
/* -------------------------------------------------------------------------- */
const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

/* -------------------------------------------------------------------------- */
/* Profile Screen */
/* -------------------------------------------------------------------------- */
export default function ProfileScreen() {
  const router = useRouter();
  const { activeColors, toggleTheme, isDark } = useTheme();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const { updateProfile, loading: updating } = useUpdateProfile();

  /* ================= LOAD PROFILE ================= */
  const loadProfile = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      // 1️⃣ Load cached user instantly
      const cached = await AsyncStorage.getItem("userProfile");
      if (cached) {
        setUser(JSON.parse(cached));
      }

      // 2️⃣ Fetch fresh user from API
      const res = await authService.getMe();

      // ✅ FIX: normalize API response
      const userData = res?.data ?? res;

      if (userData) {
        setUser(userData);
        await AsyncStorage.setItem("userProfile", JSON.stringify(userData));
      }
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  /* ================= EDIT ================= */
  const handleEditPress = () => {
    setEditName(user?.name ?? "");
    setEditEmail(user?.email ?? "");
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert("Required", "Name cannot be empty");
      return;
    }

    await updateProfile({ name: editName, email: editEmail }, async () => {
      setEditModalVisible(false);
      await loadProfile(false); // 🔥 refresh cache + UI
      Alert.alert("Success", "Profile updated successfully");
    });
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
          } catch (_) {}

          await AsyncStorage.multiRemove([
            "accessToken",
            "refreshToken",
            "userProfile",
            "authPhone",
          ]);

          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  /* ================= MENU ITEM ================= */
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

  /* ================= UI ================= */
  return (
    <ThemedScreen edges={["left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* PROFILE HEADER */}
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
                <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.editBadge,
                {
                  backgroundColor: activeColors.card,
                  borderColor: activeColors.border,
                },
              ]}
              onPress={handleEditPress}
            >
              <Ionicons name="pencil" size={14} color={activeColors.text} />
            </TouchableOpacity>
          </View>

          <ThemedText style={styles.userName}>
            {user?.name ?? "Student User"}
          </ThemedText>
          <ThemedText variant="caption">
            {user?.phoneNumber || user?.email || "—"}
          </ThemedText>
        </View>

        {/* STATS */}
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
            <ThemedText style={styles.statValue}>
              {user?.subscription?.name || "Free"}
            </ThemedText>
            <ThemedText variant="caption">Plan</ThemedText>
          </View>
        </View>

        {/* ACCOUNT */}
        <View style={styles.menuContainer}>
          <MenuItem
            icon="diamond-outline"
            label="My Subscription"
            value="Upgrade"
            onPress={() => router.push("/subscription")}
          />
          <MenuItem
            icon="time-outline"
            label="Test History"
            onPress={() => router.push("/history")}
          />
          <MenuItem
            icon="person-outline"
            label="Edit Profile"
            onPress={handleEditPress}
          />
          <MenuItem
            icon={isDark ? "sunny-outline" : "moon-outline"}
            label="Appearance"
            value={isDark ? "Dark Mode" : "Light Mode"}
            onPress={toggleTheme}
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

      {/* EDIT MODAL */}
      <Modal visible={isEditModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? activeColors.card : "#FFF" },
            ]}
          >
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Edit Profile</ThemedText>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Full Name"
            />
            <TextInput
              style={styles.input}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Email"
              keyboardType="email-address"
            />

            <TouchableOpacity
              style={[
                styles.saveBtn,
                { backgroundColor: activeColors.primary },
              ]}
              onPress={handleSaveProfile}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.saveBtnText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ThemedScreen>
  );
}

/* -------------------------------------------------------------------------- */
/* Styles */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  userSection: { alignItems: "center", marginVertical: 24 },
  avatarContainer: {
    borderWidth: 1,
    padding: 4,
    borderRadius: 60,
    marginBottom: 12,
  },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#FFF", fontSize: 36, fontWeight: "700" },
  editBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  userName: { fontSize: 24, fontWeight: "800" },

  statsRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 16,
    marginHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 30,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "800" },
  statDivider: { width: 1 },

  menuContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextContainer: { flex: 1, marginLeft: 16 },

  versionText: {
    textAlign: "center",
    opacity: 0.3,
    marginTop: 20,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  saveBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
