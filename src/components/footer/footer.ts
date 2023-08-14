import Param from "../../types/elementCreator/param";
import View from "../utils/view";

const cssClasses = {
  footer: "footer",
};

const TEXT = "SPA FOOTER";

export default class FooterView extends View {
  constructor() {
    const params: Param = {
      tag: "footer",
      classNames: [`${cssClasses.footer}`],
      textContent: TEXT,
    };
    super(params);
  }
}
