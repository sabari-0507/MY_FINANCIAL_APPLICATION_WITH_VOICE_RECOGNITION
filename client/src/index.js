import React, { useState, createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Theme Context to toggle dark/light mode
export const ThemeContext = createContext();

function Root() {
  const [mode, setMode] = useState("light"); // light or dark

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = createTheme({
    palette: {
      mode: mode,
      primary: { main: "#1976d2" },
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Ensures global theme styles */}
        <App />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
