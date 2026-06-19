import React from "react";

export function TextResponse({ label, value = "", onChange, rows = 4 }) {
  return (
    <label className="text-response">
      <span>{label}</span>
      <textarea onChange={(event) => onChange?.(event.target.value)} rows={rows} value={value} />
    </label>
  );
}

export default TextResponse;
