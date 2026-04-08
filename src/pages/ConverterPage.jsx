import React, { useState } from "react";
import QuantityInput from "../components/quantity/QuantityInput";
import ResultCard from "../components/quantity/ResultCard";
import ErrorAlert from "../components/quantity/ErrorAlert";
import { useQuantity } from "../hooks/useQuantity";
import "./OperationPage.css";

const defaultQ = (type = "LengthUnit", unit = "FEET") => ({
  value: 0,
  measurementType: type,
  unit,
});

const ConverterPage = () => {
  const [thisQ, setThisQ] = useState(defaultQ());
  const [thatQ, setThatQ] = useState({ value: 0, measurementType: "LengthUnit", unit: "INCHES" });
  const { result, loading, error, convert } = useQuantity();

  const handleSubmit = (e) => {
    e.preventDefault();
    convert(thisQ, { ...thatQ, value: 0 }); // Ensure target value is 0 for conversion
  };

  return (
    <div className="op-page">
      <div className="op-header">
        <span className="op-icon">🔄</span>
        <div>
          <h1 className="op-title">Convert</h1>
          <p className="op-sub">Convert a quantity from one unit to another</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="op-form">
        <div className="op-inputs">
          <QuantityInput label="From" value={thisQ} onChange={setThisQ} />
          <div className="op-arrow">→</div>
          <QuantityInput label="To Unit" value={thatQ} onChange={setThatQ} hideValue/>
        </div>

        {/* <p className="op-hint">
          Tip: Set the <strong>value</strong> of the target unit to <strong>0</strong> — only its unit matters for conversion.
        </p> */}

        <button type="submit" className="op-btn" disabled={loading}>
          {loading ? "Converting..." : "Convert →"}
        </button>
      </form>

      <ErrorAlert message={error} />
      <ResultCard result={result} />
    </div>
  );
};

export default ConverterPage;