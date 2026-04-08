import React, { useState } from "react";
import QuantityInput from "../components/quantity/QuantityInput";
import ResultCard from "../components/quantity/ResultCard";
import ErrorAlert from "../components/quantity/ErrorAlert";
import { useQuantity } from "../hooks/useQuantity";
import "./OperationPage.css";

const ComparePage = () => {
  const [thisQ, setThisQ] = useState({ value: 0, measurementType: "LengthUnit", unit: "FEET" });
  const [thatQ, setThatQ] = useState({ value: 0, measurementType: "LengthUnit", unit: "INCHES" });
  const { result, loading, error, compare } = useQuantity();

  const handleSubmit = (e) => {
    e.preventDefault();
    compare(thisQ, thatQ);
  };

  return (
    <div className="op-page">
      <div className="op-header">
        <span className="op-icon">⚖️</span>
        <div>
          <h1 className="op-title">Compare</h1>
          <p className="op-sub">Check whether two quantities are equal</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="op-form">
        <div className="op-inputs">
          <QuantityInput label="Quantity A" value={thisQ} onChange={setThisQ} />
          <div className="op-arrow">=?</div>
          <QuantityInput label="Quantity B" value={thatQ} onChange={setThatQ} />
        </div>

        <button type="submit" className="op-btn" disabled={loading}>
          {loading ? "Comparing..." : "Compare →"}
        </button>
      </form>

      <ErrorAlert message={error} />
      <ResultCard result={result} />
    </div>
  );
};

export default ComparePage;