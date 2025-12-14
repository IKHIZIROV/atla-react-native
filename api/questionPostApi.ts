const BASE_URL = "https://sampleapis.assimilate.be/avatar/questions";

// POST werkt niet, ik denk niet dat dit mijn fout is, maar de fout van sampleApi

const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzbWFpbC5raGl6aXJvdkBzdHVkZW50LmFwLmJlIiwiaWF0IjoxNzY1NzQzMzE2fQ.EODXysuSeqV1IuVyCCUbhjIbYQxpU5Gagz5b96u2bIw";

export interface NewQuestionPayload {
  question: string;
  possibleAnswers: string[];
  correctAnswer: string;
  author: string;
}

export async function postQuestion(payload: NewQuestionPayload) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "question-suggestion",
      data: payload,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("POST ERROR:", text);
    throw new Error("Post request failed");
  }

  return response.json();
}
