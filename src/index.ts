import "./style.scss";
import App from "./components/app/app";
import { handleLocation, route } from "./components/utils/router";
import {
  profileLinks,
  pages,
  product,
  profileLinksOut,
} from "./components/header/data/linkArrays";
import "swiper/css/bundle";
// import { getAllCarts, getCarts } from "./sdk/sdk";

function initializeApp(): void {
  App.createView();
  const currentPath = window.location.pathname;
  const currentLink = [
    ...profileLinks,
    ...profileLinksOut,
    ...pages,
    ...product,
  ].find((link) => link.href === currentPath);
  if (currentLink) {
    handleLocation(currentLink.callback);
  } else {
    handleLocation();
  }
}

window.addEventListener("DOMContentLoaded", initializeApp);

declare global {
  interface Window {
    route: (e: MouseEvent) => void;
  }
}

window.route = route;
// getCarts().then((res)=>console.log(res))
// getAllCarts().then((res)=>console.log(res))
