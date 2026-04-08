import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/convert", label: "Convert" },
  { to: "/compare", label: "Compare" },
  { to: "/arithmetic", label: "Arithmetic" },
  { to: "/history", label: "History" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">⚗️</span>
        <span className="brand-name">QuantaMeasure</span>
      </div>
      <ul className="navbar-links">
        {NAV_LINKS.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="navbar-user">
        <span className="user-email">{user?.email}</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;