import { getCustomers, getProjectDetails } from "./sdk/sdk";
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
getCustomers().then((response) => console.log(response));

getProjectDetails().then((response) => console.log(response));
