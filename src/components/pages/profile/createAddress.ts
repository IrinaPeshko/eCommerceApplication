import { ResponseAddress, Countries } from "../../../types/types";

export default class NewAddress {
  constructor(private address: ResponseAddress) {
    this.address = address;
    // this.defaultShippingId = defaultShippingId;
    // this.defaultBillingId = defaultBillingId;
  }

  public createAddress() {
    const addressElem: HTMLDivElement = document.createElement("div");
    const addressInfo: HTMLParagraphElement = document.createElement("p");
    const addressBtnsWrapper: HTMLSpanElement = document.createElement("span");
    const addressEditBtn: HTMLButtonElement = document.createElement("button");
    const addressDeleteBtn: HTMLButtonElement = document.createElement("button");
    addressElem.className = "address profile__address";
    addressInfo.classList.add("address__info");
    addressBtnsWrapper.classList.add("address__btns-wrapper");
    addressInfo.innerText = `${this.address.city}, ${this.address.streetName}, ${this.address.building}, ${this.address.apartment}, ${this.chooseCountry(this.address.country)}, ${this.address.postalCode}`;
    addressEditBtn.className = "edit-btn address__edit-btn";
    addressDeleteBtn.className = "delete-btn address__delete-btn";
    addressBtnsWrapper.append(addressEditBtn, addressDeleteBtn);
    addressElem.append(addressInfo, addressBtnsWrapper);
    return addressElem;
  }

  private chooseCountry(code: string): string {
    switch(code) {
      case "BY": return Countries.BY;
      break;
      case "DE": return Countries.DE;
      break;
      case "PL": return Countries.PL;
      break;
      case "GE": return Countries.GE;
      break;
      default: return Countries.BY;
    }
  }
}