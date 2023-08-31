import { getProducts, getSerchingProducts } from "../../../sdk/sdk";
/* eslint-disable import/no-cycle */
import { routeToNotAnchor } from "../../utils/router";
import {
  createBrendFilterStr,
  createColorFilterStr,
  createPriceFilterStr,
  createSizeFilterStr,
} from "./createAttributeParams";
import { creatCard } from "./createCard";
import { visualeFilterCards } from "./ilterBtnClick";

export function visualeCards() {
  try {
    const container = document.querySelector(".catalog__products");
    if (container) {
      container.innerHTML = "";
    }
    const checkboxes = document.querySelectorAll(".form__checkbox");
    for (const checkbox of checkboxes) {
      if (checkbox instanceof HTMLInputElement) {
        checkbox.checked = false;
      }
    }
    getProducts().then((res) => {
      console.log(res.body.results);
      const arrProducts = res.body.results;
      arrProducts.forEach((el) => {
        const name = el.masterData.current.name.en;
        const description = el.masterData.current.metaDescription?.en;
        const imagesArr = el.masterData.current.masterVariant.images;
        const pricesArr = el.masterData.current.masterVariant.prices;
        const { id } = el;

        let url = "";
        let price = 0;
        if (imagesArr && pricesArr && pricesArr?.length !== 0) {
          url = imagesArr[0].url;
          price = pricesArr[0].value.centAmount;
          price = +`${price}`.split("").slice(0, -2).join("");
        }
        if (description) {
          const card = creatCard(name, description, url, price, id);
          container?.appendChild(card);
        }
      });
      const cards = document.querySelectorAll(".catalog__card");
      console.log(cards);
      cards.forEach((el) => {
        el.addEventListener("click", (ev) => {
          routeToNotAnchor(ev, "/product");
        });
      });
    });
  } catch (error) {
    console.error(`You have an error ${error}`);
  }
}

export function onFilterBtnClick() {
  // const cardContainer = document.querySelector(".catalog__products");
  const params: string[] = [];
  const colorParams = createColorFilterStr();
  const brendParams = createBrendFilterStr();
  const sizeParams = createSizeFilterStr();
  const priceParams = createPriceFilterStr();
  const container = document.querySelector(".catalog__products");

  if (colorParams) {
    params.push(colorParams);
  }
  if (brendParams) {
    params.push(brendParams);
  }
  if (sizeParams) {
    params.push(sizeParams);
  }
  if (priceParams) {
    params.push(priceParams);
  }
  console.log(params);
  if (container) {
    container.innerHTML = "";
  }
  visualeFilterCards(params);
  // getSerchingProducts(params).then((res) => console.log(res));

  // [
  //         'variants.attributes.color.key:"color-black"'
  //       ],
}
getSerchingProducts([
  'variants.categories.id:"f05de2d3-cca4-4fc6-a3b5-80429eb4d40f"',
]).then((res) => console.log(res));

// export async function getAllProducts() {
//   try {
//     const response = await getProducts();
//       if (response.statusCode === 200) {
//         const products = await response.json();
//         return products;
//       } else {
//         throw new Error(`Ошибка при получении данных: ${response.statuCode}`);
//       }
//   } catch (error) {
//     console.error("Ошибка при получении данных:", error);
//     throw error; // Можете выбросить исключение, чтобы обработать его где-то выше
//   }
// }
