import { GoogleGenAI } from "@google/genai";
import csv from "csv-parser";
import { Readable } from "stream";

// 1. Ініціалізація Gemini
// Ключ автоматично береться зі змінної оточення GEMINI_API_KEY
const ai = new GoogleGenAI({});

// 2. Визначення моделі та системної інструкції
// Це надсилається моделі перед кожним запитом і каже їй, що робити.
const MODEL_NAME = "gemini-2.5-flash";

// JSON Schema для гарантування структурованої відповіді
// Це необхідно, щоб ми могли безпечно розібрати відповідь за допомогою JSON.parse()
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

// 3. Основна функція обробки POST-запиту
export async function POST(request) {
  // Перевірка наявності ключа API
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
    // Отримуємо форму (formData) із завантаженим файлом
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

    // Перетворюємо файл на ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Парсинг CSV
    const reviews = await parseCsv(buffer);

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

    // 5. Виклик Gemini API для кожного відгуку паралельно
    const analysisPromises = reviews.map((review) =>
      analyzeReviewWithGemini(review)
    );

    // Чекаємо завершення всіх запитів
    const analyzedReviews = await Promise.all(analysisPromises);

    // 6. Повертаємо загальний результат
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
          // Вказуємо trim: true, щоб обрізати пробіли в заголовках колонок
          trim: true,
          headers: true,
        })
      )
      .on("data", (data) => {
        let reviewText = "";

        // 1. Спробуємо знайти за явною назвою
        reviewText = (data.review_text || data.text || "").trim();

        // 2. Якщо не знайшли, спробуємо знайти найбільш ймовірну колонку
        if (!reviewText) {
          const keys = Object.keys(data);
          // Вибираємо найдовший рядок, який не схожий на ID (зазвичай відгук найдовший)
          let bestMatch = "";
          keys.forEach((key) => {
            const value = (data[key] || "").trim();
            // Умова: текст не є ID (занадто коротким) і не є заголовком
            if (
              value.length > bestMatch.length &&
              !key.toLowerCase().includes("id")
            ) {
              bestMatch = value;
            }
          });
          reviewText = bestMatch;
        }

        // Фінальна перевірка, щоб виключити порожні або заголовки
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

// Допоміжна функція для виклику Gemini API
async function analyzeReviewWithGemini(review) {
  try {
    const prompt = `Проаналізуй наступний відгук українською мовою: "${review.original_text}". Поверни лише JSON-об'єкт, який містить класифікацію настрою (Positive, Negative, Neutral) та основну тему, використовуючи лише терміни: Доставка, Якість, Ціна, Підтримка, Інше.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        // Вмикаємо JSON Mode
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1, // Низька температура для більш передбачуваних класифікацій
      },
    });

    // Gemini повертає текст у JSON-форматі, який ми парсимо
    const analysis = JSON.parse(response.text);

    // Повертаємо оригінальний відгук разом із результатами аналізу
    return {
      ...review,
      sentiment: analysis.sentiment,
      topic: analysis.topic,
    };
  } catch (e) {
    // У разі помилки (наприклад, недійсний JSON або помилка API),
    // повертаємо безпечні значення, щоб не зупиняти весь процес
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
