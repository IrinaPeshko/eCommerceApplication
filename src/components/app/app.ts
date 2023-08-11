import FooterView from "../footer/footer";
import HeaderView from "../header/header";
import MainView from "../main/main";

export default class App {
  public static createView(): void {
    const footerView = new FooterView();
    const headerView = new HeaderView();
    const mainView = new MainView();

    const footerElement = footerView.getHTMLElement();
    const headerElement = headerView.getHTMLElement();
    const mainElement = mainView.getHTMLElement();

    if (footerElement && headerElement && mainElement) {
      document.body.append(headerElement, mainElement, footerElement);
    } else {
      throw new Error("Element is null.");
    }
  }
}
