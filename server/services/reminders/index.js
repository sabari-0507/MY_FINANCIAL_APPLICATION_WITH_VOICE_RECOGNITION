import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("Missing MONGO_URI");
  process.exit(1);
}
await mongoose.connect(MONGO_URI);

const reminderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    dueDate: { type: Date, required: true },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Reminder = mongoose.model("Reminder", reminderSchema);

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.userId = decoded.userId;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

app.post("/reminders", auth, async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    if (!title || !dueDate) return res.status(400).json({ error: "Title and dueDate required" });
    const reminder = await Reminder.create({ user: req.userId, title, dueDate: new Date(dueDate) });
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ error: "Failed to add reminder" });
  }
});

app.get("/reminders", auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.userId }).sort({ dueDate: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
});

app.put("/reminders/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };
    if (update.dueDate) update.dueDate = new Date(update.dueDate);
    const updated = await Reminder.findOneAndUpdate(
      { _id: id, user: req.userId },
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Reminder not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

app.delete("/reminders/:id", auth, async (req, res) => {
  try {
    const deleted = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deleted) return res.status(404).json({ error: "Reminder not found" });
    res.json({ message: "Reminder deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => console.log(`Reminders service on ${PORT}`));


