import { getCategories, getSerchingProducts } from "../../../sdk/sdk";
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
import { product } from "../../header/data/linkArrays";
import { createSubCategory } from "./createSubCategory";

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
    const sortSelect = document.getElementById("sort-select");
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
    const params: string[] = [];
    const selectedEl = document.querySelector(".selected");
    if (selectedEl) {
      const key = selectedEl.getAttribute("key");
      params.push(`variants.categories.id:"${key}"`);
    }
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
        if (imagesArr && pricesArr && pricesArr?.length !== 0) {
          url = imagesArr[0].url;
          price = pricesArr[0].value.centAmount;
          price = +`${price}`.split("").slice(0, -2).join("");
        }
        if (description) {
          console.log(discount);
          if (discount) {
            const card = creatCard(name, description, url, price, id, discount);
            container?.appendChild(card);
          } else {
            const card = creatCard(name, description, url, price, id);
            container?.appendChild(card);
          }
        }
      });
      const cards = document.querySelectorAll(".catalog__card");
      cards.forEach((el) => {
        el.addEventListener("click", (ev) => {
          const id = el.getAttribute("products");
          const { callback } = product[0];
          routeToNotAnchor(ev, "/product", callback.bind(null, `${id}`));
        });
      });
    });
  } catch (error) {
    console.error(`You have an error ${error}`);
  }
}

export function onFilterBtnClick() {
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
  if (container) {
    container.innerHTML = "";
  }
  const selectedCategory = document.querySelector(".selected");
  if (selectedCategory) {
    const selctedKey = selectedCategory.getAttribute("key");
    params.push(`variants.categories.id:"${selctedKey}"`);
  }
  visualeFilterCards(params);
}

export function createCategories() {
  const cotegoriesFirst = document.querySelector(
    ".catalog__breadcrumbs.topmenu li",
  );
  getCategories().then((res) => {
    const elementsWithOrderHintZero = res.body.results.filter(
      (element) => element.orderHint === "0",
    );
    const submenu = document.createElement("ul");
    submenu.className = "catalog__breadcrumbs__submenu";
    elementsWithOrderHintZero.forEach((el) => {
      const subEl = createSubCategory(el.id, `${el.name.en}`);
      function createChildrens(id: string, parentEl: HTMLElement) {
        const parentMenu = document.createElement("ul");
        parentMenu.className = "catalog__breadcrumbs__submenu";
        if (res.body) {
          const children = res.body.results.filter(
            (element) => element.parent?.id === id,
          );
          children.forEach((element) => {
            const subelement = createSubCategory(element.id, element.name.en);
            createChildrens(element.id, subelement);
            parentMenu.appendChild(subelement);
          });
          if (children.length !== 0) {
            parentEl.appendChild(parentMenu);
          }
        }
      }
      createChildrens(el.id, subEl);

      submenu.appendChild(subEl);
    });
    cotegoriesFirst?.appendChild(submenu);
  });
}
