import { getProducts} from "../../../sdk/sdk";

function creatCard(
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

export function visualeCards() {
  try {
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
        const container = document.querySelector(".catalog__products");
        container?.appendChild(card);
      }
    });
  });
} catch (error) {
  console.error(`You have an error ${  error}`)
}
}

// function createColorFilterStr () {
//   const yellowCheckbox = document.getElementById("yellow__checkbox");
//   const redCheckbox = document.getElementById("red__checkbox");
//   const blueCheckbox = document.getElementById("blue__checkbox");
//   const blackCheckbox = document.getElementById("black__checkbox");

//   let str = 'variants.attributes.color.key:"color-black"'
//   if (
//     yellowCheckbox instanceof HTMLInputElement &&
//     redCheckbox instanceof HTMLInputElement &&
//     blueCheckbox instanceof HTMLInputElement &&
//     blackCheckbox instanceof HTMLInputElement 
//   ) {
//     if (yellowCheckbox.checked){
//       str+='"color-yellow"'
//     }
//   }
// }

export function onFilterBtnClick () {
  // const cardContainer = document.querySelector(".catalog__products");
  const params = [""];
  
console.log(params);
  // getSerchingProducts(params).then((res) => console.log(res));
  // [
  //         'variants.attributes.color.key:"color-black"'
  //       ],
}

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
