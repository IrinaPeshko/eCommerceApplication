import Param from "../../types/elementCreator/param";
import ElementCreator from "../utils/elementCreator";

const cssClasses = {
  footer: "footer",
};

const TEXT = "SPA FOOTER";

export default class Footer {
  elementCreator: ElementCreator;
  constructor() {
    this.elementCreator = this.createView();
  }
  getHTMLElement() {
    return this.elementCreator.getElement();
  }
  createView() {
    const params: Param = {
      tag: "footer",
      classNames: [`${cssClasses.footer}`],
      textContent: TEXT,
    };
    const elementCreator = new ElementCreator(params);
    return elementCreator;
  }
}
