import link from "../../../types/link/Ilink";
import imgBascket from "../../../assets/icons/bascket.png";
import imgProfile from "../../../assets/icons/8324223_ui_essential_app_avatar_profile_icon.svg";
/* eslint-disable import/no-cycle */
import Registration from "../../pages/registration/registration";
import setShippingDefault from "../../pages/registration/select default address checkbox/setDefaultShipping";
import Login from "../../pages/login/login";
import Profile from "../../pages/profile/profile";
import { handleLocation, routeforOtherLink } from "../../utils/router";
import HeaderView from "../header";
// import {
//   createCategories,
// } from "../../pages/catalog/cards";
// import { visualeFilterCards } from "../../pages/catalog/ilterBtnClick";
// import { Categ } from "../../pages/catalog/category";
import { getUserById } from "../../../sdk/sdk";
import { Address } from "../../../types/types";
// import { Category } from "../../../types/catalog/catalogTypes";
import { Product } from "../../pages/product/product";
import productKeys from "../../pages/product/productsKey";
// import Filter from "../../pages/catalog/filter";
import { Catalog } from "../../pages/catalog/catalog";

const namePage = {
  MAIN: "MAIN",
  LOGIN: "LOG IN",
  LOGOUT: "LOG OUT",
  CREATEACCOUNT: "CREATE ACCOUNT",
  CATALOG: "CATALOG",
  PROFILE: "PROFILE",
  BASKET: "BASKET",
  ABOUT: "ABOUT US",
  PRODUCT: "PRODUCT",
};

export const profileLinks: link[] = [
  {
    name: namePage.LOGIN,
    classList: ["account__item", "sigh"],
    innerHTML: `<svg
              class="sigh-in"
              width="30"
              viewBox="0 0 256 256"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_3_6)">
                <path
                  d="M174 86L216 128L174 170"
                  stroke="white"
                  stroke-width="16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M104 128H216"
                  stroke="white"
                  stroke-width="16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M173 39.9999H229C231.122 39.9999 233.157 40.8428 234.657 42.3431C236.157 43.8433 237 45.8782 237 47.9999V208C237 210.122 236.157 212.156 234.657 213.657C233.157 215.157 231.122 216 229 216H173"
                  stroke="white"
                  stroke-width="16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="in"
                />
                <path
                  d="M104 216H48C45.8783 216 43.8434 215.157 42.3431 213.657C40.8429 212.157 40 210.122 40 208V48C40 45.8783 40.8429 43.8434 42.3431 42.3431C43.8434 40.8429 45.8783 40 48 40H104"
                  stroke="white"
                  stroke-width="16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="out"
                />
              </g>
              <defs>
                <clipPath id="clip0_3_6">
                  <rect width="256" height="256" fill="white" />
                </clipPath>
              </defs>
            </svg>`,
    href: "/login",
    callback: (): void => {
      const login = new Login();
      const func: (event: Event) => void = (event: Event): void => {
        const { target } = event;
        if (target) {
          if ((target as HTMLElement).tagName === "BUTTON") {
            if ((target as HTMLInputElement).classList.contains("login__btn")) {
              event.preventDefault();
              if (event instanceof MouseEvent) {
                login.signIn(event);
              }
            }
          } else if (target instanceof HTMLAnchorElement) {
            if (target.classList.contains("login__create-acc-btn")) {
              event.preventDefault();
              if (event instanceof MouseEvent) {
                routeforOtherLink(event);
              }
            }
          }
        }
      };
      document.addEventListener("keyup", (e: Event): void => {
        e.preventDefault();
        const { target } = e;
        if (target) {
          login.validationForm(target as HTMLInputElement);
        }
      });
      document.addEventListener("click", (e: Event): void => func(e));
    },
  },
  {
    name: namePage.CREATEACCOUNT,
    classList: ["account__item", "account__create", "unactive"],
    innerHTML: `<img
              src="${imgProfile}"
              alt="create an account"
              title="create an account"
            />`,
    href: "/createaccount",
    callback: (): void => {
      const registration = new Registration();
      document.addEventListener("keyup", (e: Event): void => {
        e.preventDefault();
        const { target } = e;
        if (target) {
          registration.validationForm(target as HTMLInputElement);
        }
      });
      document.addEventListener("change", (e: Event): void => {
        e.preventDefault();
        const { target } = e;
        if (target) {
          if ((target as HTMLElement).tagName === "SELECT") {
            if ((target as HTMLElement).id === "billing_country") {
              const postcodeField: HTMLElement | null = document.getElementById(
                "billing_postal_code",
              );
              registration.validationForm(target as HTMLSelectElement);
              if (postcodeField)
                registration.validationForm(postcodeField as HTMLInputElement);
            } else if ((target as HTMLElement).id === "shipping_country") {
              const postcodeField: HTMLElement | null = document.getElementById(
                "shipping_postal_code",
              );
              registration.validationForm(target as HTMLSelectElement);
              if (postcodeField)
                registration.validationForm(postcodeField as HTMLInputElement);
            }
          } else if ((target as HTMLElement).tagName === "INPUT") {
            if ((target as HTMLElement).id === "birthdate") {
              registration.validationForm(target as HTMLInputElement);
            }
          }
        }
      });
      document.addEventListener("click", (event) => {
        event.stopImmediatePropagation();
        const { target } = event;
        if (target instanceof HTMLElement) {
          if (target.id === "sendCreatingAccount") {
            event.preventDefault();
            registration.submitForm(event);
          }
          if (target.id === "billing_address_checkbox") {
            setShippingDefault();
          }
          if (target.classList.contains("form__back-link")) {
            window.history.back();
          }
          if (target.classList.contains("registration__breadcrumbs-link")) {
            event.preventDefault();
            if (event instanceof MouseEvent) {
              routeforOtherLink(event);
            }
          }
          if (target.classList.contains("form__sign-in-link")) {
            event.preventDefault();
            if (event instanceof MouseEvent) {
              routeforOtherLink(event);
            }
          }
        }
      });
    },
  },
  {
    name: namePage.BASKET,
    classList: ["shoping_cart"],
    innerHTML: `<div class="shoping_cart__ico">
              <img src="${imgBascket}" alt="cart" />
            </div>`,
    href: "basket",
    callback: (): void => {},
  },
];

