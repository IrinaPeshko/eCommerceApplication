import link from "../../../types/link/Ilink";

const namePage = {
  MAIN: "MAIN",
  LOGIN: "LOG IN",
  LOGOUT: "SIGN UP",
  CATALOG: "CATALOG",
  USER: "USER",
  BASKET: "BASKET",
  ABOUT: "ABOUT US",
};

export const profileLinks: link[] = [
  {
    name: namePage.LOGIN,
    callback: (): void => {},
  },
  {
    name: namePage.LOGOUT,
    callback: (): void => {},
  },
  {
    name: namePage.BASKET,
    callback: (): void => {},
  },
];

export const pages: link[] = [
  {
    name: namePage.MAIN,
    callback: (): void => {},
  },
  {
    name: namePage.ABOUT,
    callback: (): void => {},
  },
  {
    name: namePage.CATALOG,
    callback: (): void => {},
  },
  {
    name: namePage.USER,
    callback: (): void => {},
  },
];
