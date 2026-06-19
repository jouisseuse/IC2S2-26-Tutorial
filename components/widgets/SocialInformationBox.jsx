import React from "react";

export function SocialInformationBox({ title = "Social information", items = [] }) {
  return (
    <aside className="social-information-box">
      <h2>{title}</h2>
      <dl>
        {items.map((item) => (
          <React.Fragment key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </React.Fragment>
        ))}
      </dl>
    </aside>
  );
}

export default SocialInformationBox;
