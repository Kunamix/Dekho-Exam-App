import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { authService } from "../../services/student.service";

export function useAuthUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      // 1️⃣ Load cached user first
      const cached = await AsyncStorage.getItem("userProfile");
      if (cached) {
        setUser(JSON.parse(cached));
      }

      // 2️⃣ Refresh from API (source of truth)
      const fresh = await authService.getMe();
      setUser(fresh);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return { user, loading, refresh: loadUser };
}
