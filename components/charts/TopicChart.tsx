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
import { TopicMetric } from "@/types/analysis";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type TopicChartProps = {
  data: TopicMetric[];
};

export default function TopicChart({ data }: TopicChartProps) {
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
        borderRadius: 6,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        padding: 10,
        bodyFont: { size: 14 },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: GRID_COLOR,
          drawBorder: false,
        },
        ticks: {
          color: TEXT_COLOR,
          font: { size: 11 },
          maxTicksLimit: 6,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: TEXT_COLOR,
          font: {
            size:
              typeof window !== "undefined" && window.innerWidth < 768
                ? 11
                : 13,
            family: "system-ui",
          },
          callback: function (value: any, index: number) {
            const label = data[index].topic;
            if (
              typeof window !== "undefined" &&
              window.innerWidth < 768 &&
              label.length > 12
            ) {
              return label.substring(0, 10) + "...";
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="h-[350px] md:h-80 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}