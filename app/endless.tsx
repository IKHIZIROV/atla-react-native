import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { fetchQuestions } from "@/api/questionsApi";
import { Question } from "@/types/question";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "@/components/Header";
import AnimatedAnswer from "@/components/AnimatedAnswer";
import { Colors } from "@/styles/theme";
import { loadProfile, saveProfile } from "@/storage/profileStorage";

export default function EndlessScreen() {
  const [queue, setQueue] = useState<Question[]>([]);
  const [current, setCurrent] = useState<Question | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startGame();
  }, []);

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
  }, [current]);

  const startGame = async () => {
    const data = await fetchQuestions();
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setCurrent(shuffled[0]);
    setMistakes(0);
    setSelected(null);
  };

  const handleAnswer = async (answer: string) => {
    if (!current || selected) return;

    setSelected(answer);
    const isCorrect = answer === current.correctAnswer;

    const profile = await loadProfile();
    if (isCorrect) {
      profile.correctAnswers += 1;
      await saveProfile(profile);

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
    } else {
      setMistakes((m) => m + 1);
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      );

      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -5, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }

    setTimeout(async () => {
      let newQueue = queue.filter((q) => q.id !== current.id);
      if (!isCorrect) newQueue.push(current);

      if (newQueue.length === 0) {
        const stored = await AsyncStorage.getItem("endlessHighscore");
        if (stored === null || mistakes < Number(stored)) {
          await AsyncStorage.setItem("endlessHighscore", String(mistakes));
        }
        setCurrent(null);
      } else {
        setQueue(newQueue);
        setCurrent(newQueue[0]);
        setSelected(null);
      }
    }, 900);
  };

  if (!current) {
    return (
      <View style={{ flex: 1 }}>
        <Header title="Endless Mode" showBack />
        <View style={styles.end}>
          <Text style={styles.title}>🎉 Klaar!</Text>
          <Text style={styles.text}>Fouten: {mistakes}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="Endless Mode" showBack />
      <View style={styles.container}>
        <Text style={styles.counter}>Resterend: {queue.length}</Text>

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
    backgroundColor: Colors.parchment,
    padding: 20,
  },
  counter: {
    color: Colors.inkLight,
    marginBottom: 16,
  },
  question: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.inkDark,
    marginBottom: 30,
  },
  correct: {
    backgroundColor: "#22c55e",
  },
  wrong: {
    backgroundColor: "#ef4444",
  },
  end: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.parchment,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
  },
});
