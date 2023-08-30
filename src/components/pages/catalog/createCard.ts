export function creatCard(
  name: string,
  description: string,
  img: string,
  price: number,
  id: string,
) {
  const card = document.createElement("div");
  card.className = "catalog__card";
  card.setAttribute("products", id);
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
