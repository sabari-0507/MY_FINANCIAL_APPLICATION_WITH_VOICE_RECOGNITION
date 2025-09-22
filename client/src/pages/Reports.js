import React, { useContext, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FinanceContext } from "../context/FinanceContext";
import { LanguageContext } from "../context/LanguageContext";
import BackgroundWrapper from "./BackgroundWrapper";

export default function Reports() {
  const { transactions } = useContext(FinanceContext);
  const { t } = useContext(LanguageContext);

  const safeTxns = transactions || [];

  const { monthlyArray, totals } = useMemo(() => {
    const monthlyData = transactions.reduce((acc, t) => {
      const month = new Date(t.date).toLocaleString("default", { month: "short" });
      if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
      if (t.type === "income") acc[month].income += t.amount;
      else acc[month].expense += t.amount;
      return acc;
    }, {});
    const monthlyArrayLocal = Object.values(monthlyData);

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    return { monthlyArray: monthlyArrayLocal, totals: { totalIncome, totalExpense } };
  }, [transactions]);

  const totalIncome = totals.totalIncome;
  const totalExpense = totals.totalExpense;
  const totalNet = totalIncome - totalExpense; // ✅ FIXED

  return (
    <BackgroundWrapper>
      <Box
        sx={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom color="white">
          📊 {t.financialReport}
        </Typography>

        {safeTxns.length === 0 && (
          <Typography variant="h6" align="center" color="white">
            No Data Available
          </Typography>
        )}

        {/* ✅ Summary Cards */}
        <div className="row mb-4">
          {/* Income */}
          <div className="col-12 col-md-4 mb-3">
            <Card
              className="h-100 text-center p-3 summary-card"
              sx={{
                borderRadius: 3,
                backgroundColor: "#e6f4ea",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 8px 20px rgba(0,0,0,0.3)",
                  cursor: "pointer",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" className="fw-bold text-success">
                  {t.totalIncome}
                </Typography>
                <Typography variant="h4" className="fw-bold text-dark">
                  ₹{totalIncome}
                </Typography>
              </CardContent>
            </Card>
          </div>

          {/* Expense */}
          <div className="col-12 col-md-4 mb-3">
            <Card
              className="h-100 text-center p-3 summary-card"
              sx={{
                borderRadius: 3,
                backgroundColor: "#fdecea",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 8px 20px rgba(0,0,0,0.3)",
                  cursor: "pointer",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" className="fw-bold text-danger">
                  {t.totalExpense}
                </Typography>
                <Typography variant="h4" className="fw-bold text-dark">
                  ₹{totalExpense}
                </Typography>
              </CardContent>
            </Card>
          </div>

          {/* Net Balance */}
          <div className="col-12 col-md-4 mb-3">
            <Card
              className="h-100 text-center p-3 summary-card"
              sx={{
                borderRadius: 3,
                backgroundColor: "#e8f0fe",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 8px 20px rgba(0,0,0,0.3)",
                  cursor: "pointer",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" className="fw-bold text-primary">
                  {t.netBalance}
                </Typography>
                <Typography
                  variant="h4"
                  className={`fw-bold ${
                    totalNet >= 0 ? "text-success" : "text-danger"
                  }`}
                >
                  ₹{totalNet}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ✅ Charts */}
        <div className="row">
          <div className="col-12 col-md-6 mb-4">
            <Card className="h-100 shadow-lg border-0 chart-card">
              <div className="card-header bg-primary text-white fw-bold text-center">
                {t.monthlyProfitStatistics}
              </div>
              <CardContent className="d-flex flex-column align-items-center">
                <Box sx={{ width: "100%", height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyArray}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="income" stroke="#00c853" />
                      <Line type="monotone" dataKey="expense" stroke="#e53935" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <Card className="h-100 shadow-lg border-0 chart-card">
              <div className="card-header bg-warning fw-bold text-center">
                {t.revenueVsCost}
              </div>
              <CardContent className="d-flex flex-column align-items-center">
                <Box sx={{ width: "100%", height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyArray}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="income" fill="#00c853" />
                      <Bar dataKey="expense" fill="#e53935" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ✅ Monthly Report Table */}
        <Paper className="mt-4 shadow-lg p-3" style={{ borderRadius: "12px" }}>
          <Typography
            variant="h6"
            className="fw-bold text-center text-primary mb-3"
          >
            📅 Monthly Report
          </Typography>

          <table className="table table-bordered table-hover table-striped text-center align-middle shadow">
            <thead className="table-dark">
              <tr>
                <th>Month</th>
                <th>Income</th>
                <th>Expense</th>
                <th>Net Balance</th>
              </tr>
            </thead>

            <tbody>
              {monthlyArray.map((row, index) => {
                const net = row.income - row.expense;
                let rowClass = "";

                if (net > 0) rowClass = "table-success";
                else if (net < 0) rowClass = "table-danger";
                else rowClass = "table-warning";

                return (
                  <tr key={index} className={rowClass}>
                    <td className="fw-bold">{row.month}</td>
                    <td className="fw-semibold text-success">₹{row.income}</td>
                    <td className="fw-semibold text-danger">₹{row.expense}</td>
                    <td
                      className={`fw-bold ${
                        net >= 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      ₹{net}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot className="table-primary fw-bold">
              <tr>
                <td>Total</td>
                <td className="text-success">₹{totalIncome}</td>
                <td className="text-danger">₹{totalExpense}</td>
                <td className={totalNet >= 0 ? "text-success" : "text-danger"}>
                  ₹{totalNet}
                </td>
              </tr>
            </tfoot>
          </table>
        </Paper>
      </Box>
    </BackgroundWrapper>
  );
}
