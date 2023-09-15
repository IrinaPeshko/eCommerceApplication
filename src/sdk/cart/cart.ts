import {
  Attribute,
  CentPrecisionMoney,
  LineItem,
  Price,
  Image,
  LocalizedString,
  createApiBuilderFromCtpClient,
  ApiRoot,
} from "@commercetools/platform-sdk";
import { apiRoot, projectKey } from "../commercetoolsApiRoot";
import { MyTokenCache } from "../token/TokenCache";
import {
  createAnonimusClient,
  createAnonimusFlow,
} from "../createPasswordClient";

class CartAPI {
  public static async createCart() {
    let res;

    if (localStorage.getItem("token") || localStorage.getItem("anonimToken")) {
      res = await this.createCartWithToken();
    } else {
      const tokenCache = new MyTokenCache();
      const anonimClientAPI = createAnonimusFlow(tokenCache);
      const anonimClient = createAnonimusClient(anonimClientAPI);
      const anonimApiRoot: ApiRoot =
        createApiBuilderFromCtpClient(anonimClient);
      res = await this.createAnonimusCart(anonimApiRoot);

      if (res.statusCode !== 400) {
        const { token } = tokenCache.get();
        localStorage.setItem("anonimToken", token);
      }
    }

    return res;
  }

  private static async createCartWithToken() {
    const token =
      localStorage.getItem("token") || localStorage.getItem("anonimToken");

    if (!token) return null;
    const res = await apiRoot
      .withProjectKey({ projectKey })
      .me()
      .carts()
      .post({
        body: {
          currency: "USD",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .execute();
    return res;
  }

  private static async createAnonimusCart(anonimusApiRoot: ApiRoot) {
    const res = await anonimusApiRoot
      .withProjectKey({ projectKey })
      .me()
      .carts()
      .post({
        body: {
          currency: "USD",
        },
      })
      .execute();
    return res;
  }

  public static async getOrCreateMyCart() {
    const myCart = await this.getMyCarts().then(async (myCartData) => {
      if (myCartData !== null) {
        return myCartData.body;
      }
      const newCart = await this.createCart().then(
        (newCartData) => newCartData?.body,
      );
      return newCart;
    });
    return myCart;
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

  public static async getAllCarts() {
    const res = await apiRoot
      .withProjectKey({ projectKey })
      .carts()
      .get()
      .execute();
    return res;
  }

  public static async getMyCarts() {
    const token =
      localStorage.getItem("token") || localStorage.getItem("anonimToken");
    if (!token) return null;
    const res = await apiRoot
      .withProjectKey({ projectKey })
      .me()
      .activeCart()
      .get({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .execute();
    return res;
  }

  public static async addProduct(sku: string, quantity: number) {
    if (quantity < 0) return undefined;
    const myCart = await this.getOrCreateMyCart();
    if (!myCart) {
      return undefined;
    }
    const version = myCart?.version;
    const ID = myCart?.id;
    const token =
      localStorage.getItem("token") || localStorage.getItem("anonimToken");
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
          Authorization: `Bearer ${token}`,
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
      if (!myCart) {
        return undefined;
      }
      ID = myCart?.id;
      version = myCart?.version;
    } else {
      ID = IDData;
      version = versionData;
    }
    const token =
      localStorage.getItem("token") || localStorage.getItem("anonimToken");
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
          Authorization: `Bearer ${token}`,
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
    if (!(localStorage.getItem("token") || localStorage.getItem("anonimToken")))
      return null;
    const myCart = await this.getMyCarts().then((res) => {
      if (!res) return null;
      return res.body;
    });
    if (myCart === null) return null;
    if (myCart.lineItems.length === 0) return null;
    const lineItems = myCart.lineItems.reduce(
      (
        acc:
          | Map<
              string,
              {
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
}

export default CartAPI;
