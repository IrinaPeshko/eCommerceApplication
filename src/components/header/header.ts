import "./header.scss";
import Param from "../../types/elementCreator/param";
import ElementCreator from "../utils/elementCreator";
import View from "../utils/view";
import LinkView from "./link";
import {
  paramLogo,
  paramsNav,
  paramsProfileBlock,
  cssClasses,
} from "./data/params";
import { profileLinks, pages } from "./data/linkArrays";
import img from "../../assets/icons/logo.png";

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
    const creatorLogo = new ElementCreator(paramLogo);
    this.elementCreator.addInnerELement(creatorLogo);
    const creatorNav = new ElementCreator(paramsNav);
    this.elementCreator.addInnerELement(creatorNav);
    const creatorProfileBlock = new ElementCreator(paramsProfileBlock);
    this.elementCreator.addInnerELement(creatorProfileBlock);

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

    profileLinks.forEach((item, index) => {
      const linkElement = new LinkView(item.name, this.linkElements);
      const newLink = linkElement.getHTMLElement();
      if (newLink) {
        creatorProfileBlock.addInnerELement(newLink);
        this.linkElements.push(linkElement);
        if (index === startPageIndex) {
          linkElement.setSelectedStatus();
        }
      }
    });

    creatorLogo.setInnerHTML(`<img src="${img}" alt="logo">`);
  }
}
