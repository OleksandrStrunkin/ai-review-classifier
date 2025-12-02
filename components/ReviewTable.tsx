

export default function ReviewTable({ reviews }) {
  if (!reviews || reviews.length === 0) return null;

  // Функція для визначення кольору на основі настрою
  const getSentimentStyle = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "bg-emerald-500 text-white";
      case "negative":
        return "bg-red-500 text-white";
      case "neutral":
        return "bg-amber-500 text-gray-800";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Припускаємо, що reviews — це масив об'єктів, кожен з яких має {original_text, sentiment, topic}
  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-700 dark:divide-gray-700">
        <thead className="bg-gray-700 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Відгук
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Настрій
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Тема
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700 dark:divide-gray-700">
          {reviews.map((review, index) => (
            <tr
              key={index}
              className="bg-gray-800 hover:bg-gray-700 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-normal text-sm text-gray-300 max-w-sm">
                {review.original_text}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSentimentStyle(
                    review.sentiment || "Error"
                  )}`}
                >
                  {review.sentiment || "Error"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {review.topic || "Не визначено"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
