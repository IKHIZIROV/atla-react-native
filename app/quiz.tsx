import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { fetchQuestions } from "@/api/questionsApi";
import { Question } from "@/types/question";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import Header from "@/components/Header";
import AnimatedAnswer from "@/components/AnimatedAnswer";
import { Colors } from "@/styles/theme";
import { loadProfile, saveProfile } from "@/storage/profileStorage";

const QUESTIONS_PER_GAME = 5;

const ELEMENTS = [
  { name: "Water", color: Colors.water, icon: "🌊" },
  { name: "Earth", color: Colors.earth, icon: "🪨" },
  { name: "Fire", color: Colors.fire, icon: "🔥" },
  { name: "Air", color: Colors.air, icon: "🌪️" },
];

export default function QuizScreen() {
  const { gameId } = useLocalSearchParams<{ gameId?: string }>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    resetGame();
  }, [gameId]);

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  const resetGame = async () => {
    const data = await fetchQuestions();
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, QUESTIONS_PER_GAME));
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
  };

  const current = questions[currentIndex];
  if (!current) return null;

  const element = ELEMENTS[currentIndex % ELEMENTS.length];

  const handleAnswer = async (answer: string) => {
    if (selected) return;

    setSelected(answer);
    const isCorrect = answer === current.correctAnswer;
    const newScore = score + (isCorrect ? 1 : 0);

    const profile = await loadProfile();
    if (isCorrect) {
      profile.correctAnswers += 1;
      await saveProfile(profile);

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
    } else {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      );

      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -5, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }

    setTimeout(() => {
      if (currentIndex === QUESTIONS_PER_GAME - 1) {
        router.replace({
          pathname: "/result",
          params: { score: String(newScore) },
        });
      } else {
        setScore(newScore);
        setCurrentIndex((i) => i + 1);
        setSelected(null);
      }
    }, 900);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Quiz" showBack />
      <View style={[styles.container, { backgroundColor: element.color }]}>
        <Text style={styles.counter}>
          {element.icon} {element.name} — Vraag {currentIndex + 1}/5
        </Text>

        <Animated.Text
          style={[
            styles.question,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {current.question}
        </Animated.Text>

        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          {current.possibleAnsers.map((ans) => {
            const isCorrect = ans === current.correctAnswer;
            const isSelected = ans === selected;

            return (
              <AnimatedAnswer
                key={ans}
                text={ans}
                onPress={() => handleAnswer(ans)}
                style={[
                  selected && isCorrect && styles.correct,
                  selected && isSelected && !isCorrect && styles.wrong,
                ]}
              />
            );
          })}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 20,
  },
  counter: {
    color: "#94a3b8",
    marginBottom: 20,
  },
  question: {
    fontSize: 22,
    color: "#f8fafc",
    marginBottom: 30,
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  answer: {
    backgroundColor: "rgba(30,41,59,0.9)",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
  },
  answerText: {
    color: "#f8fafc",
    fontSize: 16,
  },
  correct: {
    backgroundColor: "#22c55e",
  },
  wrong: {
    backgroundColor: "#ef4444",
  },
});
