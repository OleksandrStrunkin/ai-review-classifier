"use client";

import UploadArea from "@/components/UploadArea";
import ResultsDashboard from "@/components/ResultsDashboard";
import { useState } from "react";
import { DUMMY_RESULTS_WITH_ANALYSIS } from "@/data/dummyResults";
import { AnalysisResults, SentimentMetric, TopicMetric, AnalyzedReview } from "@/types/analysis";
import groupSentimentByMonth from "@/components/groupSentimentByMonth";

type FormattedMetrics = {
  totalReviews: number;
  positivePercent: string;
  negativePercent: string; 
  sentimentData: SentimentMetric[];
  topicData: TopicMetric[];
  analyzedReviews: AnalyzedReview[];
};

const DUMMY_RESULTS: AnalysisResults =
  DUMMY_RESULTS_WITH_ANALYSIS as unknown as AnalysisResults;

export default function Home() {
  const [analysisResults, setAnalysisResults] =
    useState<AnalysisResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (file: File) => {
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
      setAnalysisResults({
        ...formattedResults,
        sentimentTimeline: sentimentTimeline,
      });
    } catch (err) {
      console.error("Помилка при виконанні аналізу:", err);
      setError(err instanceof Error ? err.message : "Невідома помилка");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowExamples = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResults(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setAnalysisResults(DUMMY_RESULTS);
    setIsLoading(false);
  };

  const formatGeminiResults = (
    rawReviews: AnalyzedReview[]
  ): FormattedMetrics => {
    const totalReviews = rawReviews.length;
    const sentimentCounts = { Positive: 0, Negative: 0, Neutral: 0, Error: 0 };
    const topicCounts: Record<string, number> = {};

    rawReviews.forEach((review) => {
      let sentiment = review.sentiment || "Error";
      if (typeof sentiment === "string") {
        sentiment =
          sentiment.charAt(0).toUpperCase() + sentiment.slice(1).toLowerCase();
      }

      if (sentimentCounts.hasOwnProperty(sentiment)) {
        sentimentCounts[sentiment as keyof typeof sentimentCounts]++;
      } else {
        sentimentCounts["Error"]++;
      }
      const topic = review.topic || "Інше";
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });
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

    const topicData = Object.keys(topicCounts)
      .map((topic) => ({ topic, count: topicCounts[topic] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const positivePercent = ((sentimentCounts["Positive"] / totalReviews) * 100).toFixed(1);
    const negativePercent = ((sentimentCounts["Negative"] / totalReviews) * 100).toFixed(1);

    return {
      totalReviews,
      positivePercent,
      negativePercent,
      sentimentData,
      topicData,
      analyzedReviews: rawReviews,
    };
  };

  return (
    <div className="flex min-h-screen justify-center bg-gray-900">
      <main className="w-full max-w-7xl p-4 lg:p-12">
        <h1 className="text-4xl font-extrabold mb-8 text-white">
          🤖 AI Фільтр Відгуків
        </h1>
        <p className="text-gray-400 mb-8 max-w-2xl">
          Завантажте ваш CSV-файл із відгуками, і Gemini 2.5 Flash класифікує їх
          (позитивний/негативний), виділить ключові теми скарг та візуалізує
          результати.
        </p>

        <div className="mb-8 p-4 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-400">
          <p className="font-semibold text-gray-300 mb-2">
            <span className="mr-2">💡</span>
            Структура CSV-файлу:
          </p>
          <p>
            Файл повинен містити заголовки:
            <code className="bg-gray-700 text-indigo-300 p-1 rounded mx-1">
              review_date
            </code>
            (YYYY-MM-DD),
            <code className="bg-gray-700 text-indigo-300 p-1 rounded mx-1">
              review_text
            </code>
            та
            <code className="bg-gray-700 text-indigo-300 p-1 rounded mx-1">
              review_id
            </code>
            .
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
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
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">
              2. Результати аналізу
            </h2>
            {error && (
              <div className="p-4 mb-4 bg-red-900 border border-red-700 text-red-300 rounded-lg">
                **Помилка:** {error}
              </div>
            )}
            {isLoading && (
              <div className="p-8 text-center text-xl text-indigo-400">
                Аналіз відгуків триває... Це може зайняти до 1 хвилини, залежно
                від кількості даних.
              </div>
            )}
            {!isLoading && analysisResults ? (
              <ResultsDashboard results={analysisResults} />
            ) : (
              !error &&
              !isLoading && (
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
