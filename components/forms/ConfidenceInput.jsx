import React from "react";
import { SliderInput } from "./SliderInput";

export function ConfidenceInput({ value = 0.5, onChange }) {
  return (
    <SliderInput
      label="Confidence"
      max={1}
      min={0}
      onChange={onChange}
      step={0.01}
      value={value}
    />
  );
}

export default ConfidenceInput;
