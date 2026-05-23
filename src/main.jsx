import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TinyWins from "./TinyWins.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div style={{ height: "100%" }}>
      <TinyWins />
    </div>
  </StrictMode>
);
