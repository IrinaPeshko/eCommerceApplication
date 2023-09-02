// import { Attribute } from "@commercetools/platform-sdk";
import { getProduct } from "../../../sdk/sdk";
// import { swiper } from "../../slider/swiper";
// eslint-disable-next-line import/no-cycle
// import { handleLocation } from "../../utils/router";

export class Product {
  public static async init(id = "") {
    const resp = (await getProduct(id)).body.masterData.current;
    console.log(resp);
    // const DOM = {
    //   productBreadcrumbs: document.querySelector('.breadcrumbs:last-child'),
    //   imgBox: document.querySelector('.product_page__slider'),
    //   brend: document.querySelector('.product_page__brand'),
    //   name: document.querySelector('.product_page__name'),
    //   colors: document.querySelector('.product_colors__items'),
    //   quantityMinus: document.querySelector('.product_colors__items'),
    //   quantityNum: document.querySelector('.product_colors__items'),
    //   quantityPlus: document.querySelector('.product_colors__items'),
    //   startPrise: document.querySelector('.product_page__start_prise'),
    //   salePrise: document.querySelector('.product_page__sale_prise'),
    //   detailsBtn: document.querySelector('.product_description__btn'),
    //   description: document.querySelector('.product_detail__description'),
    //   bagAction: ['add', 'remove']
    // };
    // const data = {
    //   description: resp.description?.en,
    //   selectedAttributes:resp.masterVariant.attributes,
    //   colorMain: [],
    //   sizeMain: [],
    //   brend: [],
    //   priseStartMain: '',
    //   priseSaleMain: '',
    // }

    // if(id !== '') window.history.replaceState(null, '', `/product/${id}`);
    // if (id === '' && window.location.href.endsWith('/product')) {
    //   window.history.replaceState(null, '', '/404');
    //   handleLocation()
    // } else if (!window.location.href.includes('/product')) {
    //   const newId = window.location.href.split('/').slice(-1).join('');
    //   id = newId;
    //   window.history.replaceState(null, '', `/${id}`);
    //   Product.init()

    // if (id === '') {
    //   const url = window.location.href
    //   if (url.endsWith('/product')) {
    //
    //   }

    // }
    // getProduct(id).then((res) => {
    //   console.log(res.body.masterData);
    // });
    // swiper.init();
    console.log(id);
  }

  // public static createSlide(url: string) {
  //   const box = document.createElement('div')
  //   box.classList.add('swiper-slide')
  //   box.innerHTML = `<div class="swiper-slide__content"><img class="product_page__img" src="${url}" alt="slide"></img></div>`
  // }

  // public static createColor(color: string) {
  //   const box = document.createElement('li');
  //   box.classList.add('colors__item')
  // }

  // public static createSize(size: string) {
  //   const box = document.createElement('li');
  //   box.classList.add('sizes__item')
  // }

  // public static useAttrubutes(attributes: Attribute[] | undefined) {
  //   if (attributes === undefined) return
  //   const result = {
  //     color: undefined,
  //     size: undefined,
  //     brend: undefined,
  //     prise: undefined
  //   }
  //   attributes.forEach((data) => {
  //     switch (data.name) {
  //       case 'color':
  //         result.color = data.value.label;
  //         break;
  //       case 'size':
  //         result.size = data.value.label;
  //         break;
  //       case 'brend':
  //         result.brend = data.value.label;
  //         break;
  //       case 'price':
  //         result.prise = data.value.label;
  //         break;
  //       default:
  //         break;
  //     }

  //   })
  // }

  // public static get(id: string) {
  //   getProduct(id).then((res) => {
  //     console.log(res.body.masterData);
  //   })
  // }

  // public static show() {
  //   console.log('ok');
  // }
}
