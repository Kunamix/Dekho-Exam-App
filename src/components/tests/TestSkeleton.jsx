import { StyleSheet, View } from "react-native";

export function TestSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.lineSmall} />
      <View style={styles.lineBig} />
      <View style={styles.lineMid} />
      <View style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  lineSmall: {
    width: 60,
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginBottom: 12,
  },
  lineBig: {
    width: "80%",
    height: 18,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginBottom: 16,
  },
  lineMid: {
    width: "60%",
    height: 14,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginBottom: 16,
  },
  button: {
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
});
