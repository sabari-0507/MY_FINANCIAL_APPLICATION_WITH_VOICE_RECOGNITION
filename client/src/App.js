import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { FinanceProvider } from "./context/FinanceContext";
import { LanguageProvider } from "./context/LanguageContext";

function PrivateRoute({ children }) {
  return (
    <AuthContext.Consumer>
      {({ isAuthenticated }) => (isAuthenticated ? children : <Navigate to="/login" replace />)}
    </AuthContext.Consumer>
  );
}

function AppShell() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  <Transactions />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <FinanceProvider>
          <Router>
            <AppShell />
          </Router>
        </FinanceProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
