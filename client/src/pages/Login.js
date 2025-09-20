import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginApi, registerApi } from "../services/api";
import { LanguageContext } from "../context/LanguageContext";

// MUI
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  InputAdornment,
} from "@mui/material";
import { Person, Email, Lock } from "@mui/icons-material";

export default function AuthCard() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    if (!isAuthenticated) {
      setForm({ name: "", email: "", password: "" });
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    try {
      const res = await loginApi(form.email, form.password);
      login(res.token, res.user);
      setMsg("✅ Login successful!");
      setTimeout(() => navigate("/"), 800);
    } catch {
      setMsg("❌ Invalid credentials");
    }
  };

  const handleRegister = async () => {
    try {
      await registerApi(form.name, form.email, form.password);
      setMsg("✅ Registration successful! You can now log in.");
      setIsRegister(false);
    } catch {
      setMsg("❌ Registration failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #667eea, #764ba2, #ff758c)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 15s ease infinite",
        "@keyframes gradientBG": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      {/* Floating glowing blobs */}
      <Box
        sx={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.15)",
          filter: "blur(120px)",
          top: "15%",
          left: "10%",
          animation: "float1 12s ease-in-out infinite",
          "@keyframes float1": {
            "0%,100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-40px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255, 200, 255, 0.2)",
          filter: "blur(150px)",
          bottom: "15%",
          right: "10%",
          animation: "float2 15s ease-in-out infinite",
          "@keyframes float2": {
            "0%,100%": { transform: "translateX(0)" },
            "50%": { transform: "translateX(-40px)" },
          },
        }}
      />

      {/* Auth Card */}
      <Card
        sx={{
          zIndex: 2,
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            {isRegister ? t.register : t.login}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {isRegister && (
            <TextField
              fullWidth
              margin="normal"
              label={t.name}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />
          )}

          <TextField
            fullWidth
            margin="normal"
            label={t.email}
            type="email"
            autoComplete="off"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label={t.password}
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, py: 1.5, fontWeight: "bold", borderRadius: 2 }}
            onClick={isRegister ? handleRegister : handleLogin}
          >
            {isRegister ? t.register : t.login}
          </Button>

          <Typography align="center" sx={{ mt: 3 }}>
            {isRegister ? "Already have an account?" : "Don’t have an account?"}{" "}
            <span
              style={{ color: "#1976d2", cursor: "pointer", fontWeight: "bold" }}
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? t.login : t.register}
            </span>
          </Typography>

          {msg && (
            <Typography
              align="center"
              sx={{ mt: 2, fontSize: "0.9rem" }}
              color={msg.includes("✅") ? "green" : "error"}
            >
              {msg}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

