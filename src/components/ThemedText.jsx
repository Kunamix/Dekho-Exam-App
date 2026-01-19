// components/ThemedText.jsx
import { StyleSheet, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // Import custom hook

export function ThemedText({ style, variant = "default", color, ...rest }) {
  const { activeColors } = useTheme(); // Get colors from Context

  let variantStyle = styles.default;
  if (variant === "title") variantStyle = styles.title;
  if (variant === "subtitle") variantStyle = styles.subtitle;
  if (variant === "caption") variantStyle = styles.caption;
  if (variant === "link")
    variantStyle = { ...styles.link, color: activeColors.primary };

  const textColor =
    color || (variant === "link" ? activeColors.primary : activeColors.text);

  return <Text style={[{ color: textColor }, variantStyle, style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: { fontSize: 16, lineHeight: 24 },
  title: { fontSize: 28, fontWeight: "bold", lineHeight: 34 },
  subtitle: { fontSize: 20, fontWeight: "600", lineHeight: 28 },
  caption: { fontSize: 14, lineHeight: 20, opacity: 0.7 },
  link: { fontSize: 16, lineHeight: 24, fontWeight: "600" },
});
