// import Product from "./basketProduct";
import { getCarts } from "../../../sdk/sdk";

export async function createCartTable(): Promise<void> {
  // const tableBody: HTMLDivElement | null = document.querySelector(".cart__table-body");
  try {
    const cartResp = await getCarts();
    if (cartResp.statusCode !== 400) {
      console.log(cartResp.body.results);
      // const { lineItems } = cartResp.body.results;
      // cartArr.forEach(elem => {
      //   console.log(elem);
      // })
    } else {
      throw new Error("Something is wrong");
    }
  } catch (err) {
    console.log(err);
  }
}
