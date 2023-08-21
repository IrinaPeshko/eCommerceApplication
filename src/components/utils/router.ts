import Irouters from "../../types/routers/routers";
import Popap from "../popap/popap";
import showPassword from "./showPassword";

export const routers: Irouters = {
  "/": "pages/main.html",
  "/catalogg": "pages/catalog.html",
  "/aboutt": "pages/about.html",
  "/login": "pages/login.html",
  "/createaccount": "pages/createaccount.html",
  "/baskett": "pages/basket.html",
  "/404": "pages/404.html",
  "/profilee": "pages/profile.html",
};

export async function getNotFoundPage() {
  return fetch(routers["/404"])
    .then((page) => page.text())
    .catch(() => "404");
}

async function getHTML() {
  const path = window.location.pathname;
  const validPathes = Object.keys(routers);
  if (!validPathes.includes(path)) {
    return getNotFoundPage();
  }
  const data = await fetch(routers[path]);
  if (data.status === 200) {
    return data.text();
  }
  return getNotFoundPage();
}

export async function handleLocation(callback?: () => void): Promise<void> {
  const html = await getHTML();

  const main = document.querySelector(".main");
  if (main) {
    main.innerHTML = html;
    const popap = new Popap();
    const popapElement = popap.getHTMLElement();
    if (popapElement) main.append(popapElement);
    showPassword();
  }
  if (callback) {
    callback();
  }
}

(window as WindowEventHandlers).onpopstate = () => {
  handleLocation();
};

export const route = (e: MouseEvent): void => {
  const { currentTarget } = e;

  if (currentTarget instanceof HTMLAnchorElement) {
    window.history.pushState({}, "", currentTarget.href);
  }
  handleLocation();
};
