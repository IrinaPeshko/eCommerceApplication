// можно через expand подтянуть данные родительской категории
// `categories().get({
//         queryArgs: {
//           expand: ['parent']
//         }
//       })`
import { FieldTypes, UpdateData, Actions, UpdateEmail, ResponseAddress } from "../../../types/types";
import Validate from "../../utils/validation";
import { updateCustomer, updateCustomerEmail, changeCustomerPassword } from "../../../sdk/sdk";
import NewAddress from "./createAddress";

export default class Profile {
  constructor(private id: string, private firstName: string, private lastName: string,
    private dateOfBirth: string, private email: string, private password: string, private version: number, private addresses: ResponseAddress[],
    private shippingAddressIds: string[], private billingAddressIds: string[], private defaultShippingAddressId: string | undefined,
    private defaultBillingAddressId?: string | undefined) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.email = email;
    this.password = password;
    this.version = version;
    this.addresses = addresses;
    this.defaultShippingAddressId = defaultShippingAddressId;
    this.defaultBillingAddressId = defaultBillingAddressId;
    this.shippingAddressIds = shippingAddressIds;
    this.billingAddressIds = billingAddressIds;
  }

  private setUserData(): void {
    const firstNameField: HTMLElement | null = document.getElementById("profile_name");
    const lastNameField: HTMLElement | null = document.getElementById("profile_last-name");
    const birthdateField: HTMLElement | null = document.getElementById("profile_birthdate");
    const emailField: HTMLElement | null = document.getElementById("profile_email");
    const shippingAddressesBlock: HTMLDivElement | null = document.querySelector(".profile__shipping-addresses");
    const billingAddressesBlock: HTMLDivElement | null = document.querySelector(".profile__billing-addresses");

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
    if (shippingAddressesBlock && billingAddressesBlock) {
      this.addresses.forEach(address => {
        const newAddress = new NewAddress(address);
        if (this.shippingAddressIds.indexOf(address.id) !== -1) {
          if (this.defaultShippingAddressId) {
            if (address.id === this.defaultShippingAddressId) {
              shippingAddressesBlock.prepend(newAddress.createAddress());
            } else {
              shippingAddressesBlock.append(newAddress.createAddress());
            }
          }
        } else if (this.billingAddressIds.indexOf(address.id) !== -1) {
          if (this.defaultBillingAddressId) {
            if (address.id === this.defaultBillingAddressId) {
              billingAddressesBlock.prepend(newAddress.createAddress());
            } else {
              billingAddressesBlock.append(newAddress.createAddress());
            }
          }
        }
      })
    }
  }

public validationForm(target: HTMLInputElement) {
  const form: HTMLFormElement | null = document.querySelector(".login__form");
    if (form) form.noValidate = true;
    const validate = new Validate(target);
    if (target.tagName === "INPUT") {
      if (target.type === FieldTypes.Text) {
        validate.validateText();
      } else if (
        target.type === FieldTypes.Date) {
        validate.validateAge();
      }
    }
}

