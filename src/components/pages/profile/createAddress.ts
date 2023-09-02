import { Address } from "@commercetools/platform-sdk";
import {
  Countries,
  Obj,
  ChangeAddress,
  RemoveAddress,
  Actions,
  AddressData,
} from "../../../types/types";
import Aside from "../../aside/aside";
import { changeAddress, deleteAddress } from "../../../sdk/sdk";
import { createaAddressTemplate } from "./templates";
import Alert from "../../alerts/alert";
import { Emitter } from "../../utils/eventEmitter";

export default class NewAddress {
  constructor(
    private version: number,
    private id: string,
    private address: Address,
    private elemID: number,
  ) {
    this.id = id;
    this.version = version;
    this.address = address;
    this.elemID = elemID;
    Emitter.on("updateVersion", (versionFromProfile: number): void => {
      this.version = versionFromProfile;
    });
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
    addressEditBtn.addEventListener("click", (e: Event): void => {
      e.preventDefault();
      this.editAddress();
    });
    addressDeleteBtn.addEventListener("click", (e: Event): void => {
      e.preventDefault();
      this.removeAddress();
    });
    addressBtnsWrapper.append(addressEditBtn, addressDeleteBtn);
    addressElem.append(addressInfo, addressBtnsWrapper);
    return addressElem;
  }

  private editAddress(): void {
    const aside: Element | null = document.querySelector(".aside");
    if (
      this.address.streetName &&
      this.address.building &&
      this.address.apartment &&
      this.address.city &&
      this.address.postalCode
    ) {
      const obj: AddressData = {
        countryCode: this.address.country,
        streetName: this.address.streetName,
        building: this.address.building,
        apartment: this.address.apartment,
        city: this.address.city,
        postalCode: this.address.postalCode,
      };
      const content: string = createaAddressTemplate(
        "Edit Address",
        "updateaddress",
        obj,
      );
      Aside.openAside(content);
      if (aside) {
        const countryField: HTMLSelectElement | null =
          aside.querySelector("#country");
        const streetField: HTMLInputElement | null =
          aside.querySelector("#street");
        const cityField: HTMLInputElement | null = aside.querySelector("#city");
        const postalCodeField: HTMLInputElement | null =
          aside.querySelector("#postal_code");
        const buildingField: HTMLInputElement | null =
          aside.querySelector("#building");
        const apartmentField: HTMLInputElement | null =
          aside.querySelector("#apartment");
        if (streetField) streetField.classList.add("valid");
        if (cityField) cityField.classList.add("valid");
        if (postalCodeField) postalCodeField.classList.add("valid");
        aside.addEventListener("click", (e: Event): void => {
          e.preventDefault();
          if (
            (e.target as HTMLElement).tagName === "BUTTON" &&
            (e.target as HTMLElement).dataset.action === "updateaddress"
          ) {
            if (
              countryField &&
              streetField &&
              cityField &&
              postalCodeField &&
              buildingField &&
              apartmentField
            ) {
              if (
                countryField.value === this.address.country &&
                streetField.value === this.address.streetName &&
                cityField.value === this.address.city &&
                postalCodeField.value === this.address.postalCode &&
                buildingField.value === this.address.building &&
                apartmentField.value === this.address.apartment
              ) {
                Aside.closeAside();
              } else {
                this.updateAddress();
              }
            }
          }
        });
      }
    }
  }

  private async updateAddress(): Promise<void> {
    const form: HTMLFormElement | null = document.querySelector(".aside__form");
    const addressData: Obj = {};
    if (form) {
      const fields: NodeListOf<Element> = form.querySelectorAll(
        ".form__field[required]",
      );
      if (fields) {
        const fieldsArr: Element[] = Array.from(fields);
        if (
          fieldsArr.every((elem): boolean => elem.classList.contains("valid"))
        ) {
          const data = new FormData(form);
          for (const val of data.entries()) {
            const key: string = val[0];
            const newVal: string = val[1] as string;
            addressData[`${key}`] = newVal;
          }
          const {
            countryCode,
            postalCode,
            city,
            streetName,
            building,
            apartment,
          } = addressData;
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
                apartment,
              },
            });
            try {
              const updateData = await changeAddress(
                this.version,
                this.id,
                addressObject,
              );
              if (updateData.statusCode !== 400) {
                Alert.showAlert(false, "Address succesfully updated");
                const { addresses, version } = updateData.body;
                this.version = version;
                Emitter.emit("updateVersionFromAside", this.version);
                if (addresses) {
                  if (
                    addresses.some(
                      (address) => address.key === this.address.key,
                    )
                  ) {
                    const a = addresses.find(
                      (address) => address.id === this.address.id,
                    );
                    if (a) {
                      const b = { ...a };
                      if (b.key) {
                        this.address = { ...a };
                        const addressElem: HTMLElement | null =
                          document.getElementById(`address_${this.elemID}`);
                        if (addressElem) {
                          const addressInfo: HTMLParagraphElement | null =
                            addressElem.querySelector(".address__info");
                          if (addressInfo)
                            addressInfo.innerText = `${this.address.city}, ${
                              this.address.streetName
                            }, ${this.address.building}, ${
                              this.address.apartment
                            }, ${this.chooseCountry(this.address.country)}, ${
                              this.address.postalCode
                            }`;
                        }
                      }
                    }
                  }
                  Aside.closeAside();
                }
              } else {
                Alert.showAlert(true, "Address not updated");
                throw new Error("Something is wrong");
              }
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
    }
  }

  private async removeAddress(): Promise<void> {
    const currentAddressElem: HTMLElement | null = document.getElementById(
      `address_${this.elemID}`,
    );
    if (this.address.id) {
      const removedAddressObj: RemoveAddress[] = [
        {
          action: Actions.removeaddress,
          addressId: this.address.id,
        },
      ];
      try {
        const removeCurrentAddress = await deleteAddress(
          this.version,
          this.id,
          removedAddressObj,
        );
        if (removeCurrentAddress.statusCode !== 400) {
          Alert.showAlert(false, "Address succesfully removed");
          const { version } = removeCurrentAddress.body;
          this.version = version;
          Emitter.emit("updateVersionFromAside", this.version);
          if (currentAddressElem) currentAddressElem.remove();
        } else {
          Alert.showAlert(true, "Address not removed");
          throw new Error("Something is wrong");
        }
      } catch (err) {
        console.log(err);
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
}
