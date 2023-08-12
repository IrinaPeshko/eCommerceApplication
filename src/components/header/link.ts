import Param from "../../types/elementCreator/param";
import View from "../utils/view";

const cssClasses = {
  link: "pages__item",
  itemSelected: "show",
};

export default class LinkView extends View {
  private linkElements;

  constructor(
    linkElements: LinkView[],
    text?: string,
    classList: string[] = ["pages__item"],
    innerHTML?: string,
  ) {
    const params: Param = {
      tag: "a",
      classNames: classList,
      textContent: text,
      innerHTML,
    };
    super(params);
    this.linkElements = linkElements;
    this.configureView();
  }

  public setSelectedStatus(): void {
    this.linkElements.forEach((linkElement) =>
      linkElement.setNotSelectedStatus(),
    );
    const element = this.elementCreator.getElement();
    element?.classList.add(cssClasses.itemSelected);
  }

  public setNotSelectedStatus(): void {
    const element = this.elementCreator.getElement();
    element?.classList.remove(cssClasses.itemSelected);
  }

  private configureView(): void {
    const element = this.elementCreator.getElement();
    element?.addEventListener("click", this.setSelectedStatus.bind(this));
  }
}
