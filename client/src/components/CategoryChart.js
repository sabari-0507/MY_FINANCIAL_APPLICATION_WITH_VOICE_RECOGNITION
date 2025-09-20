import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function CategoryChart({ data }) {
  // Group expenses by category
  const grouped = data
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const labels = Object.keys(grouped);
  const amounts = Object.values(grouped);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Expenses",
        data: amounts,
        backgroundColor: [
          "#f44336",
          "#2196f3",
          "#4caf50",
          "#ff9800",
          "#9c27b0",
          "#009688",
          "#795548",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "right" },
      title: { display: true, text: "Expense by Category" },
    },
  };

  return <Pie data={chartData} options={options} />;
}
