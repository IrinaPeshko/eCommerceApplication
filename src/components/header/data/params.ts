import Param from "../../../types/elementCreator/param";

export const cssClasses = {
  header: "header",
  nav: "nav",
  logo: "logo",
  profileBlock: "profileBlock",
};

export const paramLogo: Param = {
  tag: "div",
  classNames: [`${cssClasses.logo}`],
};
export const paramsNav: Param = {
  tag: "nav",
  classNames: [`${cssClasses.nav}`],
};
export const paramsProfileBlock: Param = {
  tag: "div",
  classNames: [`${cssClasses.profileBlock}`],
};
