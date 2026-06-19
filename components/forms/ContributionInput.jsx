import React from "react";
import { NumericInput } from "./NumericInput";

export function ContributionInput({ endowment = 10, value = 0, onChange }) {
  return (
    <NumericInput
      label={`Contribution (0-${endowment})`}
      max={endowment}
      min={0}
      onChange={onChange}
      step={1}
      value={value}
    />
  );
}

export default ContributionInput;
