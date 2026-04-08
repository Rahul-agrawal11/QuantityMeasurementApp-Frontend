import React, { useState } from "react";
import QuantityInput from "../components/quantity/QuantityInput";
import ResultCard from "../components/quantity/ResultCard";
import ErrorAlert from "../components/quantity/ErrorAlert";
import { useQuantity } from "../hooks/useQuantity";
import "./OperationPage.css";
import "./ArithmeticPage.css";

const OPS = [
  { key: "add", label: "Add", symbol: "+" },
  { key: "subtract", label: "Subtract", symbol: "−" },
  { key: "divide", label: "Divide", symbol: "÷" },
];

const defaultQ = (unit = "FEET") => ({ value: 0, measurementType: "LengthUnit", unit });

const ArithmeticPage = () => {
  const [op, setOp] = useState("add");
  const [thisQ, setThisQ] = useState(defaultQ("FEET"));
  const [thatQ, setThatQ] = useState(defaultQ("INCHES"));
  const [useTarget, setUseTarget] = useState(false);
  const [targetQ, setTargetQ] = useState(defaultQ("CENTIMETERS"));

  const { result, loading, error, add, addWithTarget, subtract, subtractWithTarget, divide } = useQuantity();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (op === "add") useTarget ? addWithTarget(thisQ, thatQ, targetQ) : add(thisQ, thatQ);
    else if (op === "subtract") useTarget ? subtractWithTarget(thisQ, thatQ, targetQ) : subtract(thisQ, thatQ);
    else divide(thisQ, thatQ);
  };

  const currentOp = OPS.find((o) => o.key === op);

  return (
    <div className="op-page">
      <div className="op-header">
        <span className="op-icon">🔢</span>
        <div>
          <h1 className="op-title">Arithmetic</h1>
          <p className="op-sub">Add, subtract, or divide quantities</p>
        </div>
      </div>

      {/* Operation selector */}
      <div className="op-tabs">
        {OPS.map(({ key, label, symbol }) => (
          <button
            key={key}
            className={`op-tab ${op === key ? "active" : ""}`}
            onClick={() => { setOp(key); setUseTarget(false); }}
            type="button"
          >
            <span className="tab-symbol">{symbol}</span> {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="op-form">
        <div className="op-inputs">
          <QuantityInput label="Quantity A" value={thisQ} onChange={setThisQ} />
          <div className="op-arrow">{currentOp.symbol}</div>
          <QuantityInput label="Quantity B" value={thatQ} onChange={setThatQ} />
        </div>

        {/* Target unit toggle (only for add/subtract) */}
        {op !== "divide" && (
          <div className="target-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={useTarget}
                onChange={(e) => setUseTarget(e.target.checked)}
              />
              <span>Specify result unit</span>
            </label>
            {useTarget && (
              <div className="target-input">
                <QuantityInput label="Result Unit" value={targetQ} onChange={setTargetQ} />
              </div>
            )}
          </div>
        )}

        <button type="submit" className="op-btn" disabled={loading}>
          {loading ? "Calculating..." : `${currentOp.label} →`}
        </button>
      </form>

      <ErrorAlert message={error} />
      <ResultCard result={result} />
    </div>
  );
};

export default ArithmeticPage;