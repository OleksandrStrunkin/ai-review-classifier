import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TopicChart({ data }) {
  const INDIGO_COLOR = "rgba(109, 40, 217, 0.8)";
  const INDIGO_BORDER = "rgba(109, 40, 217, 1)";
  const TEXT_COLOR = "#A0AEC0";
  const GRID_COLOR = "rgba(55, 65, 81, 0.5)";

  const chartData = {
    labels: data.map((d) => d.topic),
    datasets: [
      {
        label: "Кількість згадок",
        data: data.map((d) => d.count),
        backgroundColor: INDIGO_COLOR,
        borderColor: INDIGO_BORDER,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: GRID_COLOR,
          borderColor: GRID_COLOR,
        },
        ticks: {
          color: TEXT_COLOR,
          font: {
            family: "system-ui",
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: TEXT_COLOR,
          font: {
            family: "system-ui",
          },
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
}
