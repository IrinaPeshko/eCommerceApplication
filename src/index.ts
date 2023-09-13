import "./style.scss";
import {
  ApiRoot,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";
import App from "./components/app/app";
import { handleLocation, route } from "./components/utils/router";
import {
  profileLinks,
  pages,
  product,
  profileLinksOut,
} from "./components/header/data/linkArrays";
import "swiper/css/bundle";
import {
  createAnonimusCart,
  createCartWithToken,
  getAllCarts,
} from "./sdk/sdk";
// import { creatCard } from "./components/pages/catalog/createCard";
import { MyTokenCache } from "./sdk/token/TokenCache";
import {
  createAnonimusClient,
  createAnonimusFlow,
} from "./sdk/createPasswordClient";

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

export async function createCart() {
  if (localStorage.getItem("token") || localStorage.getItem("anonimToken")) {
    createCartWithToken().then((res) => console.log(res));
  } else {
    const tokenCache = new MyTokenCache();
    const anonimClientAPI = createAnonimusFlow(tokenCache);
    const anonimClient = createAnonimusClient(anonimClientAPI);
    const apiRoot: ApiRoot = createApiBuilderFromCtpClient(anonimClient);
    const res = await createAnonimusCart(apiRoot);
    if (res.statusCode !== 400) {
      const { token } = tokenCache.get();
      localStorage.setItem("anonimToken", token);
    }
    console.log(res);
  }
}

// createCart();

// getCarts().then((res) => console.log(res));

getAllCarts().then((res) => console.log(res));
