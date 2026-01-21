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

// --- BRAND COLORS ---
const COLORS = {
  bg: "#FFFFFF",
  primary: "#007ACC",
  accent: "#FF9F1C",
  text: "#1F2937",
  subText: "#6B7280",
};

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
  const { width, height } = useWindowDimensions();
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Floating Animation Value
  const floatAnim = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    checkOnboardingStatus();
    startFloatingAnimation();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      if (hasLaunched === "true") {
        // Change to "true" for production logic
        router.replace("/(auth)/login");
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  // --- 1. Floating Animation Logic ---
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

  // Interpolate floating value to pixels (Up/Down movement)
  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15], // Moves up 15px then down
  });

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      try {
        await AsyncStorage.setItem("hasLaunched", "true");
        router.replace("/(auth)/login");
      } catch (error) {
        console.log("Error", error);
      }
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  // --- 2. Parallax Background Component ---
  const BackgroundPath = () => {
    // We animate the path's rotation and position based on scrollX
    const rotate = scrollX.interpolate({
      inputRange: [0, width, width * 2],
      outputRange: ["-25deg", "0deg", "-35deg"],
    });

    const translateX = scrollX.interpolate({
      inputRange: [0, width, width * 2],
      outputRange: [0, -50, -100], // Moves slightly left as you swipe right
    });

    const scale = scrollX.interpolate({
      inputRange: [0, width, width * 2],
      outputRange: [1, 1.2, 1], // Pulses bigger in the middle
    });

    return (
      <Animated.View
        style={[
          styles.pathBase,
          {
            width: width * 1.5, // Wider than screen for parallax
            transform: [{ rotate }, { translateX }, { scale }],
          },
        ]}
      />
    );
  };

  const Slide = ({ item, index }) => {
    // Parallax Logic for Text Entrance
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const textTranslateY = scrollX.interpolate({
      inputRange,
      outputRange: [50, 0, 50], // Text comes up from bottom
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0], // Fades in and out
    });

    return (
      <View style={[styles.slide, { width }]}>
        {/* Character Image with Float Animation */}
        <Animated.View
          style={[styles.imageContainer, { transform: [{ translateY }] }]}
        >
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Text Content with Scroll Animation */}
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Shared Background Path (Behind FlatList) */}
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
        scrollEventThrottle={16} // Smooth animation updates
      />

      {/* Bottom Footer Area */}
      <View style={styles.footer}>
        {/* Animated Progress Dots */}
        <View style={styles.paginator}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 25, 10], // Active dot gets wider
              extrapolate: "clamp",
            });
            const dotColor = scrollX.interpolate({
              inputRange,
              outputRange: ["#D1D5DB", COLORS.accent, "#D1D5DB"],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  { width: dotWidth, backgroundColor: dotColor },
                ]}
              />
            );
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor:
                currentIndex === SLIDES.length - 1 ? COLORS.accent : "#111827",
            },
          ]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // --- The Orange Path Styles ---
  pathContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
    overflow: "hidden", // Prevent path from going outside screen
  },
  pathBase: {
    height: 500, // Big Blob
    backgroundColor: COLORS.accent,
    borderRadius: 200,
    position: "absolute",
    top: "25%", // Center vertically approx
    opacity: 0.9,
  },

  // --- Content Styles ---
  imageContainer: {
    flex: 0.9,
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    zIndex: 10,
  },
  image: {
    width: "100%", // Slightly bigger for better visual
    height: "100%",
  },
  textContainer: {
    flex: 0.3,
    paddingHorizontal: 30,
    alignItems: "center",
    zIndex: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "900", // Extra bold
    textAlign: "center",
    marginBottom: 10,
    color: COLORS.text,
    lineHeight: 40,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: COLORS.subText,
    lineHeight: 24,
    fontWeight: "500",
  },

  // --- Footer ---
  footer: {
    height: 120, // Taller footer
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  paginator: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  btn: {
    width: 64,
    height: 64,
    borderRadius: 24, // Modern Squircle
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
});
