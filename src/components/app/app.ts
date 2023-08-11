import FooterView from "../footer/footer";
import HeaderView from "../header/header";

export default class App {
  public static createView(): void {
    const footerView = new FooterView();
    const headerView = new HeaderView();
    const footerElement = footerView.getHTMLElement();
    const headerElement = headerView.getHTMLElement();

    if (footerElement && headerElement) {
      document.body.append(headerElement);
      document.body.append(footerElement);
    } else {
      throw new Error("Element is null.");
    }
  }
}
