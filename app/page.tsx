"use client";

import UploadArea from "@/components/UploadArea";
import ResultsDashboard from "@/components/ResultsDashboard";
import { useState } from "react";

const DUMMY_RESULTS = {
  totalReviews: 125,
  sentimentData: [
    { label: "Позитивні", value: 75, color: "#10B981" }, // emerald-500
    { label: "Негативні", value: 30, color: "#EF4444" }, // red-500
    { label: "Нейтральні", value: 20, color: "#F59E0B" }, // amber-500
  ],
  topicData: [
    { topic: "Доставка", count: 45 },
    { topic: "Ціна", count: 35 },
    { topic: "Якість товару", count: 20 },
    { topic: "Підтримка", count: 15 },
    { topic: "Пакування", count: 10 },
  ],
};

export default function Home() {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (file) => {
    if (!file) return;

    console.log("Запускаємо аналіз файлу:", file.name);
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setAnalysisResults(DUMMY_RESULTS);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen justify-center bg-gray-50 dark:bg-gray-900">
      <main className="w-full max-w-7xl p-8 lg:p-12">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-white">
          🤖 AI Фільтр Відгуків
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
          Завантажте ваш CSV-файл із відгуками, і Gemini 2.5 Flash класифікує їх
          (позитивний/негативний), виділить ключові теми скарг та візуалізує
          результати.
        </p>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/3 space-y-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              1. Завантаження даних
            </h2>

            <UploadArea onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>

          <div className="lg:w-2/3">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-8">
              2. Результати аналізу
            </h2>

            {isLoading && (
              <div className="p-8 text-center text-xl text-indigo-600 dark:text-indigo-400">
                Аналіз відгуків триває...
              </div>
            )}

            {!isLoading && analysisResults ? (
              <ResultsDashboard results={analysisResults} />
            ) : (
              <div className="p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-500 dark:text-gray-400">
                <p>Завантажте файл, щоб побачити результати аналізу.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
