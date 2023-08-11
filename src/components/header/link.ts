import Param from "../../types/elementCreator/param";
import View from "../utils/view";

const cssClasses = {
  link: "link",
  itemSelected: "show",
};

export default class LinkView extends View {
  private linkElements;

  constructor(text: string, linkElements: LinkView[]) {
    const params: Param = {
      tag: "a",
      classNames: [`${cssClasses.link}`],
      textContent: text,
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
