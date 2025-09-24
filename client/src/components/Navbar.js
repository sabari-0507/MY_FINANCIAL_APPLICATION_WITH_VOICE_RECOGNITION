import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { LanguageContext } from "../context/LanguageContext";
import my from "../photos/hi.jpg";

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
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2, #ff758c)",
        padding: "12px 20px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      }}
    >
      <div className="container-fluid">
        {/* Logo / Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              marginRight: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <img
              src={my}
              alt="App Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <span className="fw-bold text-white">My App</span>
        </Link>

        {/* Mobile toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link px-3 fw-semibold text-white" to="/">
                {t.dashboard}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link px-3 fw-semibold text-white"
                to="/transactions"
              >
                {t.transactions}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link px-3 fw-semibold text-white"
                to="/reports"
              >
                {t.reports}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link px-3 fw-semibold text-white"
                to="/settings"
              >
                {t.settings}
              </Link>
            </li>

            {/* Language Dropdown */}
            <li className="nav-item dropdown">
              <button
                className="btn btn-sm btn-light rounded-pill ms-lg-3 fw-semibold dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                🌐 {t.language}
              </button>
              <ul className="dropdown-menu shadow-sm border-0">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setLang("en")}
                  >
                    English
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setLang("ta")}
                  >
                    Tamil
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setLang("hi")}
                  >
                    Hindi
                  </button>
                </li>
              </ul>
            </li>

            {/* Auth Section */}
            {!isAuthenticated ? (
              <li className="nav-item mt-2 mt-lg-0">
                <Link
                  className="btn btn-outline-light ms-lg-3 rounded-pill fw-semibold"
                  to="/login"
                >
                  {t.login}
                </Link>
              </li>
            ) : (
              <>
                {user && (
                  <li className="nav-item mt-2 mt-lg-0">
                    <span
                      className="badge bg-light text-dark ms-lg-3"
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
                <li className="nav-item mt-2 mt-lg-0">
                  <button
                    className="btn btn-danger ms-lg-3 rounded-pill fw-semibold"
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
