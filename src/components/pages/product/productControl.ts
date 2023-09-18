import CartAPI from "../../../sdk/cart/cart";

export class ProductControl {
  public plus: Element;

  public minus: Element;

  public num: HTMLInputElement;

  private sku: string;

  constructor(
    plus: Element | null,
    num: HTMLInputElement | Element | null,
    minis: Element | null,
    sku: string | null,
  ) {
    if (!plus) throw new Error("plus is null");
    if (!num) throw new Error("num is null");
    if (!(num instanceof HTMLInputElement))
      throw new Error("num is not HTMLInputElement");
    if (!minis) throw new Error("minis is null");
    if (!sku) throw new Error("sku is null");
    if (sku === "") throw new Error("set sku");
    this.plus = plus;
    this.num = num;
    this.minus = minis;
    this.sku = sku;
    this.updateNum();
    this.clickMinus();
    this.clickPlus();
  }

  public updateNum() {
    return this.getNumfromCart().then((res) => this.changeNum(res));
  }

  public getCurrentNum() {
    return this.num.value;
  }

  public changeNum(value: number) {
    this.num.value = `${value}`;
  }

  public changeSku(value: string) {
    if (!value) throw new Error("sku is null");
    if (value === "") throw new Error("set sku");
    this.sku = value;
  }

  public async getNumfromCart() {
    const cartData = await CartAPI.checkMyCart();
    if (cartData === null || cartData.products === undefined) return 0;
    const num = cartData.products.get(this.sku);
    if (num === undefined) return 0;
    return num.quantity;
  }

  public async clickPlus() {
    this.plus.addEventListener("click", async () => {
      const currentNum = +this.getCurrentNum();
      if (currentNum === 1) {
        const res = await CartAPI.addProduct(this.sku, currentNum);
        return res;
      }
      const res = await CartAPI.updateProduct(this.sku, currentNum);
      return res;
    });
  }

  public async clickMinus() {
    this.minus.addEventListener("click", async () => {
      const currentNum = +this.getCurrentNum();
      const res = await CartAPI.updateProduct(this.sku, currentNum);
      return res;
    });
  }
}
