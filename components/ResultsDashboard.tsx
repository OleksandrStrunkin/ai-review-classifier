import SentimentChart from "./charts/SentimentChart";
import TopicChart from "./charts/TopicChart";
import ReviewTable from "./ReviewTable";
import SentimentTimelineChart from "./charts/SentimentTimelineChart";
import { AnalysisResults } from "@/types/analysis";
import KPICard from "./KPICard";
import { useState } from "react";
import { generateProfessionalPDF } from "@/lib/pdf-export";

type ResultsDashboardProps = {
  results: AnalysisResults | null;
};

export default function ResultsDashboard({ results }: ResultsDashboardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  if (!results) {
    return null;
  }

  const { totalReviews, sentimentData, topicData, analyzedReviews } = results;
  const positiveReviews =
    sentimentData.find((d) => d.label === "Позитивні")?.value || 0;
  const negativeReviews =
    sentimentData.find((d) => d.label === "Негативні")?.value || 0;

  const positivePercent = ((positiveReviews / totalReviews) * 100).toFixed(1);
  const negativePercent = ((negativeReviews / totalReviews) * 100).toFixed(1);

  const handleDownload = async () => {
    setIsGenerating(true);
    await generateProfessionalPDF("analysis-report");
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
            isGenerating
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-indigo-900/40 hover:bg-indigo-700/40 text-white shadow-lg shadow-indigo-500/20 active:scale-95"
          }`}
        >
          {isGenerating ? (
            <>
              <span className="animate-spin">⏳</span> Обробка...
            </>
          ) : (
            <>
              <span>📥</span> Завантажити PDF звіт
            </>
          )}
        </button>
      </div>
      <div id="analysis-report" className="space-y-10 bg-gray-900 rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <KPICard
            title="Всього відгуків"
            value={totalReviews}
            icon="📝"
            bgColor="bg-indigo-900/40 border border-indigo-700/50"
          />
          <KPICard
            title="Позитивних"
            value={`${positivePercent}%`}
            icon="👍"
            bgColor="bg-emerald-900/40 border border-emerald-700/50"
          />
          <div className="sm:col-span-2 lg:col-span-1">
            <KPICard
              title="Негативних"
              value={`${negativePercent}%`}
              icon="👎"
              bgColor="bg-red-900/40 border border-red-700/50"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="p-3 md:p-6 bg-gray-800 flex flex-col justify-center items-center rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-6 text-gray-100">
              Розподіл настроїв
            </h3>
            <SentimentChart data={sentimentData} />
          </div>
          <div className="p-3 md:p-6 bg-gray-800 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-6 text-gray-100">
              Топ-5 тем відгуків
            </h3>
            <TopicChart data={topicData} />
          </div>
        </div>
        <div className="p-3 md:p-6 bg-gray-800 rounded-xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-6 text-gray-100">
            Динаміка настроїв з часом
          </h3>
          <SentimentTimelineChart data={results.sentimentTimeline} />
        </div>
        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-6 text-gray-100">
            Приклади проаналізованих відгуків
          </h3>
          <ReviewTable reviews={analyzedReviews} />
        </div>
      </div>
    </div>
  );
}


