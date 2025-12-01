
import React from "react";
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
  const chartData = {
    labels: data.map((d) => d.topic),
    datasets: [
      {
        label: "Кількість згадок",
        data: data.map((d) => d.count),
        backgroundColor: "rgba(59, 130, 246, 0.7)", // blue-500
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y", // Робимо її горизонтальною
    responsive: true,
    plugins: {
      legend: {
        display: false, // Не показуємо легенду для одного набору даних
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: "rgba(107, 114, 128, 0.2)", // Колір сітки для Dark Mode
        },
        ticks: {
          color: "hsl(210 4% 46%)", // Колір тексту
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "hsl(210 4% 46%)", // Колір тексту
        },
      },
    },
  };

  return (
    <div className="h-64">
      {/* Забезпечуємо фіксовану висоту */}
      <Bar data={chartData} options={options} />
    </div>
  );
}
