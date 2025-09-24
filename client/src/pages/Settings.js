import React, { useContext, useEffect, useState } from "react";
import BackgroundWrapper from "./BackgroundWrapper";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Switch,
  Button,
  Alert,
  Grid,
} from "@mui/material";
import { FaUser, FaLock, FaBell } from "react-icons/fa";
import { ThemeContext } from "../index";
import { AuthContext } from "../context/AuthContext";
import { LanguageContext } from "../context/LanguageContext";
// Security card removed as requested; password update API no longer used

export default function Settings() {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
    emailAlerts: true,
    pushNotifications: false,
  });

  const [saved, setSaved] = useState(false);

  // Load user defaults and saved preferences
  useEffect(() => {
    const savedPrefs = JSON.parse(localStorage.getItem("prefs") || "{}");
    setForm((prev) => ({
      ...prev,
      name: user?.name || "",
      email: user?.email || "",
      emailAlerts: savedPrefs.emailAlerts ?? prev.emailAlerts,
      pushNotifications: savedPrefs.pushNotifications ?? prev.pushNotifications,
    }));
  }, [user]);

  const handleSave = async () => {
    try {
      // Save preferences in localStorage
      localStorage.setItem(
        "prefs",
        JSON.stringify({
          emailAlerts: form.emailAlerts,
          pushNotifications: form.pushNotifications,
        })
      );

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("❌ Failed to update settings");
    }
  };

  return (
    <BackgroundWrapper>
      <div
        className="d-flex flex-column align-items-center justify-content-start min-vh-100 py-5"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container bg-light bg-opacity-75 p-4 rounded-4 shadow-lg">
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            className="fw-bold text-primary text-uppercase mb-4"
          >
            ⚙️ {t.settingsTitle}
          </Typography>

          {saved && (
            <Alert severity="success" className="mb-3 rounded-3 shadow-sm">
              ✅ {t.changesSaved}
            </Alert>
          )}

          <Grid container spacing={3} justifyContent={"center"}>
            {/* Profile Settings */}
            <Grid item xs={12} md={6}>
              <Card className="shadow-lg border-0 rounded-4 card-hover">
                <CardContent>
                  <Typography
                    variant="h6"
                    className="fw-bold text-primary mb-2"
                  >
                    <FaUser className="me-2" /> {t.profile}
                  </Typography>
                  <Divider className="my-2" />
                  <input
                    type="text"
                    className="form-control my-2 rounded-3 shadow-sm"
                    placeholder={t.name}
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                  <input
                    type="email"
                    className="form-control my-2 rounded-3 shadow-sm"
                    placeholder={t.email}
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Security Settings removed as requested */}

            {/* Notifications & Appearance Settings */}
            <Grid item xs={12}>
              <Card className="shadow-lg border-0 rounded-4 card-hover">
                <CardContent>
                  <Typography
                    variant="h6"
                    className="fw-bold text-warning mb-2"
                  >
                    <FaBell className="me-2" /> {t.notifications}
                  </Typography>
                  <Divider className="my-2" />
                  <div className="d-flex justify-content-between align-items-center my-2">
                    <span className="fw-semibold">{t.emailAlerts}</span>
                    <Switch
                      checked={form.emailAlerts}
                      onChange={(e) =>
                        setForm({ ...form, emailAlerts: e.target.checked })
                      }
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center my-2">
                    <span className="fw-semibold">{t.pushNotifications}</span>
                    <Switch
                      checked={form.pushNotifications}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          pushNotifications: e.target.checked,
                        })
                      }
                    />
                  </div>
                  <Divider className="my-3" />
                  <Typography variant="h6" className="fw-bold mb-2">
                    {t.appearance}
                  </Typography>
                  <div className="d-flex justify-content-between align-items-center my-2">
                    <span>{t.darkMode}</span>
                    <Switch checked={mode === "dark"} onChange={toggleTheme} />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Save Button */}
          <div className="text-center mt-4">
            <Button
              variant="contained"
              className={`px-4 py-2 fw-bold rounded-3 ${
                saved ? "bg-success" : "bg-primary"
              }`}
              onClick={handleSave}
              style={{
                color: "white",
                fontSize: "1rem",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                transition: "background-color 0.3s ease-in-out",
              }}
            >
              💾 {saved ? t.saved : t.saveChanges}
            </Button>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
