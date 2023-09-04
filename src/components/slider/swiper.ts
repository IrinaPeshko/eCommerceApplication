import {
  Manipulation,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";

export const productPageSwiperMainSetting = {
  modules: [Navigation, Pagination, Scrollbar, Manipulation],
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
};

export const productPageSwiperPopapSetting = {
  modules: [Navigation, Pagination, Scrollbar, Manipulation],
  spaceBetween: 30,
  centeredSlides: true,
  observer: true,
  observeParents: true,
  observeSlideChildren: true,
  slidesPerView: 1,
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
};

// export const productPageSwiperPopap = new Swiper(".swiper", {
//   modules: [Navigation, Pagination, Scrollbar, Manipulation],
//   spaceBetween: 30,
//   centeredSlides: true,
//   observer: true,
//   observeParents: true,
//   observeSlideChildren: true,
//   slidesPerView: 1,
//   // breakpoints: {
//   //   320: {
//   //     width: 320,
//   //   },
//   //   500: {
//   //     width: 420,
//   //   }
//   // }
//   width: 400,
//   grabCursor: true,
//   watchOverflow: true,
//   pagination: {
//     el: ".swiper-pagination",
//     clickable: true,
//     dynamicBullets: true,
//   },
//   navigation: {
//     nextEl: ".swiper-button-next",
//     prevEl: ".swiper-button-prev",
//   },
//   scrollbar: {
//     el: ".swiper-scrollbar",
//     draggable: true,
//   },
// });
