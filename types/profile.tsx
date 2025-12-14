export type Nation = "Fire" | "Water" | "Earth" | "Air";

export interface Profile {
  name: string;
  nation: Nation;
  correctAnswers: number;
}
