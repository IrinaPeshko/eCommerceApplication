import Irouters from "../../types/routers/routers";

export const routers: Irouters = {
  "/": "pages/main.html",
  "/catalog": "pages/catalog.html",
  "/about": "pages/about.html",
  "/login": "pages/login.html",
  "/createaccount": "pages/createaccount.html",
  "/basket": "pages/basket.html",
};

export async function handleLocation(): Promise<void> {
  const path = window.location.pathname;
  const html = await fetch(routers[path]).then((data) => data.text());
  const main = document.querySelector(".main");
  if (main) {
    main.innerHTML = html;
  }
}

window.onpopstate = handleLocation;

export const route = (e: MouseEvent): void => {
  const { currentTarget } = e;

  if (currentTarget instanceof HTMLAnchorElement) {
    window.history.pushState({}, "", currentTarget.href);
  }
  handleLocation();
};
