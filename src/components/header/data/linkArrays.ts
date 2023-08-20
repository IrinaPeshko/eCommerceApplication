import link from "../../../types/link/Ilink";
import imgBascket from "../../../assets/icons/bascket.png";
import imgProfile from "../../../assets/icons/8324223_ui_essential_app_avatar_profile_icon.svg";
// import { registerUser } from "../../../sdk/sdk";
import Registration from "../../pages/registration/registration";
import setBillingDefault from "../../pages/registration/select default address checkbox/setDefaultBilling";
import setShippingDefault from "../../pages/registration/select default address checkbox/setDefaultShipping";
import Login from "../../pages/login/login";

const namePage = {
  MAIN: "MAIN",
  LOGIN: "LOG IN",
  CREATEACCOUNT: "CREATE ACCOUNT",
  CATALOG: "CATALOG",
  USER: "USER",
  BASKET: "BASKET",
  ABOUT: "ABOUT US",
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
              login.signIn();
            }
          } else if ((target as HTMLElement).tagName === "A") {
            event.preventDefault();
            window.location.href = "/createaccount";
          }
        }
      };
      document.addEventListener("input", (e: Event): void => {
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
      document.addEventListener("input", (e: Event): void => {
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
            console.log("SELECVT");
            registration.validationSelect(target as HTMLSelectElement);
          }
        }
      });
      document.addEventListener("click", (event) => {
        event.stopImmediatePropagation();
        const { target } = event;
        if (target instanceof HTMLElement) {
          if (target.id === "sendCreatingAccount") {
            event.preventDefault();
            registration.submitForm();
          } else if (target.id === "default_billing_checkbox") {
            setBillingDefault();
          } else if (target.id === "default_shipping_checkbox") {
            setShippingDefault();
          } else if (target.classList.contains("form__back-link")) {
            window.history.back();
          } else if (target.classList.contains("form__sign-in-link")) {
            window.location.href = "/login";
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
    callback: (): void => {
      console.log("click");
    },
  },
];

export const pages: link[] = [
  {
    name: namePage.MAIN,
    href: "/",
    callback: (): void => {
      console.log("click");
    },
  },
  {
    name: namePage.ABOUT,
    href: "/about",
    callback: (): void => {
      console.log("click");
    },
  },
  {
    name: namePage.CATALOG,
    href: "/catalog",
    callback: (): void => {
      console.log("click");
    },
  },
];
