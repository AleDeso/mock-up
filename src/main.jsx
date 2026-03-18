import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DigiHORECA from "../digiHORECA.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DigiHORECA />
  </StrictMode>
);
