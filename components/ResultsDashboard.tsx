import SentimentChart from "./charts/SentimentChart";
import TopicChart from "./charts/TopicChart";
import ReviewTable from "./ReviewTable";
import SentimentTimelineChart from "./charts/SentimentTimelineChart";
import { AnalysisResults } from "@/types/analysis";
import KPICard from "./KPICard";

type ResultsDashboardProps = {
  results: AnalysisResults | null;
};

export default function ResultsDashboard({ results }: ResultsDashboardProps) {
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

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-3 gap-6">
        <KPICard
          title="Всього відгуків"
          value={totalReviews}
          icon="📝"
          bgColor="bg-indigo-900/50 border border-indigo-700"
        />
        <KPICard
          title="Позитивних"
          value={`${positivePercent}%`}
          icon="👍"
          bgColor="bg-emerald-900/50 border border-emerald-700"
        />
        <KPICard
          title="Негативних"
          value={`${negativePercent}%`}
          icon="👎"
          bgColor="bg-red-900/50 border border-red-700"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="p-6 bg-gray-800 flex flex-col justify-center items-center rounded-xl shadow-2xl shadow-gray-900/50 border border-gray-700">
          <h3 className="text-xl font-semibold mb-6 text-gray-100">
            Розподіл настроїв
          </h3>
          <SentimentChart data={sentimentData} />
        </div>
        <div className="p-6 bg-gray-800 rounded-xl shadow-2xl shadow-gray-900/50 border border-gray-700">
          <h3 className="text-xl font-semibold mb-6 text-gray-100">
            Топ-5 тем, згаданих у відгуках
          </h3>
          <TopicChart data={topicData} />
        </div>
      </div>
      <div className="p-6 bg-gray-800 rounded-xl shadow-2xl shadow-gray-900/50 border border-gray-700">
        <h3 className="text-xl font-semibold mb-6 text-gray-100">
          Динаміка настроїв з часом
        </h3>
        <SentimentTimelineChart data={results.sentimentTimeline} />
      </div>
      <div className="p-6 bg-gray-800 rounded-xl shadow-2xl shadow-gray-900/50 border border-gray-700">
        <h3 className="text-xl font-semibold mb-6 text-gray-100">
          Приклади проаналізованих відгуків
        </h3>
        <ReviewTable reviews={analyzedReviews} />
      </div>
    </div>
  );
}


