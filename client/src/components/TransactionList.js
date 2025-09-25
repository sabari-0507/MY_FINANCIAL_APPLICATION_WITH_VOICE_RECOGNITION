import React, { useContext, useState } from "react";
import { FinanceContext } from "../context/FinanceContext";
import { LanguageContext } from "../context/LanguageContext";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

function TransactionList({ compactFilesOnly = false }) {
  const { transactions, deleteTransaction, updateTransaction } =
    useContext(FinanceContext);
  const { t } = useContext(LanguageContext);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    type: "",
    category: "",
    amount: "",
    date: "",
  });

  const handleEditClick = (tx) => {
    setEditId(tx._id);
    setForm({
      ...tx,
      amount: tx.amount || "",
      date: tx.date ? tx.date.split("T")[0] : "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (editId) {
      await updateTransaction(editId, {
        ...form,
        amount: Number(form.amount),
        date: form.date,
      });
    }
    setOpen(false);
  };
``
  return (
    <>
      <Table size="small" style={{ minWidth: compactFilesOnly ? 400 : 800 }}>
        <TableHead>
          <TableRow>
            {compactFilesOnly ? (
              <>
                <TableCell>{t.files}</TableCell>
                <TableCell>{t.trip}</TableCell>
                <TableCell>{t.report}</TableCell>
              </>
            ) : (
              <>
                <TableCell>{t.type}</TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell>{t.amount}</TableCell>
                <TableCell>{t.date}</TableCell>
                <TableCell>{t.files}</TableCell>
                <TableCell>{t.report}</TableCell>
                <TableCell>{t.trip}</TableCell>
                <TableCell>{t.actions}</TableCell>
              </>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {transactions?.map((tx) => (
            <TableRow key={tx._id}>
              {compactFilesOnly ? (
                <>
                  <TableCell>
                    {tx.files?.length ? `${tx.files.length} ${t("files")}` : "-"}
                  </TableCell>
                  <TableCell>
                    {tx.tripDestination ||
                      (tx.category?.startsWith("Trip - ")
                        ? tx.category.replace("Trip - ", "")
                        : "-")}
                  </TableCell>
                  <TableCell>{tx.reportTitle || "-"}</TableCell>
                </>
              ) : (
                <>
                  {/* Translate expense/income */}
                  <TableCell>
                    {tx.type === "expense" ? t.expense : t.income}
                  </TableCell>
                  <TableCell>{tx.category}</TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>
                    {tx.date ? new Date(tx.date).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>
                    {tx.files?.length ? `${tx.files.length} ${t("files")}` : "-"}
                  </TableCell>
                  <TableCell>{tx.reportTitle || "-"}</TableCell>
                  <TableCell>
                    {tx.tripDestination ||
                      (tx.category?.startsWith("Trip - ")
                        ? tx.category.replace("Trip - ", "")
                        : "-")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleEditClick(tx)}
                      style={{ marginRight: "8px" }}
                    >
                      {t.edit}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => deleteTransaction(tx._id)}
                    >
                      {t.delete}
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t("editTransaction")}</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            label={t("type")}
            fullWidth
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <MenuItem value="expense">{t("expense")}</MenuItem>
            <MenuItem value="income">{t("income")}</MenuItem>
          </TextField>

          <TextField
            margin="dense"
            label={t("category")}
            fullWidth
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <TextField
            type="number"
            margin="dense"
            label={t("amount")}
            fullWidth
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          <TextField
            type="date"
            margin="dense"
            label={t("date")}
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{t("cancel")}</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {t("save")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TransactionList;
