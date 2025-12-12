import { GoogleGenAI } from "@google/genai";
import csv from "csv-parser";
import { NextResponse } from "next/server";
import { Readable } from "stream";

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

export async function POST(request: NextResponse) {
  if (!process.env.GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Gemini API Key не налаштовано." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(
        JSON.stringify({ error: "Файл не знайдено у запиті." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const reviews = await parseCsv(buffer);

    const normalizedReviews = reviews.map((review) => {
      return {
        review_id: review._0 || review.review_id,
        review_date: review._1 || review.review_date,
        original_text: review.original_text || review._2,
      };
    });

    if (reviews.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Файл CSV порожній або має неправильний формат.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const analysisPromises = normalizedReviews.map((review) =>
      analyzeReviewWithGemini(review)
    );

    const analyzedReviews = await Promise.all(analysisPromises);

    return new Response(
      JSON.stringify({
        message: "Аналіз успішно завершено",
        data: analyzedReviews,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Помилка під час обробки запиту:", error);
    return new Response(
      JSON.stringify({
        error: "Виникла внутрішня помилка сервера.",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Допоміжна функція для парсингу CSV
function parseCsv(buffer) {
  return new Promise((resolve, reject) => {
    const results = [];

    Readable.from(buffer)
      .pipe(
        csv({
          trim: true,
          headers: true,
        })
      )
      .on("data", (data) => {
        let reviewText = "";

        reviewText = (data.review_text || data.text || "").trim();

        if (!reviewText) {
          const keys = Object.keys(data);
          let bestMatch = "";
          keys.forEach((key) => {
            const value = (data[key] || "").trim();
            if (
              value.length > bestMatch.length &&
              !key.toLowerCase().includes("id")
            ) {
              bestMatch = value;
            }
          });
          reviewText = bestMatch;
        }

        if (
          reviewText &&
          reviewText.length > 10 &&
          !reviewText.toLowerCase().includes("review")
        ) {
          results.push({
            original_text: reviewText,
            ...data,
          });
        }
      })
      .on("end", () => {
        console.log(results);
        resolve(results);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

async function analyzeReviewWithGemini(review) {
  try {
    const prompt = `Проаналізуй наступний відгук українською мовою: "${review.original_text}". Поверни лише JSON-об'єкт, який містить класифікацію настрою (Positive, Negative, Neutral) та основну тему, використовуючи лише терміни: Доставка, Якість, Ціна, Підтримка, Інше.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
      },
    });

    const analysis = JSON.parse(response.text);

    return {
      ...review,
      review_date: review.review_date,
      sentiment: analysis.sentiment,
      topic: analysis.topic,
    };
  } catch (e) {
    console.error(
      `Помилка аналізу відгуку: ${review.original_text}`,
      e.message
    );
    return {
      ...review,
      sentiment: "Error",
      topic: "Error",
    };
  }
}
