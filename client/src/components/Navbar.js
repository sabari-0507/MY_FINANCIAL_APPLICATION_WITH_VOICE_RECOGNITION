import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { LanguageContext } from "../context/LanguageContext";
import my from '../photos/hi.jpg'

function Navbar() {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const { lang, setLang, t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2, #ff758c)",
        padding: "12px 20px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      }}
    >
      <div className="container-fluid">
       
        {/* Logo / Brand */}
{/* Logo / Brand */}
<div
  style={{
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#fff", // pure white circle
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  }}
>
  <img
    src={my}
    alt="App Logo"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover", // ensures it fills the circle neatly
    }}
  />
</div>



        {/* Toggle button for mobile */}
        <button
          className="navbar-toggler text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link px-3 fw-semibold text-white hover-underline" to="/">
                {t.dashboard}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 fw-semibold text-white hover-underline" to="/transactions">
                {t.transactions}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 fw-semibold text-white hover-underline" to="/reports">
                {t.reports}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 fw-semibold text-white hover-underline" to="/settings">
                {t.settings}
              </Link>
            </li>

            {/* Language Dropdown */}
            <li className="nav-item dropdown">
              <button
                className="btn btn-sm btn-light rounded-pill ms-3 fw-semibold"
                onClick={() => setOpen(!open)}
              >
                🌐 {t.language}
              </button>
              {open && (
                <ul
                  className="dropdown-menu show shadow-sm border-0"
                  style={{
                    position: "absolute",
                    right: 0,
                    marginTop: "10px",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <li>
                    <button className="dropdown-item" onClick={() => { setLang("en"); setOpen(false); }}>English</button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => { setLang("ta"); setOpen(false); }}>Tamil</button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => { setLang("hi"); setOpen(false); }}>Hindi</button>
                  </li>
                </ul>
              )}
            </li>

            {!isAuthenticated ? (
              <li className="nav-item">
                <Link className="btn btn-outline-light ms-3 rounded-pill fw-semibold" to="/login">
                  {t.login}
                </Link>
              </li>
            ) : (
              <>
                {user && (
                  <li className="nav-item">
                    <span
                      className="badge bg-light text-dark ms-3"
                      style={{
                        borderRadius: "20px",
                        padding: "8px 14px",
                        fontSize: "0.9rem",
                      }}
                    >
                      {user.email}
                    </span>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    className="btn btn-danger ms-3 rounded-pill fw-semibold"
                    onClick={handleLogout}
                  >
                    {t.logout}
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
