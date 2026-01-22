import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ================= BRAND COLORS ================= */
const COLORS = {
  bg: "#FFFFFF",
  primary: "#007ACC",
  accent: "#FF9F1C",
  text: "#1F2937",
  subText: "#6B7280",
};

/* ================= SLIDES ================= */
const SLIDES = [
  {
    id: "1",
    title: "Set your\nExam Goals",
    subtitle:
      "Your goals will help us to formulate the right question sets for success.",
    image: require("../assets/images/breathtaking_illustration_of_3.png"),
  },
  {
    id: "2",
    title: "Follow our Tips\nand Tricks",
    subtitle:
      "We help our users to make the right study decisions with smart analysis.",
    image: require("../assets/images/tips.png"),
  },
  {
    id: "3",
    title: "Enjoy Exam\nSuccess",
    subtitle:
      "You can track your progress and achievements in a special section.",
    image: require("../assets/images/breathtaking.png"),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const flatListRef = useRef < FlatList > null;
  const scrollX = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ================= INITIAL CHECK ================= */
  useEffect(() => {
    bootstrap();
    startFloatingAnimation();
  }, []);

  const bootstrap = async () => {
    try {
      const [hasLaunched, accessToken] = await Promise.all([
        AsyncStorage.getItem("hasLaunched"),
        AsyncStorage.getItem("accessToken"),
      ]);

      // ✅ Logged in → skip onboarding
      if (accessToken) {
        router.replace("/(tabs)");
        return;
      }

      // ✅ Onboarding done but not logged in
      if (hasLaunched === "true") {
        router.replace("/(auth)/login");
        return;
      }

      // ❌ First launch → show onboarding
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  /* ================= FLOATING IMAGE ================= */
  const startFloatingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  /* ================= NEXT HANDLER ================= */
  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
      });
    } else {
      await AsyncStorage.setItem("hasLaunched", "true");
      router.replace("/(auth)/login");
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  /* ================= BACKGROUND PATH ================= */
  const BackgroundPath = () => {
    const rotate = scrollX.interpolate({
      inputRange: [0, width, width * 2],
      outputRange: ["-25deg", "0deg", "-35deg"],
    });

    const translateX = scrollX.interpolate({
      inputRange: [0, width, width * 2],
      outputRange: [0, -50, -100],
    });

    const scale = scrollX.interpolate({
      inputRange: [0, width, width * 2],
      outputRange: [1, 1.2, 1],
    });

    return (
      <Animated.View
        style={[
          styles.pathBase,
          {
            width: width * 1.5,
            transform: [{ rotate }, { translateX }, { scale }],
          },
        ]}
      />
    );
  };

  /* ================= SLIDE ================= */
  const Slide = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const textTranslateY = scrollX.interpolate({
      inputRange,
      outputRange: [50, 0, 50],
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
    });

    return (
      <View style={[styles.slide, { width }]}>
        <Animated.View
          style={[styles.imageContainer, { transform: [{ translateY }] }]}
        >
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            { opacity, transform: [{ translateY: textTranslateY }] },
          ]}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </Animated.View>
      </View>
    );
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={StyleSheet.absoluteFillObject}>
        <View style={styles.pathContainer}>
          <BackgroundPath />
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={({ item, index }) => <Slide item={item} index={index} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        scrollEventThrottle={16}
      />

      <View style={styles.footer}>
        <View style={styles.paginator}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 25, 10],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={i}
                style={[styles.dot, { width: dotWidth }]}
              />
            );
          })}
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleNext}>
          <Ionicons
            name={
              currentIndex === SLIDES.length - 1 ? "checkmark" : "arrow-forward"
            }
            size={24}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  slide: { flex: 1, alignItems: "center", justifyContent: "center" },

  pathContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
  pathBase: {
    height: 500,
    backgroundColor: COLORS.accent,
    borderRadius: 200,
    opacity: 0.9,
  },

  imageContainer: {
    flex: 0.9,
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
  },
  image: { width: "100%", height: "100%" },

  textContainer: {
    flex: 0.3,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: COLORS.subText,
  },

  footer: {
    height: 120,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  paginator: { flexDirection: "row", alignItems: "center" },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: COLORS.accent,
  },
  btn: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
  },
});
