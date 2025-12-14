import { Question } from "../types/question";

const API_URL = "https://sampleapis.assimilate.be/avatar/questions";

export async function fetchQuestions(): Promise<Question[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }

  return response.json();
}
