
import { GoogleGenAI, Type } from "@google/genai";
import { Flashcard } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateFlashcards = async (topic: string, count: number = 5): Promise<Partial<Flashcard>[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate ${count} flashcards about the following topic: ${topic}. Focus on key concepts, definitions, and important facts.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: {
              type: Type.STRING,
              description: "A clear, concise question or term for the front of the flashcard.",
            },
            answer: {
              type: Type.STRING,
              description: "The corresponding answer or definition for the back of the flashcard.",
            },
          },
          required: ["question", "answer"],
        },
      },
    },
  });

  try {
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return [];
  }
};
