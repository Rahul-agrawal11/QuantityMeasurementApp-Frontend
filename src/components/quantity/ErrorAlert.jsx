import React from "react";
import "./ErrorAlert.css";

const ErrorAlert = ({ message }) => {
  if (!message) return null;
  return (
    <div className="error-alert">
      <span className="error-icon">⚠️</span>
      <span>{message}</span>
    </div>
  );
};

export default ErrorAlert;