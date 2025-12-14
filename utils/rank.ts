import { Rank } from "@/types/rank";

export function getRank(correct: number): Rank {
  if (correct >= 30) return "Avatar";
  if (correct >= 20) return "Master";
  if (correct >= 10) return "Bender";
  if (correct >= 5) return "Initiate";
  return "Student";
}
