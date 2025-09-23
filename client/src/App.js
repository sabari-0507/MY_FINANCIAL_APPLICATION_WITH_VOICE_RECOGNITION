import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { FinanceProvider } from "./context/FinanceContext";
import { LanguageProvider } from "./context/LanguageContext";

// Private route wrapper
function PrivateRoute({ children }) {
  return (
    <AuthContext.Consumer>
      {({ isAuthenticated }) =>
        isAuthenticated ? children : <Navigate to="/login" replace />
      }
    </AuthContext.Consumer>
  );
}

// Public route wrapper (redirect to dashboard if already logged in)
function PublicRoute({ children }) {
  return (
    <AuthContext.Consumer>
      {({ isAuthenticated }) =>
        isAuthenticated ? <Navigate to="/dashboard" replace /> : children
      }
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
        {/* Default route goes to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
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

        {/* Public route (login) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
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
