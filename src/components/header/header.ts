import Param from "../../types/elementCreator/param";
import link from "../../types/link/Ilink";
import ElementCreator from "../utils/elementCreator";
import View from "../utils/view";
import LinkView from "./link";

const cssClasses = {
  header: "header",
  nav: "nav",
};

const namePage = {
  MAIN: "Main",
  LOGIN: "Login",
  CATALOG: "Catalog",
  USER: "User",
  BASKET: "Basket",
  ABOUT: "About Us",
};

const startPageIndex = 0;
export default class HeaderView extends View {
  public linkElements: LinkView[];

  constructor() {
    const params: Param = {
      tag: "header",
      classNames: [`${cssClasses.header}`],
    };
    super(params);
    this.linkElements = [];
    this.configureView();
  }

  // eslint-disable-next-line max-lines-per-function
  private configureView(): void {
    const paramsNav: Param = {
      tag: "nav",
      classNames: [`${cssClasses.nav}`],
    };

    const creatorNav = new ElementCreator(paramsNav);
    this.elementCreator.addInnerELement(creatorNav);

    const pages: link[] = [
      {
        name: namePage.MAIN,
        callback: (): void => {},
      },
      {
        name: namePage.LOGIN,
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
        name: namePage.BASKET,
        callback: (): void => {},
      },
      {
        name: namePage.USER,
        callback: (): void => {},
      },
    ];
    pages.forEach((item, index) => {
      const linkElement = new LinkView(item.name, this.linkElements);
      const newLink = linkElement.getHTMLElement();
      if (newLink) {
        creatorNav.addInnerELement(newLink);
        this.linkElements.push(linkElement);
        if (index === startPageIndex) {
          linkElement.setSelectedStatus();
        }
      }
    });
  }
}
