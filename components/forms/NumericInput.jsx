import React from "react";

export function NumericInput({ label, value = "", onChange, min, max, step = 1 }) {
  return (
    <label className="numeric-input">
      <span>{label}</span>
      <input
        max={max}
        min={min}
        onChange={(event) => onChange?.(Number(event.target.value))}
        step={step}
        type="number"
        value={value}
      />
    </label>
  );
}

export default NumericInput;
