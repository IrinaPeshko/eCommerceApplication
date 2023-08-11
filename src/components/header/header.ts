import Param from "../../types/elementCreator/param";
import ElementCreator from "../utils/elementCreator";
import View from "../utils/view";

const cssClasses = {
  header: "header",
  nav: "nav",
};

export default class HeaderView extends View {
  constructor() {
    const params: Param = {
      tag: "header",
      classNames: [`${cssClasses.header}`],
    };
    super(params);
    this.configureView();
  }

  private configureView(): void {
    const paramsNav: Param = {
      tag: "nav",
      classNames: [`${cssClasses.nav}`],
      textContent: "nav",
    };
    const creatorNav = new ElementCreator(paramsNav);
    this.elementCreator.addInnerELement(creatorNav);
  }
}
