import { Animated, Pressable, Text, StyleSheet } from "react-native";
import { useRef } from "react";
import { Colors } from "../styles/theme";

interface Props {
  text: string;
  onPress: () => void;
  style?: any;
}

export default function AnimatedAnswer({ text, onPress, style }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
    onPress();
  };

  return (
    <Pressable onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View style={[styles.button, style, { transform: [{ scale }] }]}>
        <Text style={styles.text}>{text}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#e7ddbd",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "#cbbd8b",
  },
  text: {
    fontSize: 16,
    color: Colors.inkDark,
  },
});