public init(): void {
  const editBtn: NodeListOf<Element> = document.querySelectorAll(".edit-btn");
  const saveBtn: HTMLButtonElement | null = document.querySelector(".profile__save-btn");
  const profileSaveBtn: HTMLElement | null = document.getElementById("account_btn");
  const tabs: NodeListOf<HTMLElement> = document.querySelectorAll(".profile__link");
  const panels: NodeListOf<HTMLElement> = document.querySelectorAll(".profile__data");
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
    editBtn.forEach(btn => {
      (btn as HTMLButtonElement).addEventListener("click", (e: MouseEvent): void => {
          e.preventDefault();
          this.editMode();
      });
    })
  }
  if (saveBtn) saveBtn.addEventListener("click", (e: MouseEvent) => {
    e.preventDefault();
    this.savePersonalData();
  });
  if (profileSaveBtn) (profileSaveBtn as HTMLButtonElement).addEventListener("click", (e: MouseEvent): void => {
    e.preventDefault();
    this.saveAccountData();
  })
  if (tabs) {
    Array.prototype.forEach.call(tabs, (tab) => {
      tab.addEventListener("click", (e: Event) => {
        e.preventDefault();
        const activeTab: HTMLElement | null = document.querySelector("[aria-selected]");
        if (e.target !== activeTab) {
          if (activeTab) this.switchTab(e.target as HTMLElement, activeTab, tabs, panels);
        }
      })
    })
  }
  this.setUserData();
}

  private editMode(): void {
    const activeLink: Element | null = document.querySelector("[aria-selected]");
    if (activeLink) {
      const activePage: HTMLElement | null = document.querySelector(`[aria-labelledby = ${(activeLink as HTMLElement).id}]`);
      if (activePage) {
        const fieldsArr: NodeListOf<Element> = activePage.querySelectorAll(".form__field");
        const saveBtn: HTMLButtonElement | null = activePage.querySelector(".profile__save-btn");
        fieldsArr.forEach(elem => {
          if ((elem as HTMLInputElement).readOnly === true) {
            (elem as HTMLInputElement).readOnly = false;
          } else {
            (elem as HTMLInputElement).readOnly = true;
          }
        })
        if (saveBtn) {
          if ((saveBtn ).classList.contains("profile__save-btn--hidden"))
            (saveBtn ).classList.remove("profile__save-btn--hidden");
          else
            (saveBtn ).classList.add("profile__save-btn--hidden");
        }
      }
    }
  }

  public async savePersonalData(): Promise<void> {
    const firstNameField: HTMLElement | null = document.getElementById("profile_name");
    const lastNameField: HTMLElement | null = document.getElementById("profile_last-name");
    const birthdateField: HTMLElement | null = document.getElementById("profile_birthdate");
    const updateArr: UpdateData[] = [];
    if (firstNameField && lastNameField && birthdateField) {
      if ((firstNameField as HTMLInputElement).value === this.firstName &&
      (lastNameField as HTMLInputElement).value === this.lastName
      && (birthdateField as HTMLInputElement).value === this.dateOfBirth) {
        this.editMode();
      } else {
        if ((firstNameField as HTMLInputElement).value !== this.firstName) {
          updateArr.push({action: Actions.firstname, firstName: `${(firstNameField as HTMLInputElement).value}`});
        }
        if ((lastNameField as HTMLInputElement).value !== this.lastName) {
          updateArr.push({action: Actions.lastname, lastName: `${(lastNameField as HTMLInputElement).value}`});
        }
        if ((birthdateField as HTMLInputElement).value !== this.dateOfBirth) {
          updateArr.push({action: Actions.dateofbirth, dateOfBirth: `${(birthdateField as HTMLInputElement).value}`});
        }
        const update = await updateCustomer(this.id, updateArr, this.version)
        .then(res => res)
        .catch(err => console.log(err));
        console.log(update);
        // this.setUserData();
        // this.editMode();
      }
    }
  }

  private saveAccountData(): void {
    const emailCheckbox: HTMLElement | null = document.getElementById("profile_change_email");
    const passwordCheckbox: HTMLElement | null = document.getElementById("profile_change_password");
    if ((emailCheckbox as HTMLInputElement).checked) {
      console.log("THIS IS EMAIL");
      this.changeEmail();
    }
    if ((passwordCheckbox as HTMLInputElement).checked) {
      console.log("THIS IS PASSWORD");
      this.changePassword();
    }
  }

  private async changeEmail(): Promise<void> {
    const emailField: HTMLElement | null = document.getElementById("profile_email");
    const updateEmail: UpdateEmail[] = [];
    if (emailField) {
      if ((emailField as HTMLInputElement).value !== this.email) {
        updateEmail.push({action: Actions.email, email: `${(emailField as HTMLInputElement).value}`});
        const updateToNewEmail = await updateCustomerEmail(this.id, updateEmail, this.version)
        .then(res => res)
        .catch(err => console.log(err));
        console.log(updateToNewEmail);
      }
    }
  }

  private async changePassword(): Promise<void> {
    console.log(this.password);
    const currentPassword: HTMLElement | null = document.getElementById('profile_curr_password');
    const newPassword: HTMLElement | null = document.getElementById('profile_new_password');
    const currentPasswordVal: string = (currentPassword as HTMLInputElement).value;
    const newPasswordVal: string = (newPassword as HTMLInputElement).value;
    const updateToNewPassword = await changeCustomerPassword(this.id, currentPasswordVal, newPasswordVal, this.version)
    .then(res => res)
    .catch(err => console.log(err));
    console.log(updateToNewPassword);
  }

  private switchTab(currTab: HTMLElement, prevTab: HTMLElement, tabs: NodeListOf<HTMLElement>, panels: NodeListOf<HTMLElement>) {
    currTab.focus();
    currTab.classList.add("profile__link--active");
    currTab.removeAttribute("tabindex");
    currTab.setAttribute("aria-selected", "true");
    prevTab.classList.remove("profile__link--active");
    prevTab.removeAttribute("aria-selected");
    prevTab.setAttribute("tabindex", "-1");
    const currIdx: number = Array.prototype.indexOf.call(tabs, currTab);
    const oldIdx: number = Array.prototype.indexOf.call(tabs, prevTab);
    panels[oldIdx].hidden = true;
    panels[currIdx].hidden = false;
  }
}
// TODO: показывать ошибки и определить поведение при смене email/password