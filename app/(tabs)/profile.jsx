import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { useTheme } from "../../context/ThemeContext";
import { ThemedScreen } from "../../src/components/ThemedScreen";
import { ThemedText } from "../../src/components/ThemedText";

export default function ProfileScreen() {
  const router = useRouter();
  const { activeColors, toggleTheme, isDark } = useTheme();

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

  return (
    <ThemedScreen edges={["left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* User Info */}
        <View style={styles.userSection}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=12" }}
            style={styles.avatar}
          />
          <ThemedText style={styles.userName}>John Doe</ThemedText>
          <ThemedText variant="caption">+91 98765 43210</ThemedText>
        </View>

        {/* Menu */}
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
            onPress={() => router.replace("/(auth)/login")}
          />
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  userSection: { alignItems: "center", marginBottom: 30, marginTop: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  userName: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  menuContainer: { borderRadius: 16, padding: 10 },
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
});
