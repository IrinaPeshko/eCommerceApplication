import Param from "../../types/elementCreator/param";
import ElementCreator from "../utils/elementCreator";

const cssClasses = {
  footer: "footer",
};

const TEXT = "SPA FOOTER";

export default class Footer {
  public elementCreator: ElementCreator;

  constructor() {
    this.elementCreator = Footer.createView();
  }

  public getHTMLElement(): HTMLElement | null {
    return this.elementCreator.getElement();
  }

  public static createView(): ElementCreator {
    const params: Param = {
      tag: "footer",
      classNames: [`${cssClasses.footer}`],
      textContent: TEXT,
    };
    const elementCreator = new ElementCreator(params);
    return elementCreator;
  }
}
