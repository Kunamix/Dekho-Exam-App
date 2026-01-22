import { StyleSheet, View } from "react-native";

export function CategorySkeleton({ width }) {
  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.circle} />
      <View style={styles.lineShort} />
      <View style={styles.lineTiny} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
    marginBottom: 12,
  },
  lineShort: {
    width: "60%",
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginBottom: 6,
  },
  lineTiny: {
    width: "40%",
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
  },
});
