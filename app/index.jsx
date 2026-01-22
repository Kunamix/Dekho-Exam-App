import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { useAuth } from "../src/hooks/AuthContext";

export default function Index() {
  const { isAuthenticated, initializing } = useAuth();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* CHECK ONBOARDING */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const checkOnboarding = async () => {
      const launched = await AsyncStorage.getItem("hasLaunched");
      setHasLaunched(launched === "true");
      setOnboardingChecked(true);
    };

    checkOnboarding();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* LOADING SCREEN */
  /* -------------------------------------------------------------------------- */
  if (initializing || !onboardingChecked) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Preparing app…</Text>
      </View>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* AUTH ROUTING */
  /* -------------------------------------------------------------------------- */

  // ✅ Logged in → Main app
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  // ❌ Not logged in but onboarding done → Login
  if (hasLaunched) {
    return <Redirect href="/(auth)/login" />;
  }

  // ❌ First launch → Onboarding
  return <Redirect href="/onboarding" />;
}
