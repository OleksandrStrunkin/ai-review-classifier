// app/page.js
"use client";

// Імпорти залишаються ті ж самі:
import UploadArea from "@/components/UploadArea";
import ResultsDashboard from "@/components/ResultsDashboard";
import { useState } from "react";

// ... (DUMMY_RESULTS можна видалити, але залишимо для порівняння)

export default function Home() {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Новий стан для обробки помилок

  // *** ОНОВЛЕНА ФУНКЦІЯ АНАЛІЗУ ***
  const handleAnalyze = async (file) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setAnalysisResults(null); // Скидаємо попередні результати

    try {
      // 1. Підготовка даних для відправки
      const formData = new FormData();
      // Ключ 'file' має відповідати тому, що ми очікуємо в route.js
      formData.append("file", file);

      // 2. Виклик нашого API Route
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData, // Відправляємо файл у форматі FormData
      });

      // 3. Обробка помилок HTTP-запиту
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Помилка під час аналізу на сервері."
        );
      }

      // 4. Отримання та обробка успішної відповіді
      const resultData = await response.json();

      // Форматування даних для графіків
      const formattedResults = formatGeminiResults(resultData.data);

      // Встановлення результатів
      setAnalysisResults(formattedResults);
    } catch (err) {
      console.error("Помилка при виконанні аналізу:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Функція для перетворення сирих даних від Gemini у формат для Chart.js
  const formatGeminiResults = (rawReviews) => {
    const totalReviews = rawReviews.length;
    const sentimentCounts = { Positive: 0, Negative: 0, Neutral: 0, Error: 0 };
    const topicCounts = {};

    rawReviews.forEach((review) => {
      // Рахуємо настрої
      let sentiment = review.sentiment || "Error";
      if (typeof sentiment === "string") {
        // Робимо першу літеру великою для уніфікації
        sentiment =
          sentiment.charAt(0).toUpperCase() + sentiment.slice(1).toLowerCase();
      }

      if (sentimentCounts.hasOwnProperty(sentiment)) {
        sentimentCounts[sentiment]++;
      } else {
        sentimentCounts["Error"]++;
      }

      // Рахуємо теми
      const topic = review.topic || "Інше";
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });

    // Перетворюємо лічильники настроїв у формат для кругової діаграми
    const sentimentData = [
      {
        label: "Позитивні",
        value: sentimentCounts["Positive"],
        color: "#10B981",
      },
      {
        label: "Негативні",
        value: sentimentCounts["Negative"],
        color: "#EF4444",
      },
      {
        label: "Нейтральні",
        value: sentimentCounts["Neutral"],
        color: "#F59E0B",
      },
      { label: "Помилка", value: sentimentCounts["Error"], color: "#9CA3AF" },
    ].filter((d) => d.value > 0); // Не показувати нульові значення

    // Перетворюємо лічильники тем у формат для стовпчастої діаграми
    const topicData = Object.keys(topicCounts)
      .map((topic) => ({ topic, count: topicCounts[topic] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Беремо топ-5

    return {
      totalReviews,
      sentimentData,
      topicData,
      analyzedReviews: rawReviews, // Зберігаємо сирі дані для таблиці прикладів
    };
  };
  // *** КІНЕЦЬ ОНОВЛЕНОЇ ФУНКЦІЇ АНАЛІЗУ ***

  return (
    <div className="flex min-h-screen justify-center bg-gray-50 dark:bg-gray-900">
      <main className="w-full max-w-7xl p-8 lg:p-12">
        {/* ... (Заголовки та описи залишаються незмінними) */}
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-white">
          🤖 AI Фільтр Відгуків
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
          Завантажте ваш CSV-файл із відгуками, і Gemini 2.5 Flash класифікує їх
          (позитивний/негативний), виділить ключові теми скарг та візуалізує
          результати.
        </p>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* ЛІВА КОЛОНКА: Завантаження та Керування */}
          <div className="lg:w-1/3 space-y-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              1. Завантаження даних
            </h2>

            <UploadArea onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>

          {/* ПРАВА КОЛОНКА: Результати та Візуалізація */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-8">
              2. Результати аналізу
            </h2>

            {/* Відображення помилки */}
            {error && (
              <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900 dark:text-red-300">
                **Помилка:** {error}
              </div>
            )}

            {/* Відображення спінера під час завантаження */}
            {isLoading && (
              <div className="p-8 text-center text-xl text-indigo-600 dark:text-indigo-400">
                Аналіз відгуків триває... Це може зайняти до 1 хвилини, залежно
                від кількості даних.
              </div>
            )}

            {/* Компонент для відображення графіків */}
            {!isLoading && analysisResults ? (
              <ResultsDashboard results={analysisResults} />
            ) : (
              !error &&
              !isLoading && (
                <div className="p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-500 dark:text-gray-400">
                  <p>Завантажте файл, щоб побачити результати аналізу.</p>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Примітка: Вам також потрібно оновити DUMMY_RESULTS або видалити його,
// якщо ви плануєте використовувати лише реальні дані.
