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
          if (pricesArr[0]) {
            const discountData = pricesArr[0].discounted?.value;
            if (discountData) {
              discount = `${(
                discountData.centAmount /
                10 ** discountData.fractionDigits
              ).toFixed(2)}`;
            }
          }
        }

        let url = "";
        let price = "0";
        if (
          imagesArr &&
          pricesArr &&
          pricesArr?.length !== 0 &&
          imagesArr.length !== 0
        ) {
          url = imagesArr[0].url;
          const dataPrice = pricesArr[0].value;
          price = `${(
            dataPrice.centAmount /
            10 ** dataPrice.fractionDigits
          ).toFixed(2)}`;
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
