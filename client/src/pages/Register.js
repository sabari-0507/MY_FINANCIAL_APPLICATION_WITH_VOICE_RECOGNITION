import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ import navigate

export default function AuthCard() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate(); // ✅ navigation hook

  // Login function
  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", res.data.token);
      setMsg("✅ Login successful!");
      setTimeout(() => navigate("/dashboard"), 1000); // ✅ redirect after 1s
    } catch (err) {
      setMsg("❌ Invalid credentials");
    }
  };

  // Register function
  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setMsg("✅ Registration successful! You can now log in.");
      setIsRegister(false);
    } catch (err) {
      setMsg("❌ Registration failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">{isRegister ? "Register" : "Login"}</h3>

        {isRegister && (
          <input
            type="text"
            placeholder="Name"
            className="form-control my-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="form-control my-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="form-control my-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          className="btn btn-primary w-100 mt-2"
          onClick={isRegister ? handleRegister : handleLogin}
        >
          {isRegister ? "Register" : "Login"}
        </button>

        <p className="text-center mt-3">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>

        {msg && <p className="text-center text-muted mt-2">{msg}</p>}
      </div>
    </div>
  );
}
