import { getSerchingProducts } from "../../../sdk/sdk";
import { creatCard } from "./createCard";

export function visualeFilterCards(params: string[]) {
  const container = document.querySelector(".catalog__products");
  if (container) {
    container.innerHTML = "";
  }
  try {
    getSerchingProducts(params).then((res) => {
      console.log(res);
      const arrProducts = res.body.results;
      arrProducts.forEach((el) => {
        const name = el.name.en;
        const description = el.description?.en;
        const imagesArr = el.masterVariant.images;
        const pricesArr = el.masterVariant.prices;
        const { id } = el;

        let url = "";
        let price = 0;
        if (
          imagesArr &&
          pricesArr &&
          pricesArr?.length !== 0 &&
          imagesArr.length !== 0
        ) {
          url = imagesArr[0].url;
          price = pricesArr[0].value.centAmount;
          price = +`${price}`.split("").slice(0, -2).join("");
        }
        if (description) {
          const card = creatCard(name, description, url, price, id);
          // const container = document.querySelector(".catalog__products");
          container?.appendChild(card);
        }
      });
    });
  } catch (error) {
    console.error(`You have an error ${error}`);
  }
}
