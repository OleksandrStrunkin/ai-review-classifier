import { NextResponse, NextRequest } from "next/server";

import { parseCsv } from "@/lib/csv-parser";
import { analyzeReviewWithGemini } from "@/lib/gemini-analysis";

export async function POST(request: NextRequest) {
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
    const fileEntry = formData.get("file");

    if (!fileEntry || !(fileEntry instanceof Blob)) {
      return NextResponse.json(
        {
          error:
            "Файл не знайдено або він має некоректний формат (очікується Blob/File).",
        },
        { status: 400 }
      );
    }
    const file = fileEntry;

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
    const errorMessage =
      error instanceof Error ? error.message : "Невідома помилка на сервері.";
    return new Response(
      JSON.stringify({
        error: "Виникла внутрішня помилка сервера.",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
