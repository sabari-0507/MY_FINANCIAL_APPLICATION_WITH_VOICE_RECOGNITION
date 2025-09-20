import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { addTransaction as addTxnApi, deleteTransaction as deleteTxnApi, getTransactions as getTxnsApi, updateTransaction as updateTxnApi } from "../services/api";

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const { token } = useContext(AuthContext);

  // Fetch all transactions
  useEffect(() => {
    if (!token) {
      setTransactions([]);
      return;
    }
    const fetchData = async () => {
      try {
        const data = await getTxnsApi();
        setTransactions(data);
      } catch (err) {
        console.error("❌ Error fetching transactions:", err);
      }
    };
    fetchData();
  }, [token]);

  // Add a transaction
  const addTransaction = async (txn) => {
    try {
      const created = await addTxnApi(txn);
      setTransactions((prev) => [created, ...prev]);
    } catch (err) {
      console.error("❌ Error adding transaction:", err);
    }
  };

  // Update a transaction
  const updateTransaction = async (id, updatedTxn) => {
    try {
      const updated = await updateTxnApi(id, updatedTxn);
      setTransactions((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      console.error("❌ Error updating transaction:", err.response?.data || err);
    }
  };

  // Delete a transaction
  const deleteTransaction = async (id) => {
    try {
      await deleteTxnApi(id);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("❌ Error deleting transaction:", err);
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction, // ✅ consistent name
        deleteTransaction,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
