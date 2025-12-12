
import { GoogleGenAI } from "@google/genai";
import {
  AnalyzedReview,
  NormalizedReview,
  GeminiAnalysisResult,
} from "@/types/analysis";

const ai = new GoogleGenAI({});
const MODEL_NAME = "gemini-2.5-flash";

const responseSchema = {
  type: "object",
  properties: {
    sentiment: {
      type: "string",
      description: "Класифікація настрою: Positive, Negative, або Neutral.",
    },
    topic: {
      type: "string",
      description:
        "Основна тема відгуку/скарги. Використовуйте терміни: Доставка, Якість, Ціна, Підтримка, Інше.",
    },
  },
  required: ["sentiment", "topic"],
};

export async function analyzeReviewWithGemini(
  review: NormalizedReview
): Promise<AnalyzedReview> {
  try {
    const prompt = `Проаналізуй наступний відгук українською мовою: "${review.original_text}". Поверни лише JSON-об'єкт...`; // Скорочено

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
      },
    });
      
      if (!response.text) {
        throw new Error("Gemini API не повернув текстової відповіді.");
      }

    const analysis: GeminiAnalysisResult = JSON.parse(response.text);

    return {
      ...review,
      sentiment: analysis.sentiment,
      topic: analysis.topic,
    } as AnalyzedReview;
  } catch (error) {
    console.error(
      `Помилка аналізу відгуку: ${review.original_text}`,
      error instanceof Error ? error.message : "Невідома помилка"
    );
    return {
      ...review,
      sentiment: "Error",
      topic: "Error",
    } as AnalyzedReview;
  }
}
