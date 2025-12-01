
import React from "react";
import SentimentChart from "./charts/SentimentChart";
import TopicChart from "./charts/TopicChart";

/**
 * Головна панель для відображення результатів аналізу.
 * @param {object} props
 * @param {object} props.results - Об'єкт із результатами аналізу (DUMMY_RESULTS).
 */
export default function ResultsDashboard({ results }) {
  if (!results) {
    return null;
  }

  const { totalReviews, sentimentData, topicData } = results;
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
          bgColor="bg-indigo-100 dark:bg-indigo-900"
        />
        <KPICard
          title="Позитивних"
          value={`${positivePercent}%`}
          icon="👍"
          bgColor="bg-emerald-100 dark:bg-emerald-900"
        />
        <KPICard
          title="Негативних"
          value={`${negativePercent}%`}
          icon="👎"
          bgColor="bg-red-100 dark:bg-red-900"
        />
      </div>

      {/* Секція 2: Графіки візуалізації */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Графік 1: Класифікація настроїв (Кругова діаграма) */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Розподіл настроїв
          </h3>
          {/* Передаємо дані у компонент SentimentChart */}
          <SentimentChart data={sentimentData} />
        </div>

        {/* Графік 2: Топ-теми скарг (Стовпчаста діаграма) */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Топ-5 тем, згаданих у відгуках
          </h3>
          {/* Передаємо дані у компонент TopicChart */}
          <TopicChart data={topicData} />
        </div>
      </div>

      {/* Опціональна Секція 3: Приклади відгуків (заглушка) */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Приклади проаналізованих відгуків
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          *(Тут буде таблиця з оригінальним текстом, настроєм та темою, коли ми
          отримаємо реальні результати від API.)*
        </p>
      </div>
    </div>
  );
}

// Допоміжний компонент для відображення ключових показників
const KPICard = ({ title, value, icon, bgColor }) => (
  <div className={`p-4 rounded-xl shadow-md ${bgColor} dark:text-gray-900`}>
    <div className="text-3xl mb-1">{icon}</div>
    <div className="text-sm font-medium text-gray-600 dark:text-gray-900">
      {title}
    </div>
    <div className="text-2xl font-bold mt-1 text-gray-800 dark:text-gray-900">
      {value}
    </div>
  </div>
);
