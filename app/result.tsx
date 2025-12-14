import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";

import Header from "@/components/Header";
import { Colors } from "@/styles/theme";
import { loadProfile } from "@/storage/profileStorage";
import { getRank } from "@/utils/rank";
import { rankImages } from "@/utils/images";
import { Profile } from "@/types/profile";
import { Rank } from "@/types/rank";

export default function ResultScreen() {
  const { score } = useLocalSearchParams<{ score?: string }>();
  const numericScore = Number(score);

  const [highScore, setHighScore] = useState<number | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    loadProfile().then(setProfile);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!Number.isNaN(numericScore)) {
      updateHighScore();
    }
  }, [numericScore]);

  const updateHighScore = async () => {
    const stored = await AsyncStorage.getItem("highScore");
    const storedNumber = stored ? Number(stored) : null;

    if (storedNumber === null || numericScore > storedNumber) {
      await AsyncStorage.setItem("highScore", String(numericScore));
      setHighScore(numericScore);
    } else {
      setHighScore(storedNumber);
    }
  };

  const rank: Rank = profile
    ? getRank(profile.correctAnswers)
    : "Student";

  return (
    <View style={styles.screen}>
      <Header title="Resultaat" showBack />

      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Rank image */}
        <Image
          source={rankImages[rank]}
          style={styles.rankImage}
          contentFit="contain"
        />

        {/* Rank text */}
        <Text style={styles.rankText}>{rank}</Text>

        {/* Score */}
        <Text style={styles.scoreText}>
          Score: {Number.isNaN(numericScore) ? 0 : numericScore} / 5
        </Text>

        {/* High score */}
        {highScore !== null && (
          <Text style={styles.highScoreText}>
            Hoogste score: {highScore} / 5
          </Text>
        )}

        {/* Action */}
        <Pressable
          style={styles.button}
          onPress={() => router.replace("/(tabs)")}
          // Dit is een TypeScript type warning van expo-router rond route groups, maar runtime werkt correct
        >
          <Text style={styles.buttonText}>
            Terug naar Home
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.parchment,
  },

  card: {
    flex: 1,
    margin: 20,
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#fdf6e3", // parchment card
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },

  rankImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 20,
  },

  rankText: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.inkDark,
    marginBottom: 12,
  },

  scoreText: {
    fontSize: 20,
    color: Colors.inkDark,
    marginBottom: 6,
  },

  highScoreText: {
    fontSize: 16,
    color: Colors.inkLight,
    marginBottom: 30,
  },

  button: {
    backgroundColor: Colors.water,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
  },

  buttonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
