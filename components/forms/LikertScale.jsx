import React from "react";

export function LikertScale({ label, value, onChange, min = 1, max = 7 }) {
  const options = Array.from({ length: max - min + 1 }, (_, index) => min + index);
  return (
    <fieldset className="likert-scale">
      <legend>{label}</legend>
      {options.map((option) => (
        <label key={option}>
          <input
            checked={value === option}
            name={label}
            onChange={() => onChange?.(option)}
            type="radio"
            value={option}
          />
          {option}
        </label>
      ))}
    </fieldset>
  );
}

export default LikertScale;
