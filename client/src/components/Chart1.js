import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Chart1({ data }) {
  // Group transactions by date
  const grouped = data.reduce((acc, t) => {
    const date = t.date?.substring(0, 10);
    if (!acc[date]) acc[date] = { income: 0, expense: 0 };
    acc[date][t.type] += t.amount;
    return acc;
  }, {});

  const labels = Object.keys(grouped).sort();
  const incomeData = labels.map((d) => grouped[d].income);
  const expenseData = labels.map((d) => grouped[d].expense);

  // Line chart (trend)
  const lineData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        borderColor: "green",
        backgroundColor: "rgba(76, 175, 80, 0.3)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Expense",
        data: expenseData,
        borderColor: "red",
        backgroundColor: "rgba(244, 67, 54, 0.3)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Income vs Expense Over Time" },
    },
  };

  return (
    <div className="card shadow p-3" style={{ width: "100%", background: "#fff" }}>
      <div className="card-body">
        <h5 className="card-title text-center">Income vs Expense Trend</h5>
        <Line data={lineData} options={lineOptions} />
      </div>
    </div>
  );
}
