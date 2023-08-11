import Param from "../../types/elementCreator/param";
import View from "../utils/view";

const cssClasses = {
  header: "header",
};

const TEXT = "SPA HEADER";

export default class HeaderView extends View {
  constructor() {
    const params: Param = {
      tag: "header",
      classNames: [`${cssClasses.header}`],
      textContent: TEXT,
    };
    super(params);
  }
}
