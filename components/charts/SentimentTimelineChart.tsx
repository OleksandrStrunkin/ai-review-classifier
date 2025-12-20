import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { SentimentTimelinePoint } from "@/types/analysis";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type SentimentTimelineChartProps = {
  data: SentimentTimelinePoint[];
};

export default function SentimentTimelineChart({ data }: SentimentTimelineChartProps) {
  const TEXT_COLOR = "#A0AEC0";
  const GRID_COLOR = "rgba(55, 65, 81, 0.5)";
  const POSITIVE_COLOR = "rgba(16, 185, 129, 1)";
  const NEGATIVE_COLOR = "rgba(239, 68, 68, 1)";
  const NEUTRAL_COLOR = "rgba(245, 158, 11, 1)";

  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Позитивні",
        data: data.map((d) => d.Positive),
        borderColor: POSITIVE_COLOR,
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: false,
        tension: 0.3,
      },
      {
        label: "Негативні",
        data: data.map((d) => d.Negative),
        borderColor: NEGATIVE_COLOR,
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: false,
        tension: 0.3,
      },
      {
        label: "Нейтральні",
        data: data.map((d) => d.Neutral),
        borderColor: NEUTRAL_COLOR,
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: TEXT_COLOR,
          usePointStyle: true,
          padding: 20,
          font: {
            size:
              typeof window !== "undefined" && window.innerWidth < 768
                ? 10
                : 12,
          },
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: { color: GRID_COLOR },
        ticks: {
          color: TEXT_COLOR,
          maxRotation: 45,
          minRotation: 45,
          font: { size: 10 },
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: GRID_COLOR },
        ticks: {
          color: TEXT_COLOR,
          font: { size: 10 },
        },
        title: {
          display: typeof window !== "undefined" && window.innerWidth > 768, // Ховаємо заголовок осі на мобільних для економії місця
          text: "Кількість",
          color: TEXT_COLOR,
        },
      },
    },
  };

  return (
    <div className="h-[300px] md:h-[400px] w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}
