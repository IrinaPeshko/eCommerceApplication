import { Address } from "@commercetools/platform-sdk";
import { Countries, Obj, ChangeAddress, Actions } from "../../../types/types";
import Aside from "../../aside/aside";
import { changeAddress } from "../../../sdk/sdk";

export default class NewAddress {
  constructor(private version: number, private id: string, private address: Address, private elemID: number) {
    this.id = id;
    this.version = version;
    this.address = address;
    this.elemID = elemID;
  }

  public createAddress(): HTMLDivElement {
    const addressElem: HTMLDivElement = document.createElement("div");
    const addressInfo: HTMLParagraphElement = document.createElement("p");
    const addressBtnsWrapper: HTMLSpanElement = document.createElement("span");
    const addressEditBtn: HTMLButtonElement = document.createElement("button");
    const addressDeleteBtn: HTMLButtonElement =
      document.createElement("button");
    addressElem.className = "address profile__address";
    addressElem.id = `address_${this.elemID}`;
    addressInfo.classList.add("address__info");
    addressBtnsWrapper.classList.add("address__btns-wrapper");
    addressInfo.innerText = `${this.address.city}, ${
      this.address.streetName
    }, ${this.address.building}, ${
      this.address.apartment
    }, ${this.chooseCountry(this.address.country)}, ${this.address.postalCode}`;
    addressEditBtn.className = "edit-btn address__edit-btn";
    addressDeleteBtn.className = "delete-btn address__delete-btn";
    addressEditBtn.addEventListener("click", (e: Event) => {
      e.preventDefault();
      this.editAddress();
    })
    addressBtnsWrapper.append(addressEditBtn, addressDeleteBtn);
    addressElem.append(addressInfo, addressBtnsWrapper);
    return addressElem;
  }

  private editAddress(): void {
    const aside: Element | null = document.querySelector(".aside");
    const content: string = this.createAddressTemplate();
    Aside.openAside(content);
    if (aside) {
      aside.addEventListener("click", (e: Event): void => {
        if ((e.target as HTMLElement).tagName === "BUTTON" && (e.target as HTMLElement).id === "updateAddress") {
          e.preventDefault();
          this.updateAddress();
        }
      })
    }
  }

  private async updateAddress(): Promise<void> {
    const form: HTMLFormElement | null = document.querySelector(".aside__form");
    const addressData: Obj = {};
    if (form) {
      if (form) {
        const fields: NodeListOf<Element> = form.querySelectorAll(".form__field[required]");
        if (fields) {
          const fieldsArr: Element[] = Array.from(fields);
          if (fieldsArr.every((elem): boolean => elem.classList.contains("valid"))) {
            const data = new FormData(form);
            for (const val of data.entries()) {
              const key: string = val[0];
              const newVal: string = val[1] as string;
              addressData[`${key}`] = newVal;
            }
            const {countryCode, postalCode, city, streetName, building, apartment} = addressData;
            if (countryCode === this.address.country && postalCode === this.address.postalCode && city === this.address.city &&
              streetName === this.address.streetName && building === this.address.building && apartment === this.address.apartment) {
                Aside.closeAside();
            } else {
                const addressObject: ChangeAddress[] = [];
                if (this.address.id && this.address.key) {
                  addressObject.push({
                    action: Actions.address,
                    addressId: this.address.id,
                    address: {
                      id: this.address.id,
                      key: this.address.key,
                      country: countryCode,
                      city,
                      postalCode,
                      streetName,
                      building,
                      apartment
                    }
                  });
                  try {
                    const updateData = await changeAddress(this.version, this.id, addressObject);
                    if (updateData.statusCode !== 400) {
                      const { addresses } = updateData.body;
                        if (addresses) {
                          if (addresses.some(address => address.key === this.address.key)) {
                            const a = addresses.find(address => address.id === this.address.id);
                            if (a) {
                              const b = {...a};
                              if (b.key) {
                                this.address = {...a};
                                const addressElem: HTMLElement | null = document.getElementById(`address_${this.elemID}`);
                                if (addressElem) {
                                  const addressInfo: HTMLParagraphElement | null = addressElem.querySelector(".address__info");
                                  if (addressInfo) addressInfo.innerText = `${this.address.city}, ${
                                    this.address.streetName
                                  }, ${this.address.building}, ${
                                    this.address.apartment
                                  }, ${this.chooseCountry(this.address.country)}, ${this.address.postalCode}`;
                                }
                              }
                            }
                          }
                            Aside.closeAside();
                          }
                    } else {
                      throw new Error("Something is wrong");
                    }
                  } catch(error) {
                    console.log(error);
                  }
                }
              }
          }
        }
      }
    }
  }

  private chooseCountry(code: string): string {
    switch (code) {
      case "BY":
        return Countries.BY;
        break;
      case "DE":
        return Countries.DE;
        break;
      case "PL":
        return Countries.PL;
        break;
      case "GE":
        return Countries.GE;
        break;
      default:
        return Countries.BY;
    }
  }

  private createAddressTemplate(): string {
    return `
    <form class="form aside__form">
      <fieldset class="form__section">
        <legend class="form__subtitle">Edit address</legend>
        <p class="form__wrapper">
          <label class="form__label" for="country">Country <span class="form__asterisk">*</span></label>
          <span class="form__input-wrapper">
          <select class="form__field valid" id="country" name="countryCode" required>
            <option value="" disabled>Choose your country:</option>
            <option value="BY" selected>Belarus (BY)</option>
            <option value="DE">Germany (DE)</option>
            <option value="PL">Poland (PL)</option>
            <option value="GE">Georgia (GE)</option>
          </select>
          <span class="form__message" aria-live="polite"></span>
          </span>
        </p>
        <p class="form__wrapper">
          <label class="form__label" for="street">Street <span class="form__asterisk">*</span></label>
          <span class="form__input-wrapper">
            <input class="form__field valid" id="street" type="text" name="streetName" value="${this.address.streetName}" placeholder="Street" data-type="street" required>
            <span class="form__message" aria-live="polite"></span>
          </span>
        </p>
        <p class="form__wrapper">
          <label class="form__label" for="building">Building</label>
          <span class="form__input-wrapper">
            <input class="form__field" id="building" type="text" name="building" value="${this.address.building}" placeholder="Building">
            <span class="form__message" aria-live="polite"></span>
          </span>
        </p>
        <p class="form__wrapper">
            <label class="form__label" for="apartment">Apartment / Suite</span></label>
            <span class="form__input-wrapper">
              <input class="form__field" id="apartment" type="text" name="apartment" value="${this.address.apartment}" placeholder="Apartment / Suite">
              <span class="form__message" aria-live="polite"></span>
            </span>
        </p>
        <p class="form__wrapper">
          <label class="form__label" for="city">City <span class="form__asterisk">*</span></label>
          <span class="form__input-wrapper">
            <input class="form__field valid" id="city" type="text" name="city" value="${this.address.city}" placeholder="City" data-type="city" required>
            <span class="form__message" aria-live="polite"></span>
          </span>
        </p>
        <p class="form__wrapper">
            <label class="form__label" for="postal_code">Postal Code <span class="form__asterisk">*</span></label>
            <span class="form__input-wrapper">
              <input class="form__field valid" id="postal_code" type="text" name="postalCode" value="${this.address.postalCode}" placeholder="Postal Code" data-type="code" required>
              <span class="form__message" aria-live="polite"></span>
            </span>
        </p>
      </fieldset>
      <button class="btn aside__btn" id="updateAddress" type="submit">Save</button>
    </form>
    `;
  }
}
