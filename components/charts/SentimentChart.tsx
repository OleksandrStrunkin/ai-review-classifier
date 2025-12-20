import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { SentimentMetric } from "@/types/analysis";

ChartJS.register(ArcElement, Tooltip, Legend);

type SentimentChartProps = {
  data: SentimentMetric[];
};

export default function SentimentChart({ data }: SentimentChartProps) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: data.map((d) => d.color),
        hoverOffset: 10,
        borderWidth: 2,
        borderColor: "#1f2937",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#A0AEC0",
          padding: 20,
          usePointStyle: true,
          font: {
            size:
              typeof window !== "undefined" && window.innerWidth < 768
                ? 12
                : 14,
          },
        },
      },
      tooltip: {
        padding: 12,
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        callbacks: {
          label: function (context: any) {
            let label = context.label || "";
            if (label) label += ": ";
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1) + "%";
            return `${label}${value} (${percentage})`;
          },
        },
      },
    },
  };

  return (
    <div className="h-72 md:h-64 w-full flex justify-center items-center">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
