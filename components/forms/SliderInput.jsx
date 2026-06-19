import React from "react";

export function SliderInput({ label, value = 0, onChange, min = 0, max = 100, step = 1 }) {
  return (
    <label className="slider-input">
      <span>
        {label}: {value}
      </span>
      <input
        max={max}
        min={min}
        onChange={(event) => onChange?.(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </label>
  );
}

export default SliderInput;
