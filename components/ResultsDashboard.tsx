import SentimentChart from "./charts/SentimentChart";
import TopicChart from "./charts/TopicChart";
import ReviewTable from "./ReviewTable";
import SentimentTimelineChart from "./charts/SentimentTimelineChart";
import { AnalysisResults } from "@/types/analysis";

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
      {/* Секція 1: Ключові показники (KPI) */}
      <div className="grid grid-cols-3 gap-6">
        <KPICard
          title="Всього відгуків"
          value={totalReviews}
          icon="📝"
          // Тільки темний фон, без dark: префіксів
          bgColor="bg-indigo-900/50 border border-indigo-700"
        />
        <KPICard
          title="Позитивних"
          value={`${positivePercent}%`}
          icon="👍"
          // Тільки темний фон, без dark: префіксів
          bgColor="bg-emerald-900/50 border border-emerald-700"
        />
        <KPICard
          title="Негативних"
          value={`${negativePercent}%`}
          icon="👎"
          // Тільки темний фон, без dark: префіксів
          bgColor="bg-red-900/50 border border-red-700"
        />
      </div>

      {/* Секція 2: Графіки візуалізації */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="p-6 bg-gray-800 flex flex-col justify-center items-center rounded-xl shadow-2xl shadow-gray-900/50 border border-gray-700">
          <h3 className="text-xl font-semibold mb-6 text-gray-100">
            Розподіл настроїв
          </h3>
          <SentimentChart data={sentimentData} />
        </div>

        {/* Графік 2: Топ-теми скарг (Стовпчаста діаграма) */}
        <div className="p-6 bg-gray-800 rounded-xl shadow-2xl shadow-gray-900/50 border border-gray-700">
          <h3 className="text-xl font-semibold mb-6 text-gray-100">
            Топ-5 тем, згаданих у відгуках
          </h3>
          {/* Передаємо дані у компонент TopicChart */}
          <TopicChart data={topicData} />
        </div>
      </div>
      <div className="p-6 bg-gray-800 rounded-xl shadow-2xl shadow-gray-900/50 border border-gray-700">
        <h3 className="text-xl font-semibold mb-6 text-gray-100">
          Динаміка настроїв з часом
        </h3>
        <SentimentTimelineChart data={results.sentimentTimeline} />
      </div>

      {/* Секція 3: Приклади проаналізованих відгуків */}
      <div className="p-6 bg-gray-800 rounded-xl shadow-2xl shadow-gray-900/50 border border-gray-700">
        <h3 className="text-xl font-semibold mb-6 text-gray-100">
          Приклади проаналізованих відгуків
        </h3>
        <ReviewTable reviews={analyzedReviews} />
      </div>
    </div>
  );
}

// Допоміжний компонент для відображення ключових показників (ОНОВЛЕНО)
const KPICard = ({ title, value, icon, bgColor }) => (
  // Використовуємо bgColor тільки для фону та рамки, текст фіксований для темної теми
  <div className={`p-4 rounded-xl shadow-md border ${bgColor}`}>
    <div className="text-sm mb-1 font-medium text-gray-400">
      <span className="text-3xl mr-2 align-middle">{icon}</span>
      <span className="align-middle">{title}</span>
    </div>
    <div className="text-3xl font-extrabold mt-1 text-gray-50">{value}</div>
  </div>
);
