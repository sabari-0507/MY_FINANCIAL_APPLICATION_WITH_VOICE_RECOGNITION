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

app.get("/transactions", auth, async (req, res) => {
  const txns = await Transaction.find({ user: req.userId }).sort({ date: -1 });
  res.json(txns);
});

app.post("/transactions", auth, async (req, res) => {
  try {
    const payload = { ...req.body, user: req.userId, date: new Date(req.body.date || Date.now()) };
    const newTxn = await Transaction.create(payload);
    res.status(201).json({ transaction: newTxn });
  } catch (err) {
    res.status(400).json({ error: "Invalid data", details: err.message });
  }
});

app.put("/transactions/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };
    if (update.date) update.date = new Date(update.date);
    const updated = await Transaction.findOneAndUpdate(
      { _id: id, user: req.userId },
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Transaction not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Update failed", details: err.message });
  }
});

app.delete("/transactions/:id", auth, async (req, res) => {
  const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!deleted) return res.status(404).json({ error: "Transaction not found" });
  res.json({ message: "Transaction deleted" });
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`Transactions service on ${PORT}`));


