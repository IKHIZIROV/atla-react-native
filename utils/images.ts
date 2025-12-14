import { Rank } from "@/types/rank";
import { Nation } from "@/types/profile";

export const nationImages: Record<Nation, any> = {
  Fire: require("@/assets/nations/fire.png"),
  Water: require("@/assets/nations/water.png"),
  Earth: require("@/assets/nations/earth.png"),
  Air: require("@/assets/nations/air.png"),
};

export const rankImages: Record<Rank, any> = {
  Student: require("@/assets/ranks/student.png"),
  Initiate: require("@/assets/ranks/initiate.png"),
  Bender: require("@/assets/ranks/bender.png"),
  Master: require("@/assets/ranks/master.png"),
  Avatar: require("@/assets/ranks/avatar.png"),
};
