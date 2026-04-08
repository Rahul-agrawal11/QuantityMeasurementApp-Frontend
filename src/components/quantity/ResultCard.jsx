import React from "react";
import "./ResultCard.css";

const ResultCard = ({ result }) => {
    // if (!result || result.isError) return null;
    if (!result) return null;

    if (result.isError) {
        return (
            <div className="result-card error">
                <div className="result-badge">Error</div>
                <div className="result-error">{result.errorMessage}</div>
            </div>
        );
    }

    // const isComparison = !!result.resultString && !result.resultValue;
    const isComparison = result.operation === "COMPARE";

    // 🔥 FIX HERE
    const isEqual = result.resultString
        ?.toLowerCase()
        .replace(/\s/g, "") === "equal";

    return (
        <div className="result-card">
            <div className="result-badge">Result</div>

            {isComparison ? (
                <div className="result-comparison">
                    <span className={`comparison-chip ${isEqual ? "equal" : "not-equal"}`}>
                        {isEqual ? "✓ EQUAL" : "✗ NOT EQUAL"}
                    </span>
                </div>
            ) : (
                <div className="result-value-block">
                    <span className="result-number">
                        {typeof result.resultValue === "number"
                            ? result.resultValue.toFixed(4)
                            : "—"}
                    </span>
                    <span className="result-unit">{result.resultUnit}</span>
                    <span className="result-type">
                        {result.resultMeasurementType?.replace("Unit", "")}
                    </span>
                </div>
            )}

            <div className="result-meta">
                <div className="meta-row">
                    <span className="meta-label">Operation</span>
                    <span className="meta-val op-chip">{result.operation}</span>
                </div>
                <div className="meta-row">
                    <span className="meta-label">Input A</span>
                    <span className="meta-val">{result.thisValue} {result.thisUnit}</span>
                </div>
                <div className="meta-row">
                    <span className="meta-label">Input B</span>
                    <span className="meta-val">{result.thatValue} {result.thatUnit}</span>
                </div>

                {result.resultString && !isComparison && (
                    <div className="meta-row">
                        <span className="meta-label">Summary</span>
                        <span className="meta-val">{result.resultString}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultCard;