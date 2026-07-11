import React from "react";

const base =
  "inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-empirica-500";
const primaryStyle = "shadow-sm text-gray-700 hover:bg-gray-50";
const secondaryStyle = "shadow-sm text-white";

export function Button({
  children,
  handleClick = null,
  className = "",
  primary = false,
  type = "button",
  autoFocus = false,
}) {
  return (
    <button
      type={type}
      onClick={handleClick}
      className={`${base} ${className} ${primary ? primaryStyle : secondaryStyle}`}
      autoFocus={autoFocus}
    >
      {children}
    </button>
  );
}
