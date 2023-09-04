// eslint-disable-next-line import/no-cycle
import { routeToNotAnchor } from "../../utils/router";
import { product } from "../../header/data/linkArrays";

export function creatCard(
  name: string,
  description: string,
  img: string,
  price: number,
  id: string,
  discount?: string,
) {
  const card = document.createElement("div");
  card.className = "catalog__card";
  card.setAttribute("products", id);
  card.addEventListener("click", (e) => {
    const { callback } = product[0];
    routeToNotAnchor(e, "/product", callback.bind(null, `${id}`));
  });
  if (discount) {
    card.innerHTML = `<div class="card__img-block">
          <img  class="card__img" src="${img}" alt="">
        </div>
        <div class="card__caption">
          <h3 class="product__name">${name}</h3>
          <p class="product__description">${description}</p>
          <div class="prices__block">
            <p class="product__price not-discount">${price}$</p> 
            <p class="discount">${discount}$</p>
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
          <p class="product__price">${price}$</p>
        </div>`;
  return card;
}
