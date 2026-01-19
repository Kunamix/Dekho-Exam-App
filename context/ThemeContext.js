// context/ThemeContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { Colors } from "../src/constants/Colors";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme(); // Get system default
  const [scheme, setScheme] = useState(systemScheme ?? "light");

  // Update if system changes (optional, usually we want manual override to persist)
  useEffect(() => {
    if (!scheme) setScheme(systemScheme);
  }, [systemScheme]);

  const toggleTheme = () => {
    setScheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = scheme === "dark";
  const activeColors = Colors[scheme ?? "light"];

  return (
    <ThemeContext.Provider
      value={{ scheme, isDark, toggleTheme, activeColors }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme anywhere
export const useTheme = () => useContext(ThemeContext);
