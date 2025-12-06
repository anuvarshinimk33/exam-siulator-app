import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, Question, Flashcard } from "../types";

// NOTE: In a real app, this key should be secure. For this demo, we assume process.env.API_KEY is available.
// If running locally without env, one might need to input it via UI, but per instructions we use process.env.
const apiKey = process.env.API_KEY || ''; 

let genAI: GoogleGenAI | null = null;

if (apiKey) {
  genAI = new GoogleGenAI({ apiKey });
}

const getAI = () => {
  if (!genAI) throw new Error("API Key is missing. Please check your configuration.");
  return genAI;
};

export const generateQuestion = async (
  topic: string, 
  difficulty: Difficulty,
  examContext: string
): Promise<Question> => {
  const ai = getAI();
  const model = "gemini-2.5-flash";

  const prompt = `
    Create a single multiple-choice question for the exam "${examContext}" regarding the topic "${topic}".
    The difficulty level should be "${difficulty}".
    Provide 4 options. Only one is correct.
    Include a concise explanation for the correct answer.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questionText: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctIndex: { type: Type.INTEGER, description: "0-based index of correct option" },
          explanation: { type: Type.STRING }
        },
        required: ["questionText", "options", "correctIndex", "explanation"]
      }
    }
  });

  const data = JSON.parse(response.text || '{}');
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    text: data.questionText,
    options: data.options,
    correctAnswerIndex: data.correctIndex,
    explanation: data.explanation,
    difficulty,
    topic
  };
};

export const generateFlashcards = async (topic: string, count: number = 5): Promise<Flashcard[]> => {
  const ai = getAI();
  const model = "gemini-2.5-flash";

  const prompt = `Create ${count} study flashcards for the topic "${topic}". Each card should have a 'front' (concept/question) and 'back' (definition/answer).`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING },
            back: { type: Type.STRING }
          },
          required: ["front", "back"]
        }
      }
    }
  });

  const data = JSON.parse(response.text || '[]');

  return data.map((item: any) => ({
    id: Math.random().toString(36).substr(2, 9),
    front: item.front,
    back: item.back,
    topic,
    masteryLevel: 0
  }));
};
