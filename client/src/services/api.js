// services/api.js
import axios from "axios";

export const BASE = process.env.REACT_APP_API_BASE || "https://my-financial-application-with-voice-01oy.onrender.com";
const API = `/api/transactions`;

// Shared API client (headers managed by AuthContext)
export const apiClient = axios.create({ baseURL: BASE });

// Always attach the freshest token from localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers && config.headers.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});


// ================== Transactions ==================

// Fetch all transactions
export const getTransactions = async () => {
  try {
    const res = await apiClient.get(API);
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching transactions:", err.response?.data || err);
    throw err;
  }
};

// Add new transaction
export const addTransaction = async (txn) => {
  try {
    const res = await apiClient.post(API, txn);
    return res.data;
  } catch (err) {
    console.error("❌ Error adding transaction:", err.response?.data || err);
    throw err;
  }
};

// Delete transaction
export const deleteTransaction = async (id) => {
  try {
    const res = await apiClient.delete(`${API}/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Error deleting transaction:", err.response?.data || err);
    throw err;
  }
};

// Update transaction
export const updateTransaction = async (id, txn) => {
  try {
    const res = await apiClient.put(`${API}/${id}`, txn);
    return res.data;
  } catch (err) {
    console.error("❌ Error updating transaction:", err.response?.data || err);
    throw err;
  }
};


// ================== Auth ==================

// Login
export const loginApi = async (email, password) => {
  const res = await apiClient.post(`/api/auth/login`, { email, password });
  return res.data;
};

// Register
export const registerApi = async (name, email, password) => {
  const res = await apiClient.post(`/api/auth/register`, { name, email, password });
  return res.data;
};

// ✅ FIX: Update password
export const updatePasswordApi = async (userId, password) => {
  try {
    const res = await apiClient.put(`/api/users/${userId}/password`, { password });
    return res.data;
  } catch (err) {
    console.error("❌ Error updating password:", err.response?.data || err);
    throw err;
  }
};
