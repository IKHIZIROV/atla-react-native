import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/styles/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export default function Header({ title, showBack }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      {showBack && (
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={10} // 👈 maakt klikgebied groter
        >
          <Ionicons
            name="arrow-back"
            size={28}          // 👈 GROTER
            color={Colors.inkDark}
          />
        </Pressable>
      )}

      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.parchment,
    paddingBottom: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    marginRight: 16,
    padding: 6, // 👈 meer ruimte rond de pijl
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.inkDark,
  },
});
