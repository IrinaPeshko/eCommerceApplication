// eslint-disable-next-line import/no-cycle
import { routeToNotAnchor } from "../../utils/router";
import { product } from "../../header/data/linkArrays";

export function creatCard(
  name: string,
  description: string,
  img: string,
  price: string,
  key: string | undefined,
  sku: string,
  discount?: string,
) {
  const card = document.createElement("div");
  card.className = "catalog__card";
  card.setAttribute("products", `${key}`);
  card.setAttribute("sku", `${sku}`);
  card.addEventListener("click", (e) => {
    const event = e.target;
    // console.log(event);
    if (event instanceof HTMLElement) {
      if (event.id === "catalog__product_minus") {
        console.log("delete product");
      } else if (event.id === "catalog__product_plus") {
        console.log("add product");
      } else {
        const { callback } = product[0];
        routeToNotAnchor(e, `/product__${key}`, callback.bind(null, `${key}`));
      }
    }
  });
  if (discount) {
    card.innerHTML = `<div class="card__img-block">
          <img class="card__img" src="${img}" alt="">
        </div>
        <div class="card__caption">
          <h3 class="product__name">${name}</h3>
          <p class="product__description">${description}</p>
          <div class="prices__block">
            <p class="product__price not-discount">${price}$</p> 
            <p class="discount">${discount}$</p>
          </div>
            <p>Add to bag</p>
          <div class="product_quantity">
             <button class="product_quantity__minus" id="catalog__product_minus" type="button" onclick="this.nextElementSibling.stepDown();">-</button>
            <input type="number" class="product_quantity__num" value="0" min="0" readonly>
            <button class="product_quantity__plus" id="catalog__product_plus" type="button" onclick="this.previousElementSibling.stepUp();">+</button>
          </div>
        </div>`;
    return card;
  }
  card.innerHTML = `<div class="card__img-block">
          <img  class="card__img" src="${img}" alt="">
        </div>
        <div class="card__caption">
          <h3 class="product__name">${name}</h3>
          <p class="product__description">${description}</p>
          <div class="prices__block">
            <p class="product__price">${price}$</p>
          </div>
          <p>Add to bag</p>
          <div class="product_quantity">
            <button class="product_quantity__minus" id="catalog__product_minus" type="button" onclick="this.nextElementSibling.stepDown();">-</button>
            <input type="number" class="product_quantity__num" value="0" min="0" readonly>
            <button class="product_quantity__plus" id="catalog__product_plus" type="button" onclick="this.previousElementSibling.stepUp();">+</button>
          </div>
        </div>`;
  return card;
}
