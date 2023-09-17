// eslint-disable-next-line import/no-cycle
import { routeToNotAnchor } from "../../utils/router";
import { product } from "../../header/data/linkArrays";
import { ProductControl } from "../product/productControl";

class Card {
  private name: string;

  private description: string;

  private img: string;

  private price: string;

  private key: string | undefined;

  private sku: string;

  private discount: string;

  public card: HTMLDivElement;

  private plusBtn: HTMLElement | null;

  private num: HTMLElement | null;

  private minusBtn: HTMLElement | null;

  private productControl: ProductControl | null;

  constructor(
    name: string,
    description: string,
    img: string | undefined,
    price: string,
    key: string | undefined,
    sku: string,
    discount?: string,
  ) {
    this.name = name;
    this.description = description;
    this.img = img !== undefined ? img : "";
    this.price = price;
    this.key = key;
    this.sku = sku;
    this.discount = discount || "";
    this.card = this.createCard();
    this.clickCard();
    this.plusBtn = this.card.querySelector(".product_quantity__plus");
    this.num = this.card.querySelector(".product_quantity__num");
    this.minusBtn = this.card.querySelector(".product_quantity__minus");
    this.productControl = new ProductControl(
      this.plusBtn,
      this.num,
      this.minusBtn,
      this.sku,
    );
  }

  public createCard() {
    const card = document.createElement("div");
    card.className = "catalog__card";
    card.setAttribute("products", `${this.key}`);
    card.setAttribute("sku", `${this.sku}`);

    card.innerHTML = `
      <div class="card__img-block">
        <img class="card__img" src="${this.img}" alt="">
      </div>
      <div class="card__caption">
        <h3 class="product__name">${this.name}</h3>
        <p class="product__description">${this.description}</p>
        <div class="prices__block">
          <p class="product__price ${this.discount ? "not-discount" : ""}">${
            this.price
          }</p> 
          ${this.discount ? `<p class="discount">${this.discount}</p>` : ""}
        </div>
        <p>Add to bag</p>
        <div class="product_quantity">
          <button class="product_quantity__minus" type="button" onclick="this.nextElementSibling.stepDown();">-</button>
          <input type="number" class="product_quantity__num" value="0" min="0" readonly>
          <button class="product_quantity__plus" type="button" onclick="this.previousElementSibling.stepUp();">+</button>
      </div>
    `;
    return card;
  }

  private clickCard() {
    this.card.addEventListener("click", (e) => {
      const event = e.target;
      if (event instanceof HTMLElement) {
        const isClickControlProduct =
          event.classList.contains("product_quantity") ||
          event.classList.contains("product_quantity__minus") ||
          event.classList.contains("product_quantity__num") ||
          event.classList.contains("product_quantity__plus");
        if (isClickControlProduct === false) {
          const { callback } = product[0];
          routeToNotAnchor(
            e,
            `/product__${this.key}`,
            callback.bind(null, `${this.key}`),
          );
        }
      }
    });
  }

  public showCard(box: Element | null) {
    if (!box) return;
    box.appendChild(this.card);
  }
}
export default Card;
