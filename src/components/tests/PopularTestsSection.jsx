import { useRouter } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import TestCard from "./TestCard";
import { TestSkeleton } from "./TestSkeleton";

export function PopularTestsSection({ tests, loading }) {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <ThemedText variant="subtitle">Popular Tests</ThemedText>
      </View>

      {loading ? (
        <>
          {[...Array(3)].map((_, i) => (
            <TestSkeleton key={i} />
          ))}
        </>
      ) : (
        <FlatList
          data={tests}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TestCard
              item={item}
              onPress={() => router.push(`/exam/${item.id}`)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
});
