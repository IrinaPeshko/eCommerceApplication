import Param from "../../types/elementCreator/param";
import View from "../utils/view";
import popapTemplate from "./template";

export default class Popap extends View {
  constructor() {
    const params: Param = {
      tag: "section",
      classNames: [`popap`],
      textContent: undefined,
      innerHTML: popapTemplate,
    };
    super(params);
  }

  // public showPopap(inner: string) {
  //   const innerBox = document.querySelector('.popap__content')
  //   if (innerBox instanceof HTMLElement && innerBox) innerBox.innerHTML = inner;
  //   const main = document.querySelector("main")
  // }
}