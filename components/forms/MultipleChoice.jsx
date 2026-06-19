import React from "react";

export function MultipleChoice({ label, options = [], value, onChange }) {
  return (
    <fieldset className="multiple-choice">
      <legend>{label}</legend>
      {options.map((option) => {
        const optionValue = typeof option === "string" ? option : option.value;
        const optionLabel = typeof option === "string" ? option : option.label;
        return (
          <label key={optionValue}>
            <input
              checked={value === optionValue}
              name={label}
              onChange={() => onChange?.(optionValue)}
              type="radio"
              value={optionValue}
            />
            {optionLabel}
          </label>
        );
      })}
    </fieldset>
  );
}

export default MultipleChoice;
