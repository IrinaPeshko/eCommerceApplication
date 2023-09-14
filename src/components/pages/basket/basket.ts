import Product from "./basketProduct";
import CartAPI from "../../../sdk/cart/cart";
import { RemoveLineFromCart, Actions } from "../../../types/types";
import Alert from "../../alerts/alert";

async function removeCart(): Promise<void> {
  const removeArr: RemoveLineFromCart[] = [];
  try {
    const allProducts = await CartAPI.checkMyCart();
    if (allProducts) {
      const { products } = allProducts;
      if (products) {
        console.log(Array.from(products.values()));
        const { id, version } = Array.from(products.values())[0];
        products.forEach(product => {
          const { lineItemKey } = product;
          if (lineItemKey) {
            const obj: RemoveLineFromCart = {
              action: Actions.removeline,
              lineItemKey
            };
            removeArr.push(obj);
          }
        })
        const removeAllItems = await CartAPI.clearCart(id, version, removeArr);
        if (removeAllItems.statusCode !== 400) {
          Alert.showAlert(false, "Сart has been emptied");
        } else {
          throw new Error("Something is wrong");
        }
      }
    }
  } catch(err) {
    console.log(err);
  }
}

export async function createCartTable(): Promise<void> {
  const mainElem: HTMLElement | null = document.querySelector(".cart");
  const tableBody: HTMLDivElement | null =
    document.querySelector(".cart__table-body");
  const totalElem: HTMLSpanElement | null =
    document.querySelector(".cart__total-price");
  try {
    const cartResp = await CartAPI.checkMyCart();
    if (cartResp) {
      const { products, cart } = cartResp;
      const {
        totalPrice: {
          centAmount,
          currencyCode: cartcurrencyCode,
          fractionDigits: cartFractionDigits,
        },
      } = cart;
      if (products) {
        if (tableBody) {
          tableBody.innerHTML = "";
          products.forEach((product) => {
            const {
              sku,
              id,
              version,
              lineItemKey,
              productKey,
              name: { en: productName },
              attributes,
              price: {
                value: {
                  centAmount: defaultPrice,
                  currencyCode,
                  fractionDigits,
                },
              },
              images,
              quantity,
              price: { discounted },
            } = product;
            if (lineItemKey && productKey && attributes && images) {
              const attributesValues = attributes.map(
                (elem) => elem.value.label,
              );
              const image: string = images.map((elem) => elem.url)[0];
              const discountedPrice: number | undefined = discounted
                ? Number(
                    (
                      discounted.value.centAmount /
                      10 ** fractionDigits
                    ).toFixed(2),
                  )
                : undefined;
              const correctDefaultPrice = Number(
                (defaultPrice / 10 ** fractionDigits).toFixed(2),
              );
              const newProduct = new Product(
                sku,
                version,
                id,
                lineItemKey,
                productKey,
                productName,
                attributesValues[0],
                attributesValues[1],
                correctDefaultPrice,
                image,
                quantity,
                currencyCode,
                discountedPrice,
              );
              tableBody.append(newProduct.createProduct());
            }
          });
        }
      }
      if (cart) {
        if (totalElem) {
          const correctTotalPrice = Number(
            (centAmount / 10 ** cartFractionDigits).toFixed(2),
          );
          totalElem.innerText = `${correctTotalPrice} ${cartcurrencyCode}`;
        }
      }
    } else {
      console.log("Empty cart");
    }
  } catch (err) {
    console.log(err);
  }
  if (mainElem) {
    mainElem.addEventListener("click", (e: Event) => {
      e.preventDefault();
      const { target } = e;
      if ((target as HTMLElement).tagName === "BUTTON") {
        if ((target as HTMLElement).classList.contains("cart__clear-cart-btn")) {
          removeCart();
        }
      }
    });
  }
}
