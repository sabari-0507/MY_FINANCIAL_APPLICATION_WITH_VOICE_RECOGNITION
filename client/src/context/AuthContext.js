import React, { createContext, useEffect, useMemo, useState } from "react";
import { apiClient } from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete apiClient.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser || null);
    if (nextUser) {
      localStorage.setItem("user", JSON.stringify(nextUser));
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = useMemo(() => ({ token, user, login, logout, isAuthenticated: Boolean(token) }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


