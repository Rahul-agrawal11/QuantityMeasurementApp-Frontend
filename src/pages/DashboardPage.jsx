import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TYPE_ICONS, TYPE_LABELS } from "../constants/units";
import "./DashboardPage.css";

const ACTIONS = [
  { icon: "🔄", label: "Convert", desc: "Convert a quantity to another unit", path: "/convert" },
  { icon: "⚖️", label: "Compare", desc: "Check if two quantities are equal", path: "/compare" },
  { icon: "➕", label: "Arithmetic", desc: "Add, subtract or divide quantities", path: "/arithmetic" },
  { icon: "📜", label: "History", desc: "Browse past operations", path: "/history" },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <div className="dash-hero">
        <h1 className="dash-greeting">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}! 👋
        </h1>
        <p className="dash-sub">What would you like to measure today?</p>
      </div>

      <div className="dash-actions">
        {ACTIONS.map(({ icon, label, desc, path }) => (
          <button key={path} className="action-card" onClick={() => navigate(path)}>
            <span className="action-icon">{icon}</span>
            <div>
              <div className="action-label">{label}</div>
              <div className="action-desc">{desc}</div>
            </div>
            <span className="action-arrow">→</span>
          </button>
        ))}
      </div>

      <div className="dash-types">
        <h2 className="section-title">Supported Measurement Types</h2>
        <div className="types-grid">
          {Object.entries(TYPE_LABELS).map(([key, label]) => (
            <div key={key} className="type-chip">
              <span>{TYPE_ICONS[key]}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;