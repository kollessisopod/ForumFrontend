import React from "react";

export default function ErrorBanner({ message }) {
  return (
    <div className="error">
      <div className="error-title">Error</div>
      <div className="error-body">{message}</div>
    </div>
  );
}
