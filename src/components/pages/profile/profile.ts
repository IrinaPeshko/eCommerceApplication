import { Address } from "@commercetools/platform-sdk";
import {
  FieldTypes,
  UpdateData,
  Actions,
  UpdateEmail,
  Obj,
  Tuple
} from "../../../types/types";
import Validate from "../../utils/validation";
import {
  updateCustomer,
  updateCustomerEmail,
  changeCustomerPassword,
  addAddress,
} from "../../../sdk/sdk";
import NewAddress from "./createAddress";
import { createaAddressTemplate } from "./templates";
import Aside from "../../aside/aside";
import randomKeyGenerator from "../../utils/randomKeyGenerator";
import Alert from "../../alerts/alert";
import { Emitter } from "../../utils/eventEmitter";

export default class Profile {
  private activeAsideTab: HTMLElement | null;

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
    this.activeAsideTab = null;
    Emitter.on("updateVersionFromAside", (versionFromAside: number): void => {
      this.version = versionFromAside;
    });
    Emitter.on("updateAllAddressesShipping", (shippingIds: string[], defaultShippingId: string): void => {
      this.shippingAddressIds = shippingIds;
      this.defaultShippingAddressId = defaultShippingId;
      this.updateAddresses();
    });
    Emitter.on("updateAllAddressesBilling", (billingIds: string[], defaultBillingId: string): void => {
      this.billingAddressIds = billingIds;
      this.defaultShippingAddressId = defaultBillingId;
      this.updateAddresses();
    });
  }

  public setUserData(): void {
    const firstNameField: HTMLElement | null =
      document.getElementById("profile_name");
    const lastNameField: HTMLElement | null =
      document.getElementById("profile_last-name");
    const birthdateField: HTMLElement | null =
      document.getElementById("profile_birthdate");
    const emailField: HTMLElement | null =
      document.getElementById("profile_email");

    if (firstNameField) {
      (firstNameField as HTMLInputElement).value = this.firstName;
    }
    if (lastNameField) {
      (lastNameField as HTMLInputElement).value = this.lastName;
    }
    if (birthdateField) {
      (birthdateField as HTMLInputElement).value = this.dateOfBirth;
    }
    if (emailField) {
      (emailField as HTMLInputElement).value = this.email;
    }
  }

  private updateAddresses(): void {
    const shippingAddressesBlock: HTMLDivElement | null =
      document.querySelector(".profile__shipping-addresses");
    const billingAddressesBlock: HTMLDivElement | null = document.querySelector(
      ".profile__billing-addresses",
    );
    const addressesWrapper: HTMLDivElement | null = document.querySelector(
      ".profile__addresses-wrapper",
    );
    if (shippingAddressesBlock && billingAddressesBlock && addressesWrapper) {
      shippingAddressesBlock.innerHTML = "";
      billingAddressesBlock.innerHTML = "";
      this.addresses.forEach((address, idx) => {
        const elemID = idx;
        const newAddress = new NewAddress(
          this.version,
          this.id,
          address,
          elemID,
          this.shippingAddressIds,
          this.billingAddressIds,
          this.defaultShippingAddressId ? this.defaultShippingAddressId : undefined,
          this.defaultBillingAddressId ? this.defaultBillingAddressId : undefined
        );
        if (address.id) {
          if (this.shippingAddressIds.indexOf(address.id) !== -1) {
            if (address.id === this.defaultShippingAddressId) {
              shippingAddressesBlock.prepend(newAddress.createAddress());
            } else {
              shippingAddressesBlock.append(newAddress.createAddress());
            }
          } else if (this.billingAddressIds.indexOf(address.id) !== -1) {
            if (address.id === this.defaultBillingAddressId) {
              billingAddressesBlock.prepend(newAddress.createAddress());
            } else {
              billingAddressesBlock.append(newAddress.createAddress());
            }
          } else {
            addressesWrapper.append(newAddress.createAddress());
          }
        }
      });
    }
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
    const saveBtn: HTMLButtonElement | null =
      document.querySelector(".profile__save-btn");
    const addBtn: HTMLButtonElement | null =
      document.querySelector(".profile__add-btn");
    const profileSaveBtn: HTMLElement | null =
      document.getElementById("account_btn");
    const tabs: NodeListOf<HTMLElement> =
      document.querySelectorAll(".profile__link");
    const panels: NodeListOf<HTMLElement> =
      document.querySelectorAll(".profile__data");
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
            )
              this.editMode();
          },
        );
      });
    }
    if (saveBtn)
      saveBtn.addEventListener("click", (e: MouseEvent) => {
        e.preventDefault();
        this.savePersonalData();
      });
    if (profileSaveBtn)
      (profileSaveBtn as HTMLButtonElement).addEventListener(
        "click",
        (e: MouseEvent): void => {
          e.preventDefault();
          this.saveAccountData();
        },
      );
    if (addBtn) {
      addBtn.addEventListener("click", (e: Event) => {
        e.preventDefault();
        this.addNewAddress();
      });
    }
    if (tabs) {
      Array.prototype.forEach.call(tabs, (tab) => {
        tab.addEventListener("click", (e: Event) => {
          e.preventDefault();
          const activeTab: HTMLElement | null = document.querySelector(
            ".profile__item > [aria-selected]",
          );
          if (e.target !== activeTab) {
            if (activeTab)
              this.switchTab(
                e.target as HTMLElement,
                activeTab,
                tabs,
                panels,
                "profile__link--active",
              );
          }
        });
      });
    }
    this.setUserData();
    this.updateAddresses();
  }

  private editMode(): void {
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
        const fieldsArr: NodeListOf<Element> =
          activePage.querySelectorAll(".form__field");
        const checkboxesWrapper: HTMLDivElement | null =
          activePage.querySelector(".form__checkboxes-wrapper");
        const saveBtn: HTMLButtonElement | null =
          activePage.querySelector(".profile__save-btn");
        fieldsArr.forEach((elem) => {
          if ((elem as HTMLInputElement).readOnly === true) {
            (elem as HTMLInputElement).readOnly = false;
          } else {
            (elem as HTMLInputElement).readOnly = true;
          }
        });
        if (checkboxesWrapper) {
          if (
            checkboxesWrapper.classList.contains(
              "form__checkboxes-wrapper--hidden",
            )
          )
            checkboxesWrapper.classList.remove(
              "form__checkboxes-wrapper--hidden",
            );
          else
            checkboxesWrapper.classList.add("form__checkboxes-wrapper--hidden");
        }
        if (saveBtn) {
          if (saveBtn.classList.contains("profile__save-btn--hidden"))
            saveBtn.classList.remove("profile__save-btn--hidden");
          else saveBtn.classList.add("profile__save-btn--hidden");
        }
      }
    }
  }

  public async savePersonalData(): Promise<void> {
    const firstNameField: HTMLElement | null =
      document.getElementById("profile_name");
    const lastNameField: HTMLElement | null =
      document.getElementById("profile_last-name");
    const birthdateField: HTMLElement | null =
      document.getElementById("profile_birthdate");
    const updateArr: UpdateData[] = [];
    if (firstNameField && lastNameField && birthdateField) {
      if (
        (firstNameField as HTMLInputElement).value === this.firstName &&
        (lastNameField as HTMLInputElement).value === this.lastName &&
        (birthdateField as HTMLInputElement).value === this.dateOfBirth
      ) {
        this.editMode();
      } else {
        if ((firstNameField as HTMLInputElement).value !== this.firstName) {
          updateArr.push({
            action: Actions.firstname,
            firstName: `${(firstNameField as HTMLInputElement).value}`,
          });
        }
        if ((lastNameField as HTMLInputElement).value !== this.lastName) {
          updateArr.push({
            action: Actions.lastname,
            lastName: `${(lastNameField as HTMLInputElement).value}`,
          });
        }
        if ((birthdateField as HTMLInputElement).value !== this.dateOfBirth) {
          updateArr.push({
            action: Actions.dateofbirth,
            dateOfBirth: `${(birthdateField as HTMLInputElement).value}`,
          });
        }
        const update = await updateCustomer(this.id, updateArr, this.version)
          .then((res) => {
            if (res.statusCode !== 400) {
              const { firstName, lastName, dateOfBirth, version } = res.body;
              if (firstName && lastName && dateOfBirth) {
                this.version = version;
                Emitter.emit("updateVersion", this.version);
                this.firstName = firstName;
                this.lastName = lastName;
                this.dateOfBirth = dateOfBirth;
              }
              Alert.showAlert(false, "Personal data successfully updated");
              this.setUserData();
              this.editMode();
            } else {
              Alert.showAlert(true, "Personal data not updated");
              throw new Error("Personal data not changed");
            }
          })
          .catch((err) => console.log(err));
        console.log(update);
      }
    }
  }

  private addNewAddress(): void {
    Aside.openAside(this.createNewAddressTemplate());
    const asideElem: HTMLElement | null = document.querySelector(".aside");
    if (asideElem) {
      const asideTabs: NodeListOf<HTMLElement> =
        asideElem.querySelectorAll(".aside__link");
      const asidePanels: NodeListOf<HTMLElement> =
        asideElem.querySelectorAll(".aside__panel");
      this.activeAsideTab = asideElem.querySelector(
        ".aside__item > [aria-selected]",
      );
      if (asideTabs) {
        Array.prototype.forEach.call(asideTabs, (asideTab) => {
          asideTab.addEventListener("click", (e: Event) => {
            e.preventDefault();
            randomKeyGenerator();
            const activeTab: HTMLElement | null = this.activeAsideTab;
            if (e.target !== activeTab) {
              if (activeTab) {
                this.switchTab(
                  e.target as HTMLElement,
                  activeTab,
                  asideTabs,
                  asidePanels,
                  "aside__link--active",
                );
              }
            }
          });
        });
      }
      asideElem.addEventListener("click", (e: Event): void => {
        e.preventDefault();
        e.stopPropagation();
        if ((e.target as HTMLElement).tagName === "BUTTON") {
          if (
            (e.target as HTMLElement).dataset.action === "saveshippingaddress"
          ) {
            this.addAddressAction("shipping");
          } else if (
            (e.target as HTMLElement).dataset.action === "savebillingaddress"
          ) {
            this.addAddressAction("billing");
          }
        }
      });
    }
  }

  private async addAddressAction(addressType: string): Promise<void> {
    if (this.activeAsideTab) {
      const activeAsidePage: HTMLElement | null = document.querySelector(
        `.aside__content > [aria-labelledby = ${this.activeAsideTab.id}]`,
      );
      if (activeAsidePage) {
        const form: HTMLFormElement | null =
          activeAsidePage.querySelector(".aside__form");
        const addressData: Obj = {};
        if (form) {
          const fields: NodeListOf<Element> = form.querySelectorAll(
            ".form__field[required]",
          );
          if (fields) {
            const fieldsArr: Element[] = Array.from(fields);
            if (
              fieldsArr.every((elem): boolean =>
                elem.classList.contains("valid"),
              )
            ) {
              const data = new FormData(form);
              for (const val of data.entries()) {
                const key: string = val[0];
                const newVal: string = val[1] as string;
                addressData[`${key}`] = newVal;
              }
              const {
                countryCode,
                streetName,
                building,
                apartment,
                city,
                postalCode,
              } = addressData;
              const newKey: string = randomKeyGenerator();
              const newAddressObj: Tuple = [
                {
                  action: Actions.addaddress,
                  address: {
                    key: newKey,
                    country: countryCode,
                    city,
                    postalCode,
                    streetName,
                    building,
                    apartment,
                  },
                },
                addressType === "shipping"
                  ? { action: Actions.addshippingaddress, addressKey: newKey }
                  : { action: Actions.addbillingaddress, addressKey: newKey },
              ];
              try {
                const res = await addAddress(
                  this.version,
                  this.id,
                  newAddressObj,
                );
                if (res.statusCode !== 400) {
                  Aside.closeAside();
                  Alert.showAlert(false, "New address successfully added");
                  const {
                    addresses,
                    shippingAddressIds,
                    billingAddressIds,
                    version,
                  } = res.body;
                  if (addresses && shippingAddressIds && billingAddressIds) {
                    this.version = version;
                    this.addresses = addresses;
                    this.shippingAddressIds = shippingAddressIds;
                    this.billingAddressIds = billingAddressIds;
                    Emitter.emit("updateVersion", this.version);
                    this.updateAddresses();
                  }
                } else {
                  Alert.showAlert(true, "New address not added");
                  throw new Error("Something is wrong");
                }
              } catch (err) {
                console.log(err);
              }
            } else {
              fieldsArr
                .filter((elem) => !elem.classList.contains("valid"))
                .forEach((elem) => {
                  this.validationForm(
                    (elem as HTMLInputElement) || (elem as HTMLSelectElement),
                  );
                });
            }
          }
        }
      }
    }
  }

  private saveAccountData(): void {
    const emailCheckbox: HTMLElement | null = document.getElementById(
      "profile_change_email",
    );
    const passwordCheckbox: HTMLElement | null = document.getElementById(
      "profile_change_password",
    );
    if ((emailCheckbox as HTMLInputElement).checked) {
      this.changeEmail();
    }
    if ((passwordCheckbox as HTMLInputElement).checked) {
      this.changePassword();
    }
  }

  private async changeEmail(): Promise<void> {
    const emailField: HTMLElement | null =
      document.getElementById("profile_email");
    const updateEmail: UpdateEmail[] = [];
    if (emailField) {
      if ((emailField as HTMLInputElement).value !== this.email) {
        updateEmail.push({
          action: Actions.email,
          email: `${(emailField as HTMLInputElement).value}`,
        });
        const updateToNewEmail = await updateCustomerEmail(
          this.id,
          updateEmail,
          this.version,
        )
          .then((res) => {
            if (res.statusCode !== 400) {
              Alert.showAlert(false, "Email successfully updated");
              const { email, version } = res.body;
              this.version = version;
              Emitter.emit("updateVersion", this.version);
              this.email = email;
              this.editMode();
            } else {
              Alert.showAlert(true, "Email not updated");
              throw new Error("Email not be added");
            }
          })
          .catch((err) => console.log(err));
        console.log(updateToNewEmail);
      }
    }
  }

  private async changePassword(): Promise<void> {
    const currentPassword: HTMLElement | null = document.getElementById(
      "profile_curr_password",
    );
    const newPassword: HTMLElement | null = document.getElementById(
      "profile_new_password",
    );
    const currentPasswordVal: string = (currentPassword as HTMLInputElement)
      .value;
    const newPasswordVal: string = (newPassword as HTMLInputElement).value;
    const updateToNewPassword = await changeCustomerPassword(
      this.id,
      currentPasswordVal,
      newPasswordVal,
      this.version,
    )
      .then((res) => {
        if (res.statusCode !== 400) {
          Alert.showAlert(false, "Password succesfully changed");
          const { version } = res.body;
          this.version = version;
          Emitter.emit("updateVersion", this.version);
        } else {
          Alert.showAlert(true, "Password not changed");
          throw new Error("Password not changed");
        }
      })
      .catch((err) => console.log(err));
    console.log(updateToNewPassword);
  }

  private switchTab(
    currTab: HTMLElement,
    prevTab: HTMLElement,
    tabs: NodeListOf<HTMLElement>,
    panels: NodeListOf<HTMLElement>,
    activeClass: string,
  ): void {
    currTab.focus();
    currTab.classList.add(activeClass);
    currTab.removeAttribute("tabindex");
    currTab.setAttribute("aria-selected", "true");
    prevTab.classList.remove(activeClass);
    prevTab.removeAttribute("aria-selected");
    prevTab.setAttribute("tabindex", "-1");
    const currIdx: number = Array.prototype.indexOf.call(tabs, currTab);
    const oldIdx: number = Array.prototype.indexOf.call(tabs, prevTab);
    panels[oldIdx].hidden = true;
    panels[currIdx].hidden = false;
    if (activeClass === "aside__link--active") {
      this.activeAsideTab = currTab;
    }
  }

  private createNewAddressTemplate(): string {
    return `
    <nav class="aside__nav">
      <ul role="tablist" class="aside__list">
          <li role="presentation" class="aside__item">
              <a role="tab" href="#shipping" id="tab-1" class="aside__link aside__link--active" aria-selected="true">Shipping Address</a>
          </li>
          <li role="presentation" class="aside__item">
              <a role="tab" href="#billing" id="tab-2" class="aside__link" tabindex="-1">Billing Address</a>
          </li>
      </ul>
    </nav>
    <section class="aside__panel" id="shipping" role="tabpanel" aria-labelledby="tab-1">${createaAddressTemplate(
      "Add Shipping Address",
      "saveshippingaddress",
    )}</section>
    <section class="aside__panel" id="billing" role="tabpanel" aria-labelledby="tab-2" hidden>${createaAddressTemplate(
      "Add Billing Address",
      "savebillingaddress",
    )}</section>
    `;
  }
}
// TODO:
// скрывать при изменении email\пароль и сбрасывать классы и чекбоксы;