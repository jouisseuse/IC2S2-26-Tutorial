import React from "react";

export function ExperimentLayout({ header, sidebar, children, footer }) {
  return (
    <div className="experiment-layout">
      {header && <header>{header}</header>}
      <div className="experiment-layout-body">
        {sidebar && <aside>{sidebar}</aside>}
        <main>{children}</main>
      </div>
      {footer && <footer>{footer}</footer>}
    </div>
  );
}

export default ExperimentLayout;
