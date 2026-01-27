import React from "react";

export default function Loading({ label = "Loading" }) {
  return (
    <div className="loading">
      <div className="spinner" aria-hidden="true" />
      <div className="muted">{label}</div>
    </div>
  );
}