export const profileLinksOut: link[] = [
  {
    name: namePage.LOGIN,
    classList: ["account__item", "sigh-out"],
    innerHTML: `<svg 
              class="sigh-out"
              id="sighOutSVG"
              width="40px" height ="40px" version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="#ffffff" stroke="none">
<path d="M475 4618 c-11 -6 -25 -19 -32 -27 -10 -13 -12 -421 -13 -1838 l0
-1821 31 -26 c17 -14 37 -26 45 -26 8 0 333 -88 723 -195 757 -209 739 -205
775 -153 13 18 16 52 16 185 l0 163 431 0 c465 0 482 2 544 52 71 59 78 86 86
333 5 142 13 242 23 281 21 86 61 188 101 260 36 66 103 164 112 164 4 0 31
-27 61 -61 110 -121 265 -216 428 -261 73 -20 101 -22 399 -22 312 -1 321 0
362 21 131 70 163 237 66 344 -65 72 -70 73 -343 80 -178 5 -261 11 -305 23
-99 27 -219 93 -292 161 l-66 61 -87 320 c-48 175 -86 321 -84 323 6 7 112
-33 164 -62 30 -17 89 -64 131 -104 110 -105 175 -129 274 -102 53 15 129 91
144 144 30 109 1 174 -135 305 -115 111 -192 165 -299 210 -109 45 -191 60
-332 60 -145 0 -220 -13 -417 -75 -226 -70 -255 -89 -342 -221 -30 -46 -76
-101 -102 -123 -66 -57 -167 -108 -251 -127 -128 -29 -199 -104 -208 -217 -7
-79 8 -127 55 -179 67 -75 146 -95 298 -78 142 15 272 73 362 160 18 18 35 31
36 29 2 -2 25 -76 51 -165 l48 -161 -53 -64 c-104 -128 -181 -282 -228 -458
-24 -90 -26 -113 -30 -388 l-4 -293 -299 0 -299 0 -2 1570 c-3 1555 -3 1570
-23 1589 -14 13 -150 55 -425 130 -223 62 -409 113 -415 116 -5 2 344 4 778 4
l787 1 0 -203 0 -203 -56 -23 c-71 -30 -147 -104 -182 -178 -23 -50 -27 -71
-27 -153 0 -82 4 -103 27 -152 34 -73 103 -142 176 -176 50 -24 69 -27 157
-27 91 0 105 3 158 30 215 108 268 392 107 568 -45 50 -138 107 -174 107 -13
0 -15 37 -18 265 -3 260 -3 265 -26 287 l-23 23 -1172 2 c-871 2 -1177 0
-1192 -9z m760 -356 l610 -169 3 -1705 2 -1704 -482 132 c-266 74 -546 151
-623 172 l-140 39 -3 1701 c-2 1358 0 1702 10 1702 7 0 288 -76 623 -168z
m1653 -377 c75 -32 122 -103 122 -185 0 -138 -132 -233 -261 -188 -55 19 -88
49 -116 105 -21 44 -24 62 -19 100 18 135 154 218 274 168z m684 -654 c139
-36 255 -108 376 -234 65 -69 77 -101 46 -131 -31 -32 -61 -19 -151 64 -136
127 -299 198 -463 203 -67 2 -73 0 -96 -26 -13 -15 -24 -36 -24 -46 0 -9 49
-199 109 -421 l110 -403 63 -64 c81 -83 137 -124 234 -172 145 -73 198 -83
472 -90 242 -6 244 -6 263 -30 19 -24 18 -51 -3 -78 -8 -10 -80 -13 -298 -13
-251 0 -296 2 -362 19 -155 40 -280 123 -389 259 -81 101 -94 112 -137 112
-29 0 -43 -8 -76 -43 -140 -145 -246 -339 -297 -539 -17 -66 -22 -128 -28
-301 -6 -214 -6 -219 -30 -238 -30 -25 -52 -24 -86 3 l-27 21 5 256 c4 180 10
275 21 321 43 181 122 336 241 469 29 33 56 69 60 80 8 27 -163 599 -187 623
-20 20 -69 24 -98 8 -10 -5 -31 -33 -48 -62 -80 -142 -235 -228 -410 -228 -64
0 -76 3 -97 25 -54 53 -18 113 80 134 33 7 101 33 152 57 114 56 203 136 277
248 30 46 66 90 81 100 33 22 300 105 390 121 107 20 240 18 327 -4z"/>
<path d="M1430 2721 c-78 -24 -157 -99 -178 -169 -39 -130 14 -258 130 -316
95 -47 217 -30 291 42 78 75 102 165 73 266 -38 130 -190 215 -316 177z m131
-176 c19 -12 37 -68 32 -98 -7 -34 -56 -77 -88 -77 -58 0 -105 47 -105 104 0
31 43 84 73 88 23 4 68 -5 88 -17z"/>
</g>
</svg>
`,
    href: "/signout",
    callback: (): void => {
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      window.history.replaceState({}, "", "/");
      handleLocation();
      const newHeader = new HeaderView();
      const headerElement = newHeader.getHTMLElement();
      const header = document.querySelector("header");
      if (header && header.parentNode && headerElement) {
        header.parentNode.replaceChild(headerElement, header);
      }
    },
  },
  {
    name: namePage.PROFILE,
    classList: ["account__item", "account__create", "active"],
    innerHTML: `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="40px" height="40px" viewBox="0 0 64.000000 64.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
fill="#ffffff" stroke="none">
<path d="M300 601 c-8 -21 -21 -31 -46 -35 -39 -8 -42 -16 -13 -42 15 -14 20
-27 17 -52 -4 -32 -3 -33 21 -27 14 3 33 6 41 6 8 0 27 -3 41 -6 24 -6 25 -5
21 27 -3 25 2 38 17 52 29 26 26 34 -13 42 -25 4 -38 14 -46 35 -16 37 -24 37
-40 0z m35 -31 c3 -11 15 -20 26 -20 20 0 26 -15 9 -25 -5 -3 -10 -16 -10 -28
0 -19 -5 -22 -40 -22 -35 0 -40 3 -40 22 0 12 -4 25 -10 28 -17 10 -11 25 9
25 11 0 23 9 26 20 3 11 10 20 15 20 5 0 12 -9 15 -20z"/>
<path d="M135 540 c-4 -13 -15 -20 -31 -20 -26 0 -32 -21 -10 -39 8 -7 11 -22
8 -38 -4 -23 -2 -25 14 -18 10 4 26 8 34 8 8 0 24 -4 34 -8 16 -7 18 -5 14 18
-3 18 1 32 13 43 22 20 16 34 -15 34 -15 0 -26 7 -29 20 -3 11 -10 20 -15 20
-6 0 -14 -9 -17 -20z m25 -30 c0 -5 7 -10 16 -10 13 0 14 -3 4 -15 -6 -8 -9
-18 -6 -23 3 -5 -8 -9 -24 -9 -16 0 -27 4 -24 9 3 5 0 15 -6 23 -10 12 -9 15
4 15 9 0 16 5 16 10 0 6 5 10 10 10 6 0 10 -4 10 -10z"/>
<path d="M473 540 c-3 -13 -14 -20 -29 -20 -31 0 -37 -14 -15 -34 12 -11 16
-25 13 -43 -4 -23 -2 -25 14 -18 10 4 26 8 34 8 8 0 24 -4 34 -8 16 -7 18 -5
14 18 -3 16 0 31 8 38 22 18 16 39 -10 39 -16 0 -27 7 -31 20 -3 11 -11 20
-17 20 -5 0 -12 -9 -15 -20z m27 -30 c0 -5 7 -10 16 -10 13 0 14 -3 4 -15 -6
-8 -9 -18 -6 -23 3 -5 -8 -9 -24 -9 -16 0 -27 4 -24 9 3 5 0 15 -6 23 -10 12
-9 15 4 15 9 0 16 5 16 10 0 6 5 10 10 10 6 0 10 -4 10 -10z"/>
<path d="M58 411 c-7 -11 -21 -21 -32 -21 -18 0 -18 -1 -2 -19 9 -10 14 -25
11 -33 -5 -12 2 -15 34 -15 33 0 41 3 41 18 0 10 4 21 10 24 15 9 12 25 -4 25
-8 0 -22 10 -30 21 l-14 21 -14 -21z m32 -47 c0 -17 -26 -19 -36 -3 -7 12 15
31 28 23 4 -3 8 -12 8 -20z"/>
<path d="M552 410 c-7 -11 -19 -20 -27 -20 -17 0 -20 -16 -5 -25 6 -3 10 -14
10 -24 0 -15 8 -18 41 -18 32 0 39 3 34 15 -3 8 2 23 11 33 16 18 16 19 0 19
-10 0 -25 9 -34 20 l-17 21 -13 -21z m38 -41 c0 -12 -29 -24 -37 -16 -3 4 -3
13 0 21 6 16 37 11 37 -5z"/>
<path d="M295 405 c-5 -2 -22 -6 -37 -9 -33 -8 -94 -59 -112 -95 -33 -65 -27
-144 16 -207 28 -41 108 -84 158 -84 20 0 58 11 86 25 145 73 145 279 -1 353
-23 11 -95 23 -110 17z m83 -29 c85 -30 136 -126 112 -211 -7 -25 -16 -48 -21
-50 -4 -3 -21 8 -37 25 -19 18 -41 30 -57 30 l-26 0 20 26 c23 29 36 83 27
112 -4 10 -18 24 -32 30 -33 16 -97 15 -112 0 -21 -21 -14 -92 13 -132 l24
-36 -25 0 c-15 0 -38 -12 -56 -30 -16 -17 -33 -28 -37 -25 -5 2 -14 25 -21 50
-30 106 59 223 170 223 14 0 40 -5 58 -12z m-17 -56 c40 -22 22 -36 -43 -33
-69 3 -76 6 -58 28 14 17 72 20 101 5z m4 -80 c0 -16 -9 -29 -28 -40 -27 -14
-29 -14 -53 14 -32 36 -20 52 38 51 38 -1 43 -4 43 -25z m-35 -84 c0 -8 -4
-18 -10 -21 -5 -3 -10 -4 -10 -1 0 2 -3 11 -6 20 -4 11 -1 16 10 16 9 0 16 -6
16 -14z m-40 -26 c6 -11 20 -20 31 -20 12 0 23 8 26 20 11 42 99 5 91 -38 -10
-50 -135 -73 -199 -36 -41 24 -47 46 -20 73 27 27 57 27 71 1z"/>
</g>
</svg>`,
    href: "/profile",
    callback: async (): Promise<void> => {
      console.log(
        document.querySelector(".profile__link.profile__link--active"),
      );
      const id: string | null = localStorage.getItem("id");
      console.log(id);
      if (id) {
        const getUserData = await getUserById(id)
          .then((res) => {
            if (res.statusCode !== 400) {
              const {
                firstName,
                lastName,
                dateOfBirth,
                email,
                password,
                version,
                addresses,
                defaultShippingAddressId,
                defaultBillingAddressId,
                shippingAddressIds,
                billingAddressIds,
              } = res.body;
              if (
                firstName &&
                lastName &&
                dateOfBirth &&
                email &&
                password &&
                version &&
                addresses &&
                shippingAddressIds &&
                billingAddressIds
              ) {
                const profilePage = new Profile(
                  id,
                  firstName,
                  lastName,
                  dateOfBirth,
                  email,
                  version,
                  addresses as Address[],
                  shippingAddressIds,
                  billingAddressIds,
                  defaultShippingAddressId,
                  defaultBillingAddressId,
                );
                profilePage.init();
              }
            }
          })
          .catch((err) => console.log(err));
        console.log(getUserData);
      }
    },
  },
  {
    name: namePage.BASKET,
    classList: ["shoping_cart"],
    innerHTML: `<div class="shoping_cart__ico">
              <img src="${imgBascket}" alt="cart" />
            </div>`,
    href: "basket",
    callback: (): void => {},
  },
];

export const pages: link[] = [
  {
    name: namePage.MAIN,
    href: "/",
    callback: (): void => {},
  },
  {
    name: namePage.ABOUT,
    href: "/about",
    callback: (): void => {},
  },
  {
    name: namePage.CATALOG,
    href: "/catalog",
    callback: (): void => {
      const catalog = new Catalog();
      catalog.init();
    },
  },
];

export const product: link[] = productKeys.map((data) => ({
  name: namePage.PRODUCT,
  href: `/product__${data}`,
  callback: (key?: string): void => {
    if (key) {
      Product.init(`${key}`);
    } else {
      Product.init("");
    }
  },
}));
