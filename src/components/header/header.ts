import Param from "../../types/elementCreator/param";
import ElementCreator from "../utils/elementCreator";
import View from "../utils/view";
import LinkView from "./link";
import {
  paramLogo,
  paramsNav,
  paramsProfileBlock,
  cssClasses,
  headerBlockParams,
  paramsNavUl,
  paramBurgerSpan,
  paramBurgerContainer,
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
    const creatorHeaderContainer = new ElementCreator(headerBlockParams);
    this.elementCreator.addInnerELement(creatorHeaderContainer);
    const creatorLogo = new ElementCreator(paramLogo);
    creatorHeaderContainer.addInnerELement(creatorLogo);
    const creatorBurger = new ElementCreator(paramBurgerContainer);
    creatorHeaderContainer.addInnerELement(creatorBurger);
    for (let i = 0; i < 4; i += 1) {
      const creatorBurgerSpan = new ElementCreator(paramBurgerSpan);
      creatorBurger.addInnerELement(creatorBurgerSpan);
    }
    const creatorNav = new ElementCreator(paramsNav);
    creatorHeaderContainer.addInnerELement(creatorNav);
    const creatorNavUl = new ElementCreator(paramsNavUl);
    creatorNav.addInnerELement(creatorNavUl);
    const creatorProfileBlock = new ElementCreator(paramsProfileBlock);
    creatorHeaderContainer.addInnerELement(creatorProfileBlock);

    pages.forEach((item, index) => {
      const linkElement = new LinkView(
        this.linkElements,
        item.name,
        undefined,
        undefined,
        item.href,
      );
      const newLink = linkElement.getHTMLElement();
      if (newLink) {
        creatorNavUl.addInnerELement(newLink);
        this.linkElements.push(linkElement);
        if (index === startPageIndex) {
          linkElement.setSelectedStatus();
        }
      }
    });

    profileLinks.forEach((item, index) => {
      const linkElement = new LinkView(
        this.linkElements,
        undefined,
        item.classList,
        item.innerHTML,
        item.href,
      );
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
