import React, { useContext, useRef, useState, useEffect } from "react";
import { FinanceContext } from "../context/FinanceContext";
import TransactionForm from "../components/TransactionForm";
import {
  Container,
  Paper,
  Typography,
  Divider,
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { LanguageContext } from "../context/LanguageContext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MicIcon from "@mui/icons-material/Mic";
import { apiClient } from "../services/api";
import BackgroundWrapper from "./BackgroundWrapper";

// 🔔 Bell sound
const bellSound = "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg";

function Transactions() {
  const { addTransaction, addTransactionLocal } = useContext(FinanceContext);
  const { t } = useContext(LanguageContext);

  const [tripOpen, setTripOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);

  const [trip, setTrip] = useState({
    destination: "",
    amount: "",
    date: "",
    notes: "",
  });
  const [report, setReport] = useState({
    title: "",
    amount: "",
    date: "",
    notes: "",
  });
  const [reminder, setReminder] = useState({ title: "", dueDate: "" });

  const [remindersList, setRemindersList] = useState([]);

  // 🎙️ Voice state
  const [listening, setListening] = useState(false);
  const [voiceMsg, setVoiceMsg] = useState("");

  // 📎 Receipt Upload
  const fileInputRef = useRef(null);
  const handleAddReceipt = () => fileInputRef.current?.click();
  const handleReceiptSelected = (e) => {
    const file = e.target.files?.[0];
    if (file) alert(`${t.receiptSelected}: ${file.name}`);
  };

  // 🚀 Submit Trip
  const submitTrip = async () => {
    if (!trip.destination || !trip.amount || !trip.date) return;
    await addTransaction({
      type: "expense",
      category: `Trip - ${trip.destination}`,
      amount: Number(trip.amount),
      date: trip.date,
      notes: trip.notes,
    });
    setTripOpen(false);
    setTrip({ destination: "", amount: "", date: "", notes: "" });
  };

  // 📑 Submit Report
  const submitReport = async () => {
    if (!report.title || !report.date) return;
    await addTransaction({
      type: "expense",
      category: "Report",
      amount: Number(report.amount || 0),
      date: report.date,
      reportTitle: report.title,
      notes: report.notes,
    });
    setReportOpen(false);
    setReport({ title: "", amount: "", date: "", notes: "" });
  };

  // ⏰ Submit Reminder
  const submitReminder = async () => {
    if (!reminder.title || !reminder.dueDate) return;
    try {
      await apiClient.post(`/api/reminders`, reminder, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReminderOpen(false);
      setReminder({ title: "", dueDate: "" });
      fetchReminders();
    } catch {
      alert("❌ Failed to add reminder");
    }
  };

  // ⏳ Fetch Reminders
  const fetchReminders = async () => {
    try {
      const res = await apiClient.get(`/api/reminders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRemindersList(res.data);
    } catch (err) {
      console.error("Error fetching reminders:", err);
    }
  };

 

  // 🎙️ Voice Recognition
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("❌ Voice recognition not supported");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceMsg(`🎙️ Heard: ${transcript}`);
      try {
        const res = await apiClient.post(`/api/voice-transaction`, { text: transcript });
        const txn = res.data?.transaction;
        setVoiceMsg(`✅ Saved: ${txn.category} - ₹${txn.amount}`);
        // Immediately reflect in UI
        addTransactionLocal(txn);
      } catch {
        setVoiceMsg("❌ Error saving transaction");
      }
    };
    recognition.start();
  };

  return (
    <BackgroundWrapper>
      <Box
        sx={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: 2,
          minHeight: "100vh",
        }}
      >
        <Container>
          <Typography variant="h4" gutterBottom align="center">
            💳 {t.transactionsTitle}
          </Typography>

          {/* 🚀 Quick Actions */}
          <div className="d-flex justify-content-center flex-wrap gap-3 mt-4">
            {/* ✈️ Trip */}
            <Paper className="shadow-lg text-center p-3">
              <AddCircleOutlineIcon
                className="text-secondary mb-2"
                fontSize="large"
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setTripOpen(true)}
              >
                {t.createTrip}
              </Button>
            </Paper>

            {/* 🎙️ Mic */}
            <div className="text-center">
              <Button
                variant="contained"
                onClick={handleVoiceInput}
                className="rounded-circle shadow-lg"
                style={{
                  width: "70px",
                  height: "70px",
                  fontSize: "28px",
                  backgroundColor: listening ? "#ff4d4d" : "#dc3545",
                }}
              >
                <MicIcon fontSize="large" />
              </Button>
              <Typography variant="body2" className="fw-bold text-dark mt-2">
                {voiceMsg}
              </Typography>
            </div>
            </div>

          {/* ➕ Transaction Form */}
          <div className="row justify-content-center mt-4">
            <div className="col-12 col-md-8">
              <Paper className="shadow-lg p-4 rounded-4">
                <Typography
                  variant="h6"
                  gutterBottom
                  className="fw-bold text-primary"
                >
                  {t.addNewTransaction}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TransactionForm />
              </Paper>
            </div>
          </div>
        </Container>

        {/* Trip Dialog */}
        <Dialog open={tripOpen} onClose={() => setTripOpen(false)}>
          <DialogTitle>{t.createTrip}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              label="Destination"
              value={trip.destination}
              onChange={(e) =>
                setTrip({ ...trip, destination: e.target.value })
              }
            />
            <TextField
              fullWidth
              margin="dense"
              label="Amount"
              type="number"
              value={trip.amount}
              onChange={(e) => setTrip({ ...trip, amount: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={trip.date}
              onChange={(e) => setTrip({ ...trip, date: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Notes"
              multiline
              rows={3}
              value={trip.notes}
              onChange={(e) => setTrip({ ...trip, notes: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTripOpen(false)}>{t.cancel}</Button>
            <Button onClick={submitTrip} variant="contained" color="primary">
              {t.save}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Report Dialog */}
        <Dialog open={reportOpen} onClose={() => setReportOpen(false)}>
          <DialogTitle>{t.createReport}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              label="Title"
              value={report.title}
              onChange={(e) => setReport({ ...report, title: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Amount"
              type="number"
              value={report.amount}
              onChange={(e) => setReport({ ...report, amount: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={report.date}
              onChange={(e) => setReport({ ...report, date: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Notes"
              multiline
              rows={3}
              value={report.notes}
              onChange={(e) => setReport({ ...report, notes: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReportOpen(false)}>{t.cancel}</Button>
            <Button onClick={submitReport} variant="contained" color="primary">
              {t.save}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reminder Dialog */}
        <Dialog open={reminderOpen} onClose={() => setReminderOpen(false)}>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              label="Title"
              value={reminder.title}
              onChange={(e) =>
                setReminder({ ...reminder, title: e.target.value })
              }
            />
            <TextField
              fullWidth
              margin="dense"
              label="Due Date"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={reminder.dueDate}
              onChange={(e) =>
                setReminder({ ...reminder, dueDate: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReminderOpen(false)}>{t.cancel}</Button>
            <Button
              onClick={submitReminder}
              variant="contained"
              color="primary"
            >
              {t.save}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </BackgroundWrapper>
  );
}

export default Transactions;
