import Product from "./basketProduct";
import CartAPI from "../../../sdk/cart/cart";

export async function createCartTable(): Promise<void> {
  const tableBody: HTMLDivElement | null = document.querySelector(".cart__table-body");
  const totalElem: HTMLSpanElement | null = document.querySelector(".cart__total-price");
  try {
    const cartResp = await CartAPI.checkMyCart();
    if (cartResp) {
      const { products, cart } = cartResp;
      const { totalPrice: { centAmount, currencyCode: cartcurrencyCode, fractionDigits: cartFractionDigits } } = cart;
      if (products) {
        if (tableBody) {
          tableBody.innerHTML = "";
          products.forEach(product => {
            const { sku, id, version, lineItemKey, productKey, name: { en: productName }, attributes,
            price: {value: {centAmount: defaultPrice, currencyCode, fractionDigits }}, images, quantity, price: { discounted } } = product;
            if (lineItemKey && productKey && attributes && images) {
              const attributesValues = attributes.map(elem => elem.value.label);
              const image: string = images.map(elem => elem.url)[0];
              const discountedPrice: number | undefined = discounted ? Number((discounted.value.centAmount / 10 ** fractionDigits).toFixed(2)) : undefined;
              const correctDefaultPrice = Number((defaultPrice / 10 ** fractionDigits).toFixed(2));
              const newProduct = new Product(sku, version, id, lineItemKey, productKey, productName, attributesValues[0],
                attributesValues[1], correctDefaultPrice, image, quantity, currencyCode, discountedPrice);
              tableBody.append(newProduct.createProduct());
            }
          })
        }
      }
      if (cart) {
        if (totalElem) {
          const correctTotalPrice = Number((centAmount / 10 ** cartFractionDigits).toFixed(2));
          totalElem.innerText = `${correctTotalPrice  } ${  cartcurrencyCode}`;
        }
      }
    } else {
      console.log("Empty cart");
    }
  } catch(err) {
    console.log(err);
  }
}

// export async function removeCart() {

// }
