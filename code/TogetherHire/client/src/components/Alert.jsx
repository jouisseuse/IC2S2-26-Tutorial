import React from "react";

const stylesByKind = {
  normal: {
    bg: "bg-empirica-50",
    icon: "text-empirica-400",
    title: "text-empirica-800",
    body: "text-empirica-700",
  },
  warn: {
    bg: "bg-yellow-50",
    icon: "text-yellow-400",
    title: "text-yellow-800",
    body: "text-yellow-700",
  },
  error: {
    bg: "bg-red-50",
    icon: "text-red-400",
    title: "text-red-800",
    body: "text-red-700",
  },
  success: {
    bg: "bg-green-50",
    icon: "text-green-400",
    title: "text-green-800",
    body: "text-green-700",
  },
};

export function Alert({ children, title, kind = "normal" }) {
  const styles = stylesByKind[kind] || stylesByKind.normal;

  return (
    <div className={`rounded-md p-4 ${styles.bg}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className={`h-5 w-5 ${styles.icon}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${styles.title}`}>{title}</h3>
          <div className={`mt-2 text-sm ${styles.body}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}
