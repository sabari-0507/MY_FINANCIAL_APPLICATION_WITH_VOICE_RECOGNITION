import React, { useContext, useState } from "react";
import { FinanceContext } from "../context/FinanceContext";
import Chart from "../components/Chart";
import Chart1 from "../components/Chart1";
import { LanguageContext } from "../context/LanguageContext";
import my from '../photos/hi.jpg'

// MUI Components
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  AccountBalance,
} from "@mui/icons-material";
import BackgroundWrapper from "./BackgroundWrapper";

function Dashboard() {
  const { transactions, deleteTransaction, updateTransaction } =
    useContext(FinanceContext);
  const { t } = useContext(LanguageContext);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  

  const downloadCsv = (rows, filename) => {
    if (!rows.length) return;
    const csv = [Object.keys(rows[0]).join(",")]
      .concat(rows.map((r) => Object.values(r).join(",")))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportTransactionsCsv = () => {
    const rows = transactions.map((x) => ({
      [t.date]: x.date?.substring(0, 10) || "",
      [t.category]: x.category,
      [t.amount]: x.amount,
      [t.type]: x.type,
    }));
    downloadCsv(rows, "transactions.csv");
  };

  const exportTransactionsPdf = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    const tableRows = transactions
      .map(
        (x) =>
          `<tr><td>${x.date?.substring(0, 10) || ""}</td><td>${x.category}</td><td>${x.amount}</td><td>${x.type}</td></tr>`
      )
      .join("");
    win.document.write(`
      <html><head><title>${t.transactionList || "Transaction List"}</title>
      <style>table{width:100%;border-collapse:collapse}td,th{border:1px solid #333;padding:6px;text-align:center}</style>
      </head><body>
      <h3>${t.transactionList || "Transaction List"}</h3>
      <table>
      <thead><tr><th>${t.date}</th><th>${t.category}</th><th>${t.amount}</th><th>${t.type}</th></tr></thead>
      <tbody>${tableRows}</tbody>
      </table>
      <script>window.onload = () => window.print()</script>
      </body></html>`);
    win.document.close();
  };

  const handleEdit = (txn) => {
    setEditingId(txn._id);
    setEditForm({ ...txn, date: txn.date?.substring(0, 10) });
  };

  const handleSave = async (id) => {
    await updateTransaction(id, {
      ...editForm,
      amount: Number(editForm.amount),
    });
    setEditingId(null);
  };

  // Reusable hover style
  const cardHover = {
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0px 8px 20px rgba(0,0,0,0.3)",
      cursor: "pointer",
    },
  };

  return (
     <BackgroundWrapper>
    <Box
      sx={{
        maxWidth: "2500px",
        margin: "0 auto",
        padding: 3,
        minHeight: "100vh",
        
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    ><Typography
  variant="h3"
  gutterBottom
  align="center"
  sx={{
    color: "white",
    fontWeight: "bold",
    textShadow: "2px 2px 6px rgba(0,0,0,0.8)",
    mb: 4,
  }}
>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 2, // spacing between logo and text
    }}
  >
    {/* Logo / Brand */}
    <Box
      sx={{
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      <img
        src={my}
        alt="App Logo"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </Box>

    {/* Dashboard Title */}
    {t.dashboard}
  </Box>
</Typography>

      {/* ✅ Summary Cards */}
      <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              ...cardHover,
              borderRadius: 4,
              background: "linear-gradient(135deg, #81c784, #388e3c)",
              color: "white",
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <ArrowUpward fontSize="large" />
                <Box>
                  <Typography variant="h6">{t.totalIncome}</Typography>
                  <Typography variant="h4" className="fw-bold">
                    ₹{income}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              ...cardHover,
              borderRadius: 4,
              background: "linear-gradient(135deg, #e57373, #b71c1c)",
              color: "white",
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <ArrowDownward fontSize="large" />
                <Box>
                  <Typography variant="h6">{t.totalExpense}</Typography>
                  <Typography variant="h4" className="fw-bold">
                    ₹{expense}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              ...cardHover,
              borderRadius: 4,
              background: "linear-gradient(135deg, #64b5f6, #0d47a1)",
              color: "white",
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AccountBalance fontSize="large" />
                <Box>
                  <Typography variant="h6">{t.netBalance}</Typography>
                  <Typography variant="h4" className="fw-bold">
                    ₹{balance}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ✅ Charts */}
      <Box mb={8}>
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 4,
                boxShadow: 6,
                background: "rgba(255,255,255,0.9)",
              }}
            >
              <Typography
                variant="h6"
                align="center"
                gutterBottom
                className="fw-bold"
              >
                📈 {t.incomeVsExpenseOverTime || "Income vs Expense Over Time"}
              </Typography>
              <Box sx={{ flex: 1, minHeight: "300px" }}>
                <Chart data={transactions} />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 4,
                boxShadow: 6,
                background: "rgba(255,255,255,0.9)",
              }}
            >
              <Typography
                variant="h6"
                align="center"
                gutterBottom
                className="fw-bold"
              >
                🥧 {t.incomeExpenseDistribution || "Income vs Expense Distribution"}
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  minHeight: "300px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Chart1 data={transactions} />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* ✅ Transaction List (original layout) */}
      <Grid item xs={12} md={10} sx={{ margin: "0 auto" }}>
        <Paper elevation={8} className="p-4 rounded-4 shadow-lg">
          <Typography
            variant="h6"
            gutterBottom
            align="center"
            className="fw-bold text-primary"
          >
            📋 {t.transactionList || "Transaction List"}
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <div className="table-responsive" style={{ maxWidth: 900, margin: "0 auto" }}>
            <table className="table table-striped table-hover table-bordered rounded">
              <thead className="table-dark text-center">
                <tr>
                  <th>{t.date}</th>
                  <th>{t.category}</th>
                  <th>{t.amount}</th>
                  <th>{t.type}</th>
                  <th>{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn._id} className="align-middle text-center">
                    <td>
                      {editingId === txn._id ? (
                        <input
                          type="date"
                          className="form-control"
                          value={editForm.date || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, date: e.target.value })
                          }
                        />
                      ) : (
                        txn.date?.substring(0, 10)
                      )}
                    </td>
                    <td>
                      {editingId === txn._id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm({ ...editForm, category: e.target.value })
                          }
                        />
                      ) : (
                        txn.category
                      )}
                    </td>
                    <td>
                      {editingId === txn._id ? (
                        <input
                          type="number"
                          className="form-control"
                          value={editForm.amount}
                          onChange={(e) =>
                            setEditForm({ ...editForm, amount: e.target.value })
                          }
                        />
                      ) : (
                        <span className="fw-bold text-primary">{txn.amount}</span>
                      )}
                    </td>
                    <td>
                      {editingId === txn._id ? (
                        <select
                          className="form-select"
                          value={editForm.type}
                          onChange={(e) =>
                            setEditForm({ ...editForm, type: e.target.value })
                          }
                        >
                          <option value="income">Income</option>
                          <option value="expense">Expense</option>
                        </select>
                      ) : (
                        <span className={`badge ${txn.type === "income" ? "bg-success" : "bg-danger"}`}>
                          {txn.type === "income" ? t.income : t.expense}
                        </span>
                      )}
                    </td>
                    <td>
                      {editingId === txn._id ? (
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleSave(txn._id)}
                          >
                            {t.save}
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setEditingId(null)}
                          >
                            {t.cancel}
                          </Button>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            onClick={() => handleEdit(txn)}
                          >
                            {t.edit}
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => deleteTransaction(txn._id)}
                          >
                            {t.delete}
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Paper>
      </Grid>
    </Box>
    </BackgroundWrapper>
  );
}

export default Dashboard;
