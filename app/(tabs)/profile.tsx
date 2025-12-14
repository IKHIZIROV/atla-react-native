import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import Header from "@/components/Header";
import { Colors } from "@/styles/theme";
import { Profile, Nation } from "@/types/profile";
import { loadProfile, saveProfile } from "@/storage/profileStorage";
import { getRank } from "@/utils/rank";
import { nationImages, rankImages } from "@/utils/images";
import { Rank } from "@/types/rank";

const NATIONS: Nation[] = ["Fire", "Water", "Earth", "Air"];

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    loadProfile().then(setProfile);
  }, []);

  // automatische save
  useEffect(() => {
    if (profile) saveProfile(profile);
  }, [profile]);

  if (!profile) return null;

  const rank: Rank = getRank(profile.correctAnswers);

  return (
    <View style={{ flex: 1 }}>
      <Header title="Mijn Profiel" showBack />

      <View style={styles.container}>
        {/* Naam */}
        <Text style={styles.label}>Naam</Text>
        <TextInput
          value={profile.name}
          onChangeText={(name) =>
            setProfile({ ...profile, name })
          }
          style={styles.input}
          placeholder="Jouw naam"
        />

        {/* Nation */}
        <Text style={styles.label}>Nation</Text>
        <View style={styles.nations}>
          {NATIONS.map((n) => (
            <Pressable
              key={n}
              style={[
                styles.nationButton,
                profile.nation === n && styles.selected,
              ]}
              onPress={() =>
                setProfile({ ...profile, nation: n })
              }
            >
              <Text style={styles.nationText}>{n}</Text>
            </Pressable>
          ))}
        </View>

        {/* Nation foto */}
        <Image
          source={nationImages[profile.nation]}
          style={styles.roundImage}
          contentFit="cover"
        />

        {/* Juiste antwoorden */}
        <Text style={styles.info}>
          Juiste antwoorden: {profile.correctAnswers}
        </Text>

        {/* Rank */}
        <Text style={styles.info}>
          Rank: {rank}
        </Text>

        {/* Rank foto */}
        <Image
          source={rankImages[rank]}
          style={styles.roundImage}
          contentFit="contain"
        />
      </View>
    </View>
  );
}

const IMAGE_SIZE = 140;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.parchment,
    padding: 20,
  },
  label: {
    fontWeight: "700",
    marginBottom: 6,
    color: Colors.inkDark,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  nations: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  nationButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#e7ddbd",
  },
  selected: {
    backgroundColor: Colors.fire,
  },
  nationText: {
    fontWeight: "600",
  },
  roundImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    alignSelf: "center",
    marginVertical: 20,
  },
  info: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    color: Colors.inkDark,
  },
});
