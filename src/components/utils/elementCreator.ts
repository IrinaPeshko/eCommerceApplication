import Param from "../../types/elementCreator/param";

export default class ElementCreator {
  private element: HTMLElement | null;

  constructor(param: Param) {
    this.element = null;
    this.createElement(param);
  }

  public createElement(param: Param): void {
    this.element = document.createElement(param.tag);
    this.setCssClasses(param.classNames);
    this.setTextContent(param.textContent);
    if (param.callback) {
      this.setCallback(param.callback);
    }
  }

  public getElement(): HTMLElement | null {
    return this.element;
  }

  public setCssClasses(cssClasses: string[]): void {
    cssClasses.forEach((className) => {
      this.element?.classList.add(className);
    });
  }

  public setTextContent(text: string): void {
    if (this.element) {
      this.element.textContent = text;
    }
  }

  public setCallback(callback: (params: MouseEvent) => void): void {
    this.element?.addEventListener("click", (event: MouseEvent) => {
      callback(event);
    });
  }
}
