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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SentimentTimelineChart({ data }) {
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
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: TEXT_COLOR,
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          color: TEXT_COLOR,
        },
        grid: {
          color: GRID_COLOR,
          borderColor: GRID_COLOR,
        },
        ticks: {
          color: TEXT_COLOR,
        },
      },
      y: {
        title: {
          display: true,
          text: "Кількість відгуків",
          color: TEXT_COLOR,
        },
        beginAtZero: true,
        grid: {
          color: GRID_COLOR,
        },
        ticks: {
          color: TEXT_COLOR,
        },
      },
    },
  };

  return (
    <div className="h-96">
      <Line data={chartData} options={options} />
    </div>
  );
}
