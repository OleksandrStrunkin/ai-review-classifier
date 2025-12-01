
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SentimentChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: data.map((d) => d.color),
        hoverOffset: 4,
      },
    ],
  };


  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "hsl(210 4% 46%)", // Колір тексту для Dark Mode
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            // Додаємо відсоток до підказки
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1) + "%";
            return label + value + " (" + percentage + ")";
          },
        },
      },
    },
  };

  return (
    <div className="h-64">
      {/* Забезпечуємо фіксовану висоту для кращого відображення */}
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
