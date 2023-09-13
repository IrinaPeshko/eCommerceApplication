import {
  Attribute,
  CentPrecisionMoney,
  LineItem,
  Price,
  Image,
  LocalizedString,
} from "@commercetools/platform-sdk";
import { apiRoot, projectKey } from "../commercetoolsApiRoot";
import { RemoveLineFromCart } from "../../types/types";

class CartAPI {
  public static async createCart() {
    const res = apiRoot
      .withProjectKey({ projectKey })
      .me()
      .carts()
      .post({
        body: {
          currency: "USD",
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .execute();
    return res;
  }

  public static async deleteCart(id: string, version: number) {
    const res = apiRoot
      .withProjectKey({ projectKey })
      .carts()
      .withId({ ID: id })
      .delete({
        queryArgs: {
          version,
        },
      })
      .execute();
    return res;
  }

  // получаем все созданные корзины
  public static async getAllCarts() {
    const res = await apiRoot
      .withProjectKey({ projectKey })
      .carts()
      .get()
      .execute();
    return res;
  }

  // получаем корзины созданные со токеном (пока - только для зарегистророванных пользовательй. Для анонимных - не проверено)
  public static async getMyCarts() {
    const res = await apiRoot
      .withProjectKey({ projectKey })
      .me()
      .carts()
      .get({
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .execute();
    // console.log(res)
    return res;
  }

  // возвращает корзину или создает и возвращает корзину.
  public static async getOrCreateMyCart() {
    const myCart = await this.getMyCarts().then(async (myCartData) => {
      // если моя корзина создана, то возвращаем корзину
      if (myCartData.body.count > 0) {
        return myCartData.body.results[0];
      }
      // иначе создаем новую корзину и возвращаем ее
      const newCart = await this.createCart().then(
        (newCartData) => newCartData.body,
      );
      return newCart;
    });
    return myCart;
  }

  public static async addProduct(sku: string, quantity: number) {
    if (quantity < 0) return undefined;
    const myCart = await this.getOrCreateMyCart();
    const version = myCart?.version;
    const ID = myCart?.id;
    const addProduct = await apiRoot
      .withProjectKey({ projectKey })
      .me()
      .carts()
      .withId({ ID })
      .post({
        body: {
          version,
          actions: [
            {
              action: "addLineItem",
              sku,
              quantity,
              key: `${sku}__cart`,
            },
          ],
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .execute()
      .then((res) => res)
      .catch((e) => {
        if (e.statusCode === 400) {
          return this.updateProduct(sku, quantity, ID, version);
        }
        throw new Error(e);
      });
    return addProduct;
  }

  // если передать quantity === 0, то продукт буден удален
  public static async updateProduct(
    sku: string,
    quantity: number,
    IDData?: string,
    versionData?: number,
  ) {
    let ID;
    let version;
    if (IDData === undefined || versionData === undefined) {
      const myCart = await this.getOrCreateMyCart();
      ID = myCart?.id;
      version = myCart?.version;
    } else {
      ID = IDData;
      version = versionData;
    }
    const updateProduct = await apiRoot
      .withProjectKey({ projectKey })
      .me()
      .carts()
      .withId({ ID })
      .post({
        body: {
          version,
          actions: [
            {
              action: "changeLineItemQuantity",
              quantity,
              lineItemKey: `${sku}__cart`,
            },
          ],
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .execute()
      .then((res) => res)
      .catch((e) => {
        throw new Error(e);
      });
    return updateProduct;
  }

  // проверяет корзину, если нет корзины или она пуста возвращает null, иначе возвращает объект с данными продукта и корзины(общая стоимость товаров и общее количество товаров)
  // product - это map, где ключ - sku продукта. Проверить есть ли такой товар в корзине можно через map.get(key) – возвращает значение по ключу или undefined, если ключ key отсутствует.
  public static async checkMyCart() {
    const myCart = await this.getMyCarts().then((res) => {
      if (res.body.count <= 0) return null;
      return res.body.results[0];
    });
    if (myCart === null) return null;
    if (myCart.lineItems.length === 0) return null;
    const lineItems = myCart.lineItems.reduce(
      (
        acc:
          | Map<
              string,
              {
                sku: string,
                id: string,
                version: number,
                lineItemKey: string | undefined,
                name: LocalizedString;
                quantity: number;
                productKey: string | undefined;
                price: Price;
                totalPrice: CentPrecisionMoney;
                attributes: Attribute[] | undefined;
                images: Image[] | undefined;
              }
            >
          | undefined,
        item: LineItem,
      ) => {
        const { sku } = item.variant;
        if (sku !== undefined && acc !== undefined) {
          acc.set(sku, {
            sku,
            id: myCart.id,
            version: myCart.version,
            lineItemKey: item.key,
            name: item.name,
            quantity: item.quantity,
            productKey: item.productKey,
            price: item.price,
            totalPrice: item.totalPrice,
            attributes: item.variant.attributes,
            images: item.variant.images,
          });
        }
        return acc;
      },
      new Map(),
    );
    const cart = {
      totalPrice: myCart.totalPrice,
      totalLineItemQuantity: myCart.totalLineItemQuantity,
    };
    return { products: lineItems, cart };
  }

  public static async removeLine(
    id: string,
    version: number,
    actionObj: RemoveLineFromCart,
  ) {
    return apiRoot
      .withProjectKey({ projectKey })
      .me()
      .carts()
      .withId({ ID: id })
      .post({
        body: {
          version,
          actions: [actionObj],
        },
      })
      .execute();
  }
}

export default CartAPI;
