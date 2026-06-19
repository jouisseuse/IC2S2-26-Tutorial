import React from "react";

export function GroupStatus({ connected = 0, required = 0, submitted = 0 }) {
  return (
    <section className="group-status">
      <p>
        Connected: {connected} / {required}
      </p>
      <p>
        Submitted: {submitted} / {required}
      </p>
    </section>
  );
}

export default GroupStatus;
