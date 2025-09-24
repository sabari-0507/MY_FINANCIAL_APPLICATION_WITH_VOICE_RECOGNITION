import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "*").split(",").map((s) => s.trim());
app.use(cors({ origin: (origin, cb) => cb(null, ALLOWED_ORIGINS.includes("*") || ALLOWED_ORIGINS.includes(origin)), credentials: true }));

// Upstream services
const AUTH_URL = process.env.AUTH_SERVICE_URL || "http://localhost:4001";
const TXN_URL = process.env.TXN_SERVICE_URL || "http://localhost:4002";
const REM_URL = process.env.REM_SERVICE_URL || "http://localhost:4003";

// Simple health
app.get("/health", (req, res) => res.json({ ok: true }));

// Proxies
app.use(
  "/api/auth",
  createProxyMiddleware({ target: AUTH_URL, changeOrigin: true, pathRewrite: { "^/api/auth": "/auth" } })
);
app.use(
  "/api/transactions",
  createProxyMiddleware({ target: TXN_URL, changeOrigin: true, pathRewrite: { "^/api/transactions": "/transactions" } })
);
app.use(
  "/api/reminders",
  createProxyMiddleware({ target: REM_URL, changeOrigin: true, pathRewrite: { "^/api/reminders": "/reminders" } })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Gateway running on ${PORT}`));


