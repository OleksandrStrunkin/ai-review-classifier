"use client";

import { useState } from "react";
import { AnalysisResults } from "@/types/analysis";

export default function ReviewTable({
  reviews,
}: {
  reviews: AnalysisResults["analyzedReviews"];
}) {
  const [visibleCount, setVisibleCount] = useState(5);

  if (!reviews || reviews.length === 0) return null;

  const showMore = () => setVisibleCount((prev) => prev + 5);
  const visibleReviews = reviews.slice(0, visibleCount);

  type SentimentType = "positive" | "negative" | "neutral" | "Error";

  const getSentimentStyle = (sentiment: string): string => {
    switch (sentiment.toLowerCase()) {
      case "positive":
      case "позитивні":
      case "позитивний":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50";
      case "negative":
      case "негативні":
      case "негативний":
        return "bg-red-500/20 text-red-400 border border-red-500/50";
      case "neutral":
      case "нейтральні":
      case "нейтральний":
        return "bg-amber-500/20 text-amber-400 border border-amber-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/50";
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {visibleReviews.map((review, index) => (
          <div
            key={index}
            className="p-4 bg-gray-800 rounded-xl border border-gray-700 space-y-3"
          >
            <div className="flex justify-between items-start gap-2">
              <span
                className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-md ${getSentimentStyle(
                  review.sentiment || "error"
                )}`}
              >
                {review.sentiment}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                #{index + 1}
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed italic">
              "{review.original_text}"
            </p>
            <div className="pt-2 border-t border-gray-700 flex justify-between items-center">
              <span className="text-xs text-gray-500">Тема:</span>
              <span className="text-xs font-semibold text-indigo-400">
                {review.topic || "Не визначено"}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-700 shadow-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Відгук
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Настрій
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Тема
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {visibleReviews.map((review, index) => (
              <tr
                key={index}
                className="hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-300 max-w-md">
                  <div className="line-clamp-2 hover:line-clamp-none transition-all cursor-default">
                    {review.original_text}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${getSentimentStyle(
                      review.sentiment || "error"
                    )}`}
                  >
                    {review.sentiment}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-400 font-medium">
                  {review.topic || "Не визначено"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleCount < reviews.length && (
        <div className="flex justify-center pt-4">
          <button
            onClick={showMore}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 rounded-full text-sm font-medium transition-all active:scale-95 shadow-sm"
          >
            Показати ще
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      )}
      <p className="text-center text-xs text-gray-500 mt-2">
        Показано {visibleReviews.length} з {reviews.length} відгуків
      </p>
    </div>
  );
}
