import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";
import Header from "@/components/Header";
import { Colors } from "@/styles/theme";
import { postQuestion } from "@/api/questionPostApi";
import { loadProfile } from "@/storage/profileStorage";

export default function AddQuestionScreen() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const updateAnswer = (text: string, index: number) => {
    const copy = [...answers];
    copy[index] = text;
    setAnswers(copy);
  };

  const submit = async () => {
    if (!question.trim()) {
      Alert.alert("Fout", "Vul een vraag in");
      return;
    }

    if (answers.some((a) => !a.trim())) {
      Alert.alert("Fout", "Vul alle antwoorden in");
      return;
    }

    if (correctIndex === null) {
      Alert.alert("Fout", "Selecteer het juiste antwoord");
      return;
    }

    try {
      setLoading(true);
      const profile = await loadProfile();

      await postQuestion({
        question,
        possibleAnswers: answers,
        correctAnswer: answers[correctIndex],
        author: profile.name || "Anoniem",
      });

      Alert.alert("Gelukt", "Vraag succesvol toegevoegd");

      setQuestion("");
      setAnswers(["", "", "", ""]);
      setCorrectIndex(null);
    } catch {
      Alert.alert("Error", "Kon de vraag niet posten");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Vraag toevoegen" showBack />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Vraag</Text>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          style={styles.input}
          multiline
        />

        <Text style={styles.label}>Antwoorden</Text>
        <Text style={styles.helper}>
          Duid aan welk antwoord correct is
        </Text>

        {answers.map((answer, index) => {
          const isCorrect = correctIndex === index;

          return (
            <View
              key={index}
              style={[
                styles.answerBox,
                isCorrect && styles.correctBorder,
              ]}
            >
              <TextInput
                value={answer}
                onChangeText={(text) =>
                  updateAnswer(text, index)
                }
                placeholder={`Antwoord ${index + 1}`}
                style={styles.answerInput}
              />

              <Pressable
                style={[
                  styles.correctButton,
                  isCorrect && styles.correctSelected,
                ]}
                onPress={() => setCorrectIndex(index)}
              >
                <Text
                  style={[
                    styles.correctText,
                    isCorrect && styles.correctTextSelected,
                  ]}
                >
                  {isCorrect
                    ? "Correct antwoord"
                    : "Markeer als correct"}
                </Text>
              </Pressable>
            </View>
          );
        })}

        <Pressable
          style={[
            styles.submitButton,
            loading && { opacity: 0.5 },
          ]}
          onPress={submit}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            Vraag toevoegen
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.parchment,
  },
  label: {
    fontWeight: "700",
    marginBottom: 6,
    color: Colors.inkDark,
  },
  helper: {
    marginBottom: 12,
    color: Colors.inkLight,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  answerBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "transparent",
  },
  correctBorder: {
    borderColor: "#22c55e", // 🟢 GROEN
  },
  answerInput: {
    marginBottom: 10,
  },
  correctButton: {
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
  },
  correctSelected: {
    backgroundColor: "#22c55e", // 🟢 GROEN
  },
  correctText: {
    fontWeight: "700",
    color: "#1f2933",
  },
  correctTextSelected: {
    color: "white",
  },
  submitButton: {
    backgroundColor: Colors.fire,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
  },
  submitText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },
});
