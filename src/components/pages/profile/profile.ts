import { Address } from "@commercetools/platform-sdk";
import { FieldTypes } from "../../../types/types";
import Validate from "../../utils/validation";
import { Emitter } from "../../utils/eventEmitter";
import Personal from "./personal";
import Account from "./account";
import AddressElem from "./address";
import switchTab from "../../utils/switchTab";
import showPassword from "../../utils/showPassword";

export default class Profile {
  constructor(
    private id: string,
    private firstName: string,
    private lastName: string,
    private dateOfBirth: string,
    private email: string,
    private version: number,
    private addresses: Address[],
    private shippingAddressIds: string[],
    private billingAddressIds: string[],
    private defaultShippingAddressId?: string | undefined,
    private defaultBillingAddressId?: string | undefined,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.email = email;
    this.version = version;
    this.addresses = addresses;
    this.defaultShippingAddressId = defaultShippingAddressId;
    this.defaultBillingAddressId = defaultBillingAddressId;
    this.shippingAddressIds = shippingAddressIds;
    this.billingAddressIds = billingAddressIds;
    // Emitter.on("updateVersionFromAside", (versionFromAside: number): void => {
    //   this.version = versionFromAside;
    // });
    Emitter.on(
      "updatePersonalData",
      (
        personalVersion: number,
        personalFirstName: string,
        personalLastName: string,
        personalDateOfBirth: string,
      ): void => {
        this.version = personalVersion;
        this.firstName = personalFirstName;
        this.lastName = personalLastName;
        this.dateOfBirth = personalDateOfBirth;
      },
    );
    Emitter.on(
      "updateEmail",
      (accountEmail: string, accountVersion: number): void => {
        this.version = accountVersion;
        this.email = accountEmail;
      },
    );
    Emitter.on("updateCurrComponent", (currPage: HTMLElement) => {
      this.loadCurrPage(currPage);
    });
    Emitter.on(
      "updateAddressData",
      (
        addressVersion: number,
        addressAddresses: Address[],
        addressShippingAddressIds: string[],
        addressBillingAddressIds: string[],
      ) => {
        this.version = addressVersion;
        this.addresses = addressAddresses;
        this.shippingAddressIds = addressShippingAddressIds;
        this.billingAddressIds = addressBillingAddressIds;
      },
    );
    Emitter.on(
      "updateAllAddressesShipping",
      (
        shippingVersion: number,
        shippingIds: string[],
        defaultShippingId: string,
      ): void => {
        this.version = shippingVersion;
        this.shippingAddressIds = shippingIds;
        this.defaultShippingAddressId = defaultShippingId;
      },
    );
    Emitter.on(
      "updateAllAddressesBilling",
      (
        billingVersion: number,
        billingIds: string[],
        defaultBillingId: string,
      ): void => {
        this.version = billingVersion;
        this.billingAddressIds = billingIds;
        this.defaultBillingAddressId = defaultBillingId;
      },
    );
    Emitter.on(
      "changeAdressFromAside",
      (changeVersion: number, changeAddresses: Address[]) => {
        this.version = changeVersion;
        this.addresses = changeAddresses;
      },
    );
    Emitter.on(
      "removeAddress",
      (
        changeVersion: number,
        changeAddresses: Address[],
        changeBillingAddressIds: string[],
        changeShippingAddressIds: string[],
        changeDefaultBillingAddressId: string | undefined,
        changeDefaultShippingAddressId: string | undefined,
      ) => {
        this.version = changeVersion;
        this.addresses = changeAddresses;
        this.billingAddressIds = changeBillingAddressIds;
        this.shippingAddressIds = changeShippingAddressIds;
        this.defaultBillingAddressId = changeDefaultBillingAddressId;
        this.defaultShippingAddressId = changeDefaultShippingAddressId;
      },
    );
  }

  public validationForm(target: HTMLInputElement): void {
    const forms: NodeListOf<HTMLFormElement> =
      document.querySelectorAll(".profile__form");
    const validate = new Validate(target);
    forms.forEach((form) => {
      if (form) {
        form.noValidate = true;
        if (target.tagName === "INPUT") {
          if (target.id === "password") {
            validate.validatePassword();
          } else if (target.type === FieldTypes.Text) {
            validate.validateText();
          } else if (
            target.type === FieldTypes.Password ||
            target.name === "password"
          ) {
            validate.validatePassword();
          } else if (target.type === FieldTypes.Email) {
            validate.validateEmail();
          } else if (target.type === FieldTypes.Date) {
            validate.validateAge();
          }
        }
      }
    });
  }

