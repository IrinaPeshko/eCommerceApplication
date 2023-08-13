import "./style.scss";
import App from "./components/app/app";
import { route } from "./components/utils/router";

function initializeApp(): void {
  App.createView();
}

window.addEventListener("DOMContentLoaded", initializeApp);

declare global {
  interface Window {
    route: (e: MouseEvent) => void;
  }
}

window.route = route;
