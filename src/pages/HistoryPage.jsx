import React, { useState, useEffect } from "react";
import HistoryTable from "../components/history/HistoryTable";
import {
  getOperationHistoryApi,
  getHistoryByTypeApi,
  getErroredHistoryApi,
} from "../api/quantityApi";
import { MEASUREMENT_TYPES } from "../constants/units";
import "./HistoryPage.css";

const OPERATIONS = ["compare", "convert", "add", "subtract", "divide"];

const FILTER_MODES = [
  { key: "operation", label: "By Operation" },
  { key: "type", label: "By Type" },
  { key: "errored", label: "Errors Only" },
];

const HistoryPage = () => {
  const [mode, setMode] = useState("operation");
  const [selectedOp, setSelectedOp] = useState("compare");
  const [selectedType, setSelectedType] = useState("LengthUnit");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    try {
      let data;
      if (mode === "operation") data = await getOperationHistoryApi(selectedOp);
      else if (mode === "type") data = await getHistoryByTypeApi(selectedType);
      else data = await getErroredHistoryApi();
      setRecords(data);
    } catch (err) {
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [mode, selectedOp, selectedType]);

  return (
    <div className="history-page">
      <div className="history-header">
        <span className="op-icon">📜</span>
        <div>
          <h1 className="op-title">History</h1>
          <p className="op-sub">Browse past measurement operations</p>
        </div>
      </div>

      <div className="history-filters">
        <div className="filter-modes">
          {FILTER_MODES.map(({ key, label }) => (
            <button
              key={key}
              className={`filter-mode-btn ${mode === key ? "active" : ""}`}
              onClick={() => setMode(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "operation" && (
          <div className="filter-selects">
            <select
              className="filter-select"
              value={selectedOp}
              onChange={(e) => setSelectedOp(e.target.value)}
            >
              {OPERATIONS.map((op) => (
                <option key={op} value={op}>{op.toUpperCase()}</option>
              ))}
            </select>
          </div>
        )}

        {mode === "type" && (
          <div className="filter-selects">
            <select
              className="filter-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {MEASUREMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && <div className="history-error">{error}</div>}

      {loading ? (
        <div className="history-loading">Loading...</div>
      ) : (
        <HistoryTable records={records} />
      )}
    </div>
  );
};

export default HistoryPage;