import { removeLine } from "../../../sdk/sdk";
import { RemoveLineFromCart, Actions } from "../../../types/types";
import Alert from "../../alerts/alert";

export default class Product {
  constructor(
    private version: number,
    private cartId: string,
    private lineItemId: string,
    private productId: string,
    private name: string,
    private size: string,
    private color: string,
    private price: number,
    private image: string,
    private quantity: number,
  ) {
    this.version = version;
    this.cartId = cartId;
    this.lineItemId = lineItemId;
    this.productId = productId;
    this.name = name;
    this.size = size;
    this.color = color;
    this.price = price;
    this.image = image;
    this.quantity = quantity;
  }

  public createProduct(): HTMLDivElement {
    const product: HTMLDivElement = document.createElement("div");
    product.className = "cart__table-row";
    product.innerText = `
    <div class="cart__table-product-col">
      <img src="${this.image}">
      <div class="cart__table-product-data-wrapper">
        <span class="cart__table-product-name">${this.name}</span>
        <span class="cart__table-product-color"></span>
      </div>
    </div>
    <div class="cart__table-price-col">
      <span class="cart__table-text">$ ${this.price}</span>
    </div>
    <div class="cart__table-size-col">
      <span class="cart__table-text">${this.size}</span>
    </div>
    <div class="cart__table-quantity-col">
      <div class="counter readonly">
        <button class="counter__decrement-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect y="5" width="12" height="2" fill="#C4C4C4"/>
          </svg>
        </button>
        <input class="counter__field" min="1" name="quantity" value="${this.quantity}" type="number" maxlength ="10">
        <button class="counter__increment-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect y="5" width="12" height="2" fill="#C4C4C4"/>
            <rect x="7" width="12" height="2" transform="rotate(90 7 0)" fill="#C4C4C4"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="cart__table-total-col">
      <span class="cart__table-text">$ 120</span>
    </div>
    <div class="cart__table-btns-col">
      <button class="edit-btn"></button>
      <button class="delete-btn"></button>
    </div>
    `;
    product.addEventListener("click", (e: Event) => {
      e.preventDefault();
      const { target } = e;
      if ((target as HTMLElement).tagName === "BUTTON") {
        if ((target as HTMLElement).classList.contains("delete-btn")) {
          this.removeProductFromCart(target as HTMLElement);
        } else if ((target as HTMLElement).classList.contains("edit-btn")) {
          this.editProduct(target as HTMLElement);
        } else if (
          (target as HTMLElement).classList.contains("counter__decrement-btn")
        ) {
          this.decrementValue(target as HTMLElement);
        } else if (
          (target as HTMLElement).classList.contains("counter__increment-btn")
        ) {
          this.incrementValue(target as HTMLElement);
        }
      }
    });
    return product;
  }

  private async removeProductFromCart(target: HTMLElement): Promise<void> {
    const currentLine: HTMLElement | null = target.closest(".cart__table-row");
    const removedObj: RemoveLineFromCart = {
      action: Actions.removeline,
      lineItemId: this.lineItemId,
    };
    try {
      const removeCurrentLine = await removeLine(
        this.cartId,
        this.version,
        removedObj,
      );
      if (removeCurrentLine.statusCode !== 400) {
        Alert.showAlert(false, "Item successfully removed");
        if (currentLine) currentLine.remove();
      } else {
        throw new Error("Something is wrong");
      }
    } catch (err) {
      Alert.showAlert(true, "Item not removed");
      console.log(err);
    }
  }

  private editProduct(target: HTMLElement): void {
    const parent: HTMLElement | null = target.closest(".cart__table-row");
    if (parent) {
      const counter: HTMLElement | null = parent.querySelector(".counter");
      if (counter) {
        if (counter.classList.contains("read-only")) {
          counter.classList.remove("read-only");
        } else {
          counter.classList.add("read-only");
        }
      }
    }
  }

  private decrementValue(target: HTMLElement): void {
    const quantityInput: ChildNode | null = target.nextSibling;
    if (quantityInput) {
      let quantityVal = Number((quantityInput as HTMLInputElement).value);
      if (quantityVal > 1) {
        target.removeAttribute("disabled");
        quantityVal -= 1;
      } else {
        target.setAttribute("disabled", "disabled");
      }
    }
  }

  private incrementValue(target: HTMLElement): void {
    const quantityInput: ChildNode | null = target.previousSibling;
    if (quantityInput) {
      let quantityVal = Number((quantityInput as HTMLInputElement).value);
      if (quantityVal < 10) {
        target.removeAttribute("disabled");
        quantityVal += 1;
      } else {
        target.setAttribute("disabled", "disabled");
      }
    }
  }
}
