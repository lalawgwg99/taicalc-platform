import { StrictMode } from "react";
import { LocaleProvider } from "./i18n";
import App from "./App";
import "./styles.css";

export default function NestEggApp() {
  return (
    <StrictMode>
      <LocaleProvider>
        <div className="nestegg-app">
          <App />
        </div>
      </LocaleProvider>
    </StrictMode>
  );
}
