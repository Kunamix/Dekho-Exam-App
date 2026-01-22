import { useRouter } from "expo-router";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import CategoryCard from "./CategoryCard";
import { CategorySkeleton } from "./CategorySkeleton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function CategoriesSection({ title, categories, isSearching, loading }) {
  const router = useRouter();
  const cardWidth = isSearching ? (SCREEN_WIDTH - 56) / 2 : 110;

  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.header}>
          <ThemedText variant="subtitle">{title}</ThemedText>
        </View>
        <View style={styles.skeletonRow}>
          {[...Array(4)].map((_, i) => (
            <CategorySkeleton key={i} width={cardWidth} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <ThemedText variant="subtitle">{title}</ThemedText>
      </View>

      {/* Horizontal list */}
      {!isSearching && (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          renderItem={({ item, index }) => (
            <CategoryCard
              item={item}
              index={index}
              width={cardWidth}
              onPress={() =>
                router.push({
                  pathname: `/categories/${item.id}`,
                  params: { name: item.name },
                })
              }
            />
          )}
        />
      )}

      {/* Grid list */}
      {isSearching && (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item, index }) => (
            <CategoryCard
              item={item}
              index={index}
              width={cardWidth}
              onPress={() =>
                router.push({
                  pathname: `/categories/${item.id}`,
                  params: { name: item.name },
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  skeletonRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
  },
});
