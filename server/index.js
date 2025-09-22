import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.error(" MongoDB Error:", err));

// ====== Schemas / Models ======
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    badges: [{ type: String }],
    streak: { type: Number, default: 0 },
    lastTransactionDate: { type: Date },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true, enum: ["income", "expense"] },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    files: [{ type: String }],
    reportTitle: { type: String },
    tripDestination: { type: String },
    notes: { type: String },
    source: { type: String, default: "manual" },
  },
  { timestamps: true }
);
const Transaction = mongoose.model("Transaction", transactionSchema);

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

// ====== Auth Middleware ======
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ====== Auth Routes ======
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already registered" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    res.status(201).json({ message: "Registered", user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ====== Transaction Routes ======

// GET all transactions for user
app.get("/api/transactions", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error("Fetch transactions error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// CREATE transaction
app.post("/api/transactions", authMiddleware, async (req, res) => {
  try {
    const payload = { ...req.body, user: req.userId, date: new Date(req.body.date || Date.now()) };
    const newTxn = await Transaction.create(payload);

    // gamification update (kept simple)
    const user = await User.findById(req.userId);
    if (user) {
      let updatedBadges = Array.isArray(user.badges) ? [...user.badges] : [];
      const totalTxns = await Transaction.countDocuments({ user: req.userId });
      if (totalTxns === 1 && !updatedBadges.includes("First Transaction")) updatedBadges.push("First Transaction");
      if (payload.source === "voice" && !updatedBadges.includes("Voice Starter")) updatedBadges.push("Voice Starter");

      // streak update
      let newStreak = user.streak || 0;
      if (user.lastTransactionDate) {
        const diffDays = Math.floor((Date.now() - new Date(user.lastTransactionDate)) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) newStreak += 1;
        else if (diffDays > 1) newStreak = 1;
      } else {
        newStreak = 1;
      }

      user.badges = updatedBadges;
      user.streak = newStreak;
      user.lastTransactionDate = Date.now();
      await user.save();
    }

    res.status(201).json({ transaction: newTxn });
  } catch (err) {
    console.error("Add txn error:", err);
    res.status(400).json({ error: "Invalid data" });
  }
});

// UPDATE transaction (PUT and PATCH supported) — allows partial updates
const updateTransactionHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };

    // if date provided, convert to Date
    if (update.date) update.date = new Date(update.date);

    const updated = await Transaction.findOneAndUpdate(
      { _id: id, user: req.userId },
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Transaction not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update txn error:", err);
    if (err.name === "CastError") return res.status(400).json({ error: "Invalid transaction id" });
    res.status(400).json({ error: "Update failed", details: err.message });
  }
};
app.put("/api/transactions/:id", authMiddleware, updateTransactionHandler);
app.patch("/api/transactions/:id", authMiddleware, updateTransactionHandler);

// DELETE transaction
app.delete("/api/transactions/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deleted) return res.status(404).json({ error: "Transaction not found" });
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    console.error("Delete txn error:", err);
    if (err.name === "CastError") return res.status(400).json({ error: "Invalid transaction id" });
    res.status(500).json({ error: "Server error" });
  }
});

// ====== Voice Transaction Route (robust) ======
app.post("/api/voice-transaction", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    let type = /salary|income|credited/i.test(text) ? "income" : "expense";
    let category = "General";
    const amountMatch = text.match(/(?:₹|rs\.?|rupees?)?\s?(\d+)/i);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : null;

    if (/coffee/i.test(text)) category = "Coffee";
    else if (/rent/i.test(text)) category = "Rent";
    else if (/food|lunch|dinner/i.test(text)) category = "Food";
    else if (/bill|electricity|water/i.test(text)) category = "Bills";
    else if (/salary|income|credited/i.test(text)) category = "Salary";

    if (!amount) return res.status(400).json({ error: "Could not detect amount in voice" });

    const txn = await Transaction.create({
      user: req.userId,
      type,
      category,
      amount,
      date: new Date(),
      source: "voice",
    });

    res.status(201).json({ message: "Transaction added via voice", transaction: txn });
  } catch (err) {
    console.error("Voice transaction error:", err);
    res.status(500).json({ error: "Failed to add via voice" });
  }
});

// ====== Reminder Routes (create / read / update / delete) ======

// Create
app.post("/api/reminders", authMiddleware, async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    if (!title || !dueDate) return res.status(400).json({ error: "Title and dueDate required" });
    const reminder = await Reminder.create({ user: req.userId, title, dueDate: new Date(dueDate) });
    res.status(201).json(reminder);
  } catch (err) {
    console.error("Add reminder error:", err);
    res.status(500).json({ error: "Failed to add reminder" });
  }
});

// Read
app.get("/api/reminders", authMiddleware, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.userId }).sort({ dueDate: 1 });
    res.json(reminders);
  } catch (err) {
    console.error("Fetch reminders error:", err);
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
});

// Update
app.put("/api/reminders/:id", authMiddleware, async (req, res) => {
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
    console.error("Update reminder error:", err);
    if (err.name === "CastError") return res.status(400).json({ error: "Invalid reminder id" });
    res.status(500).json({ error: "Update failed" });
  }
});

// Delete
app.delete("/api/reminders/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deleted) return res.status(404).json({ error: "Reminder not found" });
    res.json({ message: "Reminder deleted" });
  } catch (err) {
    console.error("Delete reminder error:", err);
    if (err.name === "CastError") return res.status(400).json({ error: "Invalid reminder id" });
    res.status(500).json({ error: "Delete failed" });
  }
});

// ====== Start ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
