import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
// 1. Import from safe-area-context (NOT react-native)
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";

export function ThemedScreen({
  children,
  style,
  noPadding = false,
  // 2. Add edges prop (Default: Apply padding to ALL sides)
  edges = ["top", "left", "right", "bottom"],
}) {
  const { activeColors, isDark } = useTheme();

  return (
    <SafeAreaView
      // 3. Pass the edges to SafeAreaView
      edges={edges}
      style={[styles.container, { backgroundColor: activeColors.background }]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={[styles.content, !noPadding && styles.padding, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  padding: {
    paddingHorizontal: 20,
    // We remove paddingTop here because SafeAreaView 'edges' handles it now
    paddingBottom: 20,
  },
});
