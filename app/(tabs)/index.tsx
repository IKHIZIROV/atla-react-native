import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import Header from "@/components/Header";
import { Colors } from "@/styles/theme";
import { loadProfile } from "@/storage/profileStorage";
import { Profile } from "@/types/profile";
import { getRank } from "@/utils/rank";
import { rankImages, nationImages } from "@/utils/images";
import { Rank } from "@/types/rank";

export default function HomeScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadProfile().then(setProfile);
    }, [])
  );

  const rank: Rank | null = profile
    ? getRank(profile.correctAnswers)
    : null;

  return (
    <View style={{ flex: 1 }}>
      <Header title="Avatar Quiz" />

      <View style={styles.container}>
        {/* Rank foto */}
        {rank && (
          <Image
            source={rankImages[rank]}
            style={styles.largeImage}
            contentFit="contain"
          />
        )}

        {profile && (
          <>
            <Text style={styles.name}>
              {profile.name || "Naamloos"}
            </Text>

            <Text style={styles.subText}>
              {profile.nation} Nation
            </Text>

            {/* Nation foto */}
            <Image
              source={nationImages[profile.nation]}
              style={styles.smallImage}
              contentFit="cover"
            />
          </>
        )}

        <Pressable
          style={styles.playButton}
          onPress={() =>
            router.push({
              pathname: "/quiz",
              params: { gameId: Date.now().toString() },
            })
          }
        >
          <Text style={styles.playText}>SPEEL</Text>
        </Pressable>

        <Pressable
          style={[styles.playButton, { backgroundColor: Colors.earth }]}
          onPress={() => router.push("/endless")}
        >
          <Text style={styles.playText}>ENDLESS MODE</Text>
        </Pressable>

        <Pressable
          style={[styles.playButton, { backgroundColor: Colors.water }]}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.playText}>MIJN PROFIEL</Text>
        </Pressable>

        <Pressable
          style={[styles.playButton, { backgroundColor: Colors.air }]}
          onPress={() => router.push("/add-question")}
        >
          <Text style={styles.playText}>VRAAG TOEVOEGEN</Text>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.parchment,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  largeImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 20,
  },
  smallImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.inkDark,
  },
  subText: {
    fontSize: 16,
    marginTop: 4,
    color: Colors.inkLight,
  },
  playButton: {
    backgroundColor: Colors.fire,
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 16,
  },
  playText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
});
