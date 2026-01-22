import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  loading: true,
  user: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const router = useRouter();
  const segments = useSegments();

  // Bootstrap auth on app load
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const profileStr = await AsyncStorage.getItem("userProfile");

        if (token && profileStr) {
          const profile = JSON.parse(profileStr);
          setUser(profile);
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth bootstrap error:", error);
        setAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  // Protected route navigation
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "onboarding";

    if (!isAuthenticated && !inAuthGroup && !inOnboarding) {
      // Redirect to onboarding if not authenticated and not already there
      router.replace("/onboarding");
    } else if (isAuthenticated && (inAuthGroup || inOnboarding)) {
      // Redirect to home if authenticated but in auth/onboarding
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments, loading]);

  const login = async (token, profile) => {
    try {
      await AsyncStorage.setItem("accessToken", token);
      await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
      setUser(profile);
      setAuthenticated(true);
    } catch (error) {
      console.error("Login storage error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("userProfile");
      setUser(null);
      setAuthenticated(false);
      router.replace("/onboarding");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = async (updatedProfile) => {
    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      setUser(updatedProfile);
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
