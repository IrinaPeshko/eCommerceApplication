import { getSerchingProducts } from "../../../sdk/sdk";
// eslint-disable-next-line import/no-cycle
import { creatCard } from "./createCard";

export function visualeFilterCards(params: string[]) {
  const container = document.querySelector(".catalog__products");
  const sortSelect = document.getElementById("sort-select");
  if (container) {
    container.innerHTML = "";
  }
  let sortParam = "";
  if (sortSelect instanceof HTMLSelectElement) {
    if (sortSelect.value === "name-asc") {
      sortParam = "name.en asc";
    } else if (sortSelect.value === "name-desc") {
      sortParam = "name.en desc";
    } else if (sortSelect.value === "price-desc") {
      sortParam = "price desc";
    } else {
      sortParam = "price asc";
    }
  }
  try {
    getSerchingProducts(params, sortParam).then((res) => {
      const arrProducts = res.body.results;
      arrProducts.forEach((el) => {
        const name = el.name.en;
        const description = el.description?.en;
        const imagesArr = el.masterVariant.images;
        const pricesArr = el.masterVariant.prices;
        let discount: string | undefined = "";
        const { id } = el;
        if (pricesArr) {
          const disc = pricesArr[0].discounted?.value.centAmount;
          if (disc) {
            discount = `${disc}`.split("").slice(0, -2).join("");
          }
        }

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
          if (discount) {
            const card = creatCard(name, description, url, price, id, discount);
            container?.appendChild(card);
          } else {
            const card = creatCard(name, description, url, price, id);
            container?.appendChild(card);
          }
        }
      });
    });
  } catch (error) {
    console.error(`You have an error ${error}`);
  }
}
