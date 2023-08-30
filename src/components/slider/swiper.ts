import "swiper/css/bundle";
import Swiper from "swiper";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";

export const swiper = new Swiper(".swiper", {
  modules: [Navigation, Pagination, Scrollbar],
  spaceBetween: 30,
  centeredSlides: true,
  observer: true,
  observeParents: true,
  observeSlideChildren: true,
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    600: {
      slidesPerView: 2,
    },
    900: {
      slidesPerView: 3,
    },
  },
  grabCursor: true,
  watchOverflow: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  scrollbar: {
    el: ".swiper-scrollbar",
    draggable: true,
  },
});
