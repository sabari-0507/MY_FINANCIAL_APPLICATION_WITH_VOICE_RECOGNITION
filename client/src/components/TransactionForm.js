import { useState, useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";
import { TextField, Button, MenuItem, Grid, Paper, Typography } from "@mui/material";
import { LanguageContext } from "../context/LanguageContext";

function TransactionForm() {
  const { addTransaction } = useContext(FinanceContext);
  const { t } = useContext(LanguageContext);
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    amount: "",
    date: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save date exactly as yyyy-mm-dd
    addTransaction({
      ...form,
      amount: Number(form.amount),
      date: form.date,
    });
    setForm({ type: "expense", category: "", amount: "", date: "" });
  };

  return (
    <Paper
      elevation={3}
      className="p-4 mb-4"
      style={{ maxWidth: 600, margin: "0 auto", borderRadius: "12px" }}
    >
      <Typography variant="h6" gutterBottom align="center" color="primary">
        {t.addTransaction}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Type */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label={t.type}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              fullWidth
              required
            >
              <MenuItem value="expense">Expense</MenuItem>
              <MenuItem value="income">Income</MenuItem>
            </TextField>
          </Grid>

          {/* Category */}
          <Grid item xs={12} sm={6}>
            <TextField
              label={t.category}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              fullWidth
              required
            />
          </Grid>

          {/* Amount */}
          <Grid item xs={12} sm={6}>
            <TextField
              type="number"
              label={t.amount}
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              fullWidth
              required
            />
          </Grid>

          {/* Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              label={t.date}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          {/* Submit */}
          <Grid item xs={12} className="text-center">
            <Button type="submit" variant="contained" color="primary" size="large">
              {t.addTransaction}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default TransactionForm;
