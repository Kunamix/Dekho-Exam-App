import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
  style,
}) {
  const { activeColors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: activeColors.inputBg,
          borderColor: activeColors.border,
        },
        style,
      ]}
    >
      {/* Search Icon */}
      <Ionicons
        name="search"
        size={20}
        color={activeColors.textSecondary}
        style={{ marginRight: 10 }}
      />

      {/* Input Field */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={activeColors.textSecondary}
        style={[styles.input, { color: activeColors.text }]}
        autoCorrect={false}
      />

      {/* Clear (X) Button - Only shows when text exists */}
      {value?.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText("")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="close-circle"
            size={18}
            color={activeColors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 15,
    borderWidth: 1,
    width: "100%",
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
});
