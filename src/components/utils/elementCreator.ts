import Param from "../../types/elementCreator/param";

export default class ElementCreator {
  private element: HTMLElement | null;
  constructor(param: Param) {
    this.element = null;
    this.createElement(param);
  }
  createElement(param: Param) {
    this.element = document.createElement(param.tag);
    this.setCssClasses(param.classNames);
    this.setTextContent(param.textContent);
    if (param.callback)
    {
      this.setCallback(param.callback);
    }
  }
  getElement() {
    return this.element;
  }
  setCssClasses(cssClasses: string[]) {
    cssClasses.forEach((className) => {
      this.element?.classList.add(className);
    });
  }
  setTextContent(text: string) {
    if (this.element){
      this.element.textContent = text;
    }
  }
  setCallback(callback: (params: MouseEvent) => void) {
    this.element?.addEventListener("click", (event: MouseEvent) => {
      callback(event);
    });
  }
}
