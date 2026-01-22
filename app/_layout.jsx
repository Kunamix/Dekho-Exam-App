import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { AuthProvider } from "../src/hooks/AuthContext";

// Prevent splash from auto-hiding
SplashScreen.preventAutoHideAsync();

/* ================= ROOT NAV ================= */
function RootNavigator() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        {/* Entry Gate */}
        <Stack.Screen name="index" />

        {/* Auth Flow */}
        <Stack.Screen name="(auth)" />

        {/* Main App */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

/* ================= ROOT LAYOUT ================= */
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Add fonts here if needed
    // "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
