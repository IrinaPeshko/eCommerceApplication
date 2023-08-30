import { getProduct } from "../../../sdk/sdk";
import { swiper } from "../../slider/swiper";

export class Product {
  public static init(id: string) {
    getProduct(id).then((res) => {
      console.log(res.body.masterData);
    });
    swiper.init();
  }

  // public static get(id: string) {
  //   getProduct(id).then((res) => {
  //     console.log(res.body.masterData);
  //   })
  // }

  // public static show() {
  //   console.log('ok');
  // }
}