  public init(): void {
    const editBtn: NodeListOf<Element> = document.querySelectorAll(".edit-btn");
    const tabs: NodeListOf<HTMLElement> =
      document.querySelectorAll(".profile__link");
    const panels: NodeListOf<HTMLElement> =
      document.querySelectorAll(".profile__data");
    const initialActiveTab: HTMLElement | null = document.querySelector(
      ".profile__item > [aria-selected]",
    );
    if (initialActiveTab) {
      const initialPage: HTMLElement | null = document.querySelector(
        `.profile__border-wrapper > [aria-labelledby = ${initialActiveTab.id}]`,
      );
      if (initialPage) this.loadCurrPage(initialPage);
    }
    document.addEventListener("keyup", (e: Event): void => {
      e.preventDefault();
      const { target } = e;
      if (target) {
        this.validationForm(target as HTMLInputElement);
      }
    });
    document.addEventListener("change", (e: Event): void => {
      const { target } = e;
      if (target) {
        this.validationForm(target as HTMLInputElement);
      }
    });
    if (editBtn) {
      editBtn.forEach((btn) => {
        (btn as HTMLButtonElement).addEventListener(
          "click",
          (e: MouseEvent): void => {
            e.preventDefault();
            if (
              !(btn as HTMLButtonElement).classList.contains(
                "address__edit-btn",
              )
            ) {
              this.editMode(e.target as HTMLButtonElement);
            }
          },
        );
      });
    }
    if (tabs) {
      Array.prototype.forEach.call(tabs, (tab) => {
        tab.addEventListener("click", (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          const activeTab: HTMLElement | null = document.querySelector(
            ".profile__item > [aria-selected]",
          );
          if (e.target !== activeTab) {
            if (activeTab) {
              switchTab(
                e.target as HTMLElement,
                activeTab,
                tabs,
                panels,
                "profile__link--active",
              );
              const activePage: HTMLElement | null = document.querySelector(
                `.profile__border-wrapper > [aria-labelledby = ${
                  (e.target as HTMLElement).id
                }]`,
              );
              if (activePage) {
                this.loadCurrPage(activePage);
              }
            }
          }
        });
      });
    }
  }

  private editMode(target: HTMLButtonElement): void {
    const activeLink: Element | null = document.querySelector(
      ".profile__item > [aria-selected]",
    );
    if (activeLink) {
      const activePage: HTMLElement | null = document.querySelector(
        `.profile__border-wrapper > [aria-labelledby = ${
          (activeLink as HTMLElement).id
        }]`,
      );
      if (activePage) {
        if (target) {
          const formElem: HTMLFormElement | null =
            target.closest(".profile__form");
          if (formElem) {
            const fieldsArr: NodeListOf<Element> =
              formElem.querySelectorAll(".form__field");
            const saveBtn: HTMLButtonElement | null =
              formElem.querySelector(".profile__save-btn");
            fieldsArr.forEach((elem) => {
              if ((elem as HTMLInputElement).readOnly === true) {
                (elem as HTMLInputElement).readOnly = false;
              } else {
                (elem as HTMLInputElement).readOnly = true;
                (elem as HTMLInputElement).classList.remove("valid");
                (elem as HTMLInputElement).classList.remove("invalid");
              }
            });
            if (saveBtn) {
              if (saveBtn.classList.contains("profile__save-btn--hidden"))
                saveBtn.classList.remove("profile__save-btn--hidden");
              else saveBtn.classList.add("profile__save-btn--hidden");
            }
          }
        }
      }
    }
  }

  private loadCurrPage(currpage: HTMLElement): void {
    currpage.innerHTML = "";
    const currPageAttr: string | null =
      currpage.getAttribute("aria-labelledby");
    if (currPageAttr) {
      switch (currPageAttr) {
        case "tab1":
          currpage.append(
            new Personal(
              this.firstName,
              this.lastName,
              this.dateOfBirth,
              this.id,
              this.version,
            ).createPersonal(),
          );
          break;
        case "tab2":
          currpage.append(
            new Account(this.email, this.id, this.version).createAccount(),
          );
          showPassword();
          break;
        case "tab3":
          currpage.append(
            new AddressElem(
              this.addresses,
              this.shippingAddressIds,
              this.billingAddressIds,
              this.id,
              this.version,
              this.defaultShippingAddressId,
              this.defaultBillingAddressId,
            ).createAccount(),
          );
          Emitter.emit("addressLoad");
          break;
        default:
          break;
      }
    }
  }
}
// TODO:
// скрывать при изменении email\пароль и сбрасывать классы и чекбоксы;
