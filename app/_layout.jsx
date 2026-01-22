import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { AuthProvider, useAuth } from "../src/hooks/AuthContext";

// Prevent splash from auto-hiding
SplashScreen.preventAutoHideAsync();

/* ================= ROOT NAV ================= */
function RootNavigator() {
  const { isDark } = useTheme();
  const { loading } = useAuth();

  // Don't render navigation until auth is checked
  if (loading) {
    return null;
  }

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

        {/* Onboarding */}
        <Stack.Screen name="onboarding" />

        {/* Auth Flow (Login, OTP, Profile Setup) */}
        <Stack.Screen name="(auth)" />

        {/* Main App (Tabs) */}
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

  // Keep splash screen visible until fonts are loaded
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
