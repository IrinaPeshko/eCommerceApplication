import Irouters from "../../types/routers/routers";
import Popap from "../popap/popap";
import Aside from "../aside/aside";
import showPassword from "./showPassword";

export const routers: Irouters = {
  "/": "pages/main.html",
  "/catalog": "pages/catalog.html",
  "/aboutt": "pages/about.html",
  "/login": "pages/login.html",
  "/createaccount": "pages/createaccount.html",
  "/baskett": "pages/basket.html",
  "/404": "pages/404.html",
  "/profile": "pages/profile.html",
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
  try {
    const html = await getHTML();
    const main = document.querySelector(".main");
    if (main) {
      main.innerHTML = html;
      const popap = new Popap();
      const popapElement = popap.getHTMLElement();
      const aside = new Aside();
      const asideElem = aside.getHTMLElement();
      if (popapElement) main.append(popapElement);
      if (asideElem) main.append(asideElem);
      showPassword();
    }

    if (callback) {
      callback();
    }
  } catch (error) {
    console.error("Произошла ошибка при выполнении handleLocation:", error);
  }
}

(window as WindowEventHandlers).onpopstate = () => {
  handleLocation();
};

export const route = (
  e: MouseEvent,
  callback?: ((params?: MouseEvent) => void) | undefined,
): void => {
  const { currentTarget } = e;

  if (currentTarget instanceof HTMLAnchorElement) {
    window.history.pushState({}, "", currentTarget.href);
  }
  if (callback) {
    handleLocation(callback);
  } else {
    handleLocation(callback);
  }
};

export const routeforOtherLink = (e: MouseEvent): void => {
  const { target } = e;

  if (target instanceof HTMLAnchorElement) {
    window.history.pushState({}, "", target.href);
  }
  handleLocation();
};

export const routeToNotAnchor = (e: MouseEvent, href: string): void => {
  const { target } = e;

  if (target) {
    window.history.pushState({}, "", href);
  }
  handleLocation();
};
