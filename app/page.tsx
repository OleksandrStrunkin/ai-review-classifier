"use client";

import UploadArea from "@/components/UploadArea";
import ResultsDashboard from "@/components/ResultsDashboard";
import { useState } from "react";
import { DUMMY_RESULTS_WITH_ANALYSIS } from "@/data/dummyResults";

function groupSentimentByMonth(reviews) {
  const monthlyData = {};

  reviews.forEach((review) => {
    // Перевіряємо, чи є дата
    if (!review.review_date) return;

    // Групуємо по місяцю і року. Наприклад, '2024-01'
    const monthKey = review.review_date.substring(0, 7);
    const sentiment = review.sentiment;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { Positive: 0, Negative: 0, Neutral: 0 };
    }

    // Збільшуємо лічильник
    if (monthlyData[monthKey][sentiment] !== undefined) {
      monthlyData[monthKey][sentiment]++;
    }
  });

  // Перетворюємо об'єкт у масив, сортуємо за датою
  const chartFormat = Object.keys(monthlyData)
    .sort()
    .map((monthKey) => ({
      month: monthKey,
      ...monthlyData[monthKey],
    }));

  return chartFormat;
}

// ...

export default function Home() {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (file) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setAnalysisResults(null);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Помилка під час аналізу на сервері."
        );
      }
      const resultData = await response.json();
      const formattedResults = formatGeminiResults(resultData.data);
      const sentimentTimeline = groupSentimentByMonth(resultData.data);

      // Встановлення результатів
      setAnalysisResults({
        ...formattedResults,
        sentimentTimeline: sentimentTimeline,
      });
    } catch (err) {
      console.error("Помилка при виконанні аналізу:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowExamples = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResults(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setAnalysisResults(DUMMY_RESULTS_WITH_ANALYSIS);
    setIsLoading(false);
  };

  const formatGeminiResults = (rawReviews) => {
    const totalReviews = rawReviews.length;
    const sentimentCounts = { Positive: 0, Negative: 0, Neutral: 0, Error: 0 };
    const topicCounts = {};

    rawReviews.forEach((review) => {
      let sentiment = review.sentiment || "Error";
      if (typeof sentiment === "string") {
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
    ].filter((d) => d.value > 0);

    // Перетворюємо лічильники тем у формат для стовпчастої діаграми
    const topicData = Object.keys(topicCounts)
      .map((topic) => ({ topic, count: topicCounts[topic] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalReviews,
      sentimentData,
      topicData,
      analyzedReviews: rawReviews,
    };
  };
  // *** КІНЕЦЬ ОНОВЛЕНОЇ ФУНКЦІЇ АНАЛІЗУ ***

  return (
    <div className="flex min-h-screen justify-center bg-gray-900">
      <main className="w-full max-w-7xl p-8 lg:p-12">
        {/* ЗАГОЛОВОК */}
        <h1 className="text-4xl font-extrabold mb-8 text-white">
          🤖 AI Фільтр Відгуків
        </h1>

        {/* ОПИС */}
        <p className="text-gray-400 mb-8 max-w-2xl">
          Завантажте ваш CSV-файл із відгуками, і Gemini 2.5 Flash класифікує їх
          (позитивний/негативний), виділить ключові теми скарг та візуалізує
          результати.
        </p>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* ЛІВА КОЛОНКА: Завантаження та Керування */}
          <div className="lg:w-1/3 space-y-8">
            <h2 className="text-2xl font-semibold text-gray-200">
              1. Завантаження даних
            </h2>

            <UploadArea
              onAnalyze={handleAnalyze}
              onShowExample={handleShowExamples}
              isLoading={isLoading}
            />
          </div>

          {/* ПРАВА КОЛОНКА: Результати та Візуалізація */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">
              2. Результати аналізу
            </h2>

            {/* Відображення помилки */}
            {error && (
              <div className="p-4 mb-4 bg-red-900 border border-red-700 text-red-300 rounded-lg">
                **Помилка:** {error}
              </div>
            )}

            {/* Відображення спінера під час завантаження */}
            {isLoading && (
              <div className="p-8 text-center text-xl text-indigo-400">
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
                // *** СТИЛЬ ЗАГЛУШКИ ЗА ВІДСУТНОСТІ РЕЗУЛЬТАТІВ ***
                <div className="p-8 border border-dashed border-gray-700 bg-gray-800 rounded-lg text-center text-gray-500">
                  <p>
                    Завантажте файл або натисніть "Показати приклад", щоб
                    побачити результати аналізу.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
