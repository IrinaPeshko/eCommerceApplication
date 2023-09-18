import Product from "./basketProduct";
import CartAPI from "../../../sdk/cart/cart";
import { RemoveLineFromCart, Actions, AddCode } from "../../../types/types";
import Alert from "../../alerts/alert";
import Code from "./code";
import { totalPrice } from "./correctPrice";
import { Emitter } from "../../utils/eventEmitter";

async function removeCart(): Promise<void> {
  const tableBody: HTMLDivElement | null =
    document.querySelector(".cart__table-body");
  const removeArr: RemoveLineFromCart[] = [];
  try {
    const allProducts = await CartAPI.checkMyCart();
    if (allProducts) {
      const { products } = allProducts;
      if (products) {
        products.forEach((product) => {
          const { lineItemKey } = product;
          if (lineItemKey) {
            const obj: RemoveLineFromCart = {
              action: Actions.removeline,
              lineItemKey,
            };
            removeArr.push(obj);
          }
        });
        const removeAllItems = await CartAPI.clearCart(removeArr);
        if (removeAllItems) {
          if (removeAllItems.statusCode !== 400) {
            const {
              totalPrice: { centAmount, fractionDigits, currencyCode },
            } = removeAllItems.body;
            if (tableBody) {
              tableBody.innerHTML = "";
            }
            totalPrice(centAmount, fractionDigits, currencyCode);
            Alert.showAlert(false, "Сart has been emptied");
          } else {
            throw new Error("Something is wrong");
          }
        }
      }
    }
  } catch (err) {
    Alert.showAlert(true, "Cart has been not emptied");
    console.log(err);
  }
}

async function applyCode(target: HTMLElement): Promise<void> {
  const codeField: Element | null = target.previousElementSibling;
  const codesList: HTMLDivElement | null =
    document.querySelector(".cart__codes-list");
  const totalElem: HTMLSpanElement | null =
    document.querySelector(".cart__total-price");
  if (codeField) {
    const codeVal: string = (codeField as HTMLInputElement).value;
    if (codeVal !== "") {
      const addCodeObj: AddCode[] = [
        {
          action: Actions.addcode,
          code: codeVal,
        },
      ];
      try {
        const getCartsDiscount = await CartAPI.addCode(addCodeObj);
        if (getCartsDiscount) {
          if (getCartsDiscount.statusCode !== 400) {
            (codeField as HTMLInputElement).value = "";
            const {
              totalPrice: { centAmount, currencyCode, fractionDigits },
            } = getCartsDiscount.body;
            const { discountCodes, lineItems } = getCartsDiscount.body;
            const {
              discountCode: { id: idFromCart },
            } = discountCodes[0];
            const newCode = new Code(idFromCart, codeVal);
            if (codesList) {
              codesList.append(newCode.createCodeElem());
            }
            lineItems.forEach((elem) => {
              const { productKey, discountedPricePerQuantity } = elem;
              if (discountedPricePerQuantity.length !== 0) {
                const {
                  discountedPrice: {
                    includedDiscounts,
                    value: { centAmount: changedTotal },
                  },
                } = elem.discountedPricePerQuantity[0];
                const {
                  discount: { typeId },
                  discountedAmount: { centAmount: discountNum },
                } = includedDiscounts[0];
                if (typeId === "cart-discount") {
                  Emitter.emit(
                    "updateRow",
                    productKey,
                    changedTotal,
                    discountNum,
                  );
                }
              }
            });
            Alert.showAlert(false, "Code is successfully applied to this cart");
            if (totalElem) {
              totalPrice(centAmount, fractionDigits, currencyCode);
            }
          } else {
            throw new Error("Something is wrong");
          }
        }
      } catch (err) {
        Alert.showAlert(true, "This code is unavailable");
        console.log(err);
      }
    }
  }
}

export async function createCartTable(): Promise<void> {
  const mainElem: HTMLElement | null = document.querySelector(".cart");
  const tableBody: HTMLDivElement | null =
    document.querySelector(".cart__table-body");
  const codesList: HTMLDivElement | null =
    document.querySelector(".cart__codes-list");
  let amountNum;
  try {
    const cartResp = await CartAPI.checkMyCart();
    const getCartDiscounts = await CartAPI.getOrCreateMyCart();
    if (cartResp) {
      // console.log(cartResp);
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
              discountedPricePerQuantity,
              images,
              quantity,
              price: { discounted },
              totalPrice: { centAmount: totalCentAmount },
            } = product;
            if (discountedPricePerQuantity.length !== 0) {
              const {
                discountedPrice: { includedDiscounts },
              } = discountedPricePerQuantity[0];
              const {
                discountedAmount: { centAmount: currAmount },
              } = includedDiscounts[0];
              amountNum = currAmount;
            } else {
              amountNum = undefined;
            }
            if (lineItemKey && productKey && attributes && images) {
              const attributesValues = attributes.map(
                (elem) => elem.value.label,
              );
              const image: string = images.map((elem) => elem.url)[0];
              const discountedPrice: number | undefined = discounted
                ? discounted.value.centAmount
                : undefined;
              const correctDefaultPrice: number = defaultPrice;
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
                fractionDigits,
                totalCentAmount,
                amountNum,
                discountedPrice,
              );
              tableBody.append(newProduct.createProduct());
            }
          });
        }
      }
      if (cart) {
        totalPrice(centAmount, cartFractionDigits, cartcurrencyCode);
      }
    } else {
      console.log("Empty cart");
    }
    if (codesList) {
      codesList.innerHTML = "";
      if (getCartDiscounts) {
        console.log(getCartDiscounts);
        const { discountCodes } = getCartDiscounts;
        if (discountCodes && discountCodes.length !== 0) {
          discountCodes.forEach(async (code) => {
            const {
              discountCode: { id },
            } = code;
            try {
              const getCode = await CartAPI.getDiscountCode(id);
              if (getCode.statusCode !== 400) {
                // console.log(getCode.body);
                const { code: codeName } = getCode.body;
                const codeElem = new Code(id, codeName);
                if (codesList) {
                  codesList.append(codeElem.createCodeElem());
                }
              } else {
                throw new Error("Something is wrong");
              }
            } catch (err) {
              console.log(err);
            }
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
  if (mainElem) {
    mainElem.addEventListener("click", (e: Event) => {
      e.preventDefault();
      const { target } = e;
      if ((target as HTMLElement).tagName === "BUTTON") {
        if (
          (target as HTMLElement).classList.contains("cart__clear-cart-btn")
        ) {
          removeCart();
        } else if (
          (target as HTMLElement).classList.contains("cart__apply-code-btn")
        ) {
          applyCode(target as HTMLElement);
        }
      }
    });
  }
}
