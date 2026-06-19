import React from "react";
import { createRoot } from "react-dom/client";
import "../node_modules/@empirica/core/dist/player.css";
import "../node_modules/@empirica/core/dist/player-classic-react.css";
import App from "./App";
import "./style.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

