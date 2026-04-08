import React from "react";
import "./HistoryTable.css";

const HistoryTable = ({ records }) => {
  if (!records || records.length === 0) {
    return <div className="history-empty">No records found.</div>;
  }

  return (
    <div className="history-table-wrap">
      <table className="history-table">
        <thead>
          <tr>
            <th>Operation</th>
            <th>Input A</th>
            <th>Input B</th>
            <th>Result</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i} className={r.error ? "row-error" : ""}>
              <td><span className="op-badge">{r.operation}</span></td>
              <td>{r.thisValue} {r.thisUnit}</td>
              <td>{r.thatValue} {r.thatUnit}</td>
              <td>
                {r.error
                  ? <span className="err-text">{r.errorMessage}</span>
                  : r.resultString
                  ? r.resultString
                  : `${r.resultValue?.toFixed(4)} ${r.resultUnit}`}
              </td>
              <td>
                <span className={`status-dot ${r.error ? "err" : "ok"}`}>
                  {r.error ? "Error" : "OK"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;