import "./style.scss";
import App from "./components/app/app";
import { handleLocation, route } from "./components/utils/router";

function initializeApp(): void {
  App.createView();
  handleLocation();
}

window.addEventListener("DOMContentLoaded", initializeApp);

declare global {
  interface Window {
    route: (e: MouseEvent) => void;
  }
}

window.route = route;
