import AsyncStorage from "@react-native-async-storage/async-storage";
import { Profile } from "@/types/profile";

const KEY = "profile";

export const defaultProfile: Profile = {
  name: "Aang",
  nation: "Air",
  correctAnswers: 0,
};

export async function loadProfile(): Promise<Profile> {
  const stored = await AsyncStorage.getItem(KEY);
  return stored ? JSON.parse(stored) : defaultProfile;
}

export async function saveProfile(profile: Profile) {
  await AsyncStorage.setItem(KEY, JSON.stringify(profile));
}
