// src/components/Chart.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from "recharts";
import { Paper, Typography, Box, Divider } from "@mui/material";

/**
 * Pie/Donut chart: Income vs Expense
 * Props:
 *   - data: array of transactions [{ type: "income"|"expense", amount: Number, ... }, ...]
 */
export default function Chart({ data = [] }) {
  // defensive default
  const txns = Array.isArray(data) ? data : [];

  // totals (coerce amount to Number)
  const totalIncome = txns
    .filter((txn) => txn.type === "income")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const totalExpense = txns
    .filter((txn) => txn.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const chartData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];

  const COLORS = ["#00C49F", "#FF8042"];
  const total = totalIncome + totalExpense;

  // Label renderer for slices
  const renderLabel = ({ name, percent, x, y }) => {
    const displayPercent = (percent * 100).toFixed(0);
    const value = name === "Income" ? totalIncome : totalExpense;
    return (
      <text
        x={x}
        y={y}
        fill="#000"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${name}: ₹${value} (${displayPercent}%)`}
      </text>
    );
  };

  // Custom tooltip (Recharts will pass active & payload)
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const percent = total ? ((value / total) * 100).toFixed(2) : "0.00";
      return (
        <Paper elevation={3} sx={{ p: 1 }}>
          <Typography variant="body2">{`${name}: ₹${value} (${percent}%)`}</Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper elevation={6} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" align="center" gutterBottom>
        💹 Income vs Expense Overview
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box display="flex" justifyContent="center" alignItems="center">
        <PieChart width={350} height={280}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={100}
            innerRadius={60} // donut
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" />
            ))}
          </Pie>

          {/* pass component instance to content prop */}
          <RechartsTooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </Box>
    </Paper>
  );
}
