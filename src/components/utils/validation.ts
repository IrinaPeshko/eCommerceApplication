import { postcodeValidator } from "postcode-validator";

export default class Validate {
  private errorField: ChildNode | null;

  constructor(private target: HTMLInputElement | HTMLSelectElement) {
    this.target = target;
    this.errorField = this.target.nextElementSibling;
  }

  public validateText(): void {
    const reg = /^[А-яЁёa-zA-Z]{1,}$/;
    if (this.errorField) {
      if (!this.target.value || this.target.value === "") {
        this.errorField.textContent = "This is a required field.";
        this.target.classList.remove("valid");
        this.target.classList.add("invalid");
      }
      if (this.target.dataset.type === "code") {
        let country: HTMLElement | null;
        let countryVal: string;
        if (this.target.id === "billing_postal_code") {
          country = document.getElementById("billing_country");
          if (country) {
            countryVal = (country as HTMLSelectElement).value;
            if (!postcodeValidator(this.target.value, countryVal)) {
              this.errorField.textContent = "Incorrect postcode.";
              this.target.classList.remove("valid");
              this.target.classList.add("invalid");
            } else {
              this.errorField.textContent = "";
              this.target.classList.remove("invalid");
              this.target.classList.add("valid");
            }
          }
        } else if (this.target.id === "shipping_postal_code") {
          country = document.getElementById("shipping_country");
          if (country) {
            countryVal = (country as HTMLSelectElement).value;
            if (!postcodeValidator(this.target.value, countryVal)) {
              this.errorField.textContent = "Incorrect postcode.";
              this.target.classList.remove("valid");
              this.target.classList.add("invalid");
            } else {
              this.errorField.textContent = "";
              this.target.classList.remove("invalid");
              this.target.classList.add("valid");
            }
          }
        }
      } else if (this.target.dataset.type === "names") {
        if (!reg.test(this.target.value)) {
          this.errorField.textContent = "Only letters allowed.";
          this.target.classList.remove("valid");
          this.target.classList.add("invalid");
        } else {
          this.errorField.textContent = "";
          this.target.classList.remove("invalid");
          this.target.classList.add("valid");
        }
      } else if (this.target.dataset.type === "city") {
        if (!reg.test(this.target.value)) {
          this.errorField.textContent = "Must be at least 1 letter.";
          this.target.classList.remove("valid");
          this.target.classList.add("invalid");
        } else {
          this.errorField.textContent = "";
          this.target.classList.remove("invalid");
          this.target.classList.add("valid");
        }
      } else if (this.target.dataset.type === "street") {
        const street = /^.{1,}$/;
        if (!street.test(this.target.value)) {
          this.errorField.textContent = "Must be at least 1 character.";
          this.target.classList.remove("valid");
          this.target.classList.add("invalid");
        } else {
          this.errorField.textContent = "";
          this.target.classList.remove("invalid");
          this.target.classList.add("valid");
        }
      }
    }
  }

  public validateEmail(): void {
    const emailReg =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    if (this.errorField) {
      if (!this.target.value || this.target.value === "") {
        this.errorField.textContent = "This is a required field.";
        (this.errorField as HTMLSpanElement).classList.remove(
          "form__message--short",
        );
        (this.errorField as HTMLSpanElement).classList.remove(
          "form__message--strong",
        );
        (this.errorField as HTMLSpanElement).classList.add(
          "form__message--empty",
        );
        this.target.classList.remove("valid");
        this.target.classList.add("invalid");
      }
      if (!emailReg.test(this.target.value)) {
        this.errorField.textContent = "Wrong format. Use @ and . symbols";
        (this.errorField as HTMLSpanElement).classList.remove(
          "form__message--empty",
        );
        (this.errorField as HTMLSpanElement).classList.remove(
          "form__message--strong",
        );
        (this.errorField as HTMLSpanElement).classList.add(
          "form__message--short",
        );
        this.target.classList.remove("valid");
        this.target.classList.add("invalid");
      } else {
        this.target.value = this.target.value.trim();
        this.errorField.textContent = "Correct email";
        (this.errorField as HTMLSpanElement).classList.remove(
          "form__message--empty",
        );
        (this.errorField as HTMLSpanElement).classList.remove(
          "form__message--short",
        );
        (this.errorField as HTMLSpanElement).classList.add(
          "form__message--strong",
        );
        this.target.classList.remove("invalid");
        this.target.classList.add("valid");
      }
    }
  }

  public validatePassword(): void {
    console.log(this.target.value);
    const passwordReg =
      /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]/;
    if (this.errorField) {
      if (this.target.id !== "confirm-password") {
        if (!passwordReg.test(this.target.value)) {
          this.errorField.textContent =
            "Use lowercase and uppercase letters, numbers and special characters.";
          (this.errorField as HTMLSpanElement).classList.remove(
            "form__message--empty",
          );
          (this.errorField as HTMLSpanElement).classList.remove(
            "form__message--strong",
          );
          (this.errorField as HTMLSpanElement).classList.add(
            "form__message--short",
          );
          this.target.classList.remove("valid");
          this.target.classList.add("invalid");
        } else if (this.target.value.length < 8) {
          this.errorField.textContent =
            "Password must be at least 8 characters long";
          (this.errorField as HTMLSpanElement).classList.remove(
            "form__message--empty",
          );
          (this.errorField as HTMLSpanElement).classList.remove(
            "form__message--strong",
          );
          (this.errorField as HTMLSpanElement).classList.add(
            "form__message--short",
          );
          this.target.classList.remove("valid");
          this.target.classList.add("invalid");
        } else {
          this.errorField.textContent = "Strong Password!";
          (this.errorField as HTMLSpanElement).classList.remove(
            "form__message--empty",
          );
          (this.errorField as HTMLSpanElement).classList.remove(
            "form__message--short",
          );
          (this.errorField as HTMLSpanElement).classList.add(
            "form__message--strong",
          );
          this.target.classList.remove("invalid");
          this.target.classList.add("valid");
        }
      } else {
        const passwordField: HTMLInputElement | null =
          document.querySelector("#password");
        const passwordValue: string | undefined = passwordField?.value;
        if (passwordValue && passwordValue !== "") {
          if (this.target.value === passwordValue) {
            this.errorField.textContent = "Password confirm!";
            (this.errorField as HTMLSpanElement).classList.remove(
              "form__message--empty",
            );
            (this.errorField as HTMLSpanElement).classList.remove(
              "form__message--short",
            );
            (this.errorField as HTMLSpanElement).classList.add(
              "form__message--strong",
            );
            this.target.classList.remove("invalid");
            this.target.classList.add("valid");
          } else {
            this.errorField.textContent = "This password is different";
            (this.errorField as HTMLSpanElement).classList.remove(
              "form__message--empty",
            );
            (this.errorField as HTMLSpanElement).classList.remove(
              "form__message--strong",
            );
            (this.errorField as HTMLSpanElement).classList.add(
              "form__message--short",
            );
            this.target.classList.add("invalid");
          }
        }
      }
    }
  }

  public validateAge(): void {
    console.log(typeof this.target.value);
    const currDate: number = Date.now();
    const userBirth: number = new Date(this.target.value).getTime();
    const difference: number = currDate - userBirth;
    if (this.errorField) {
      if (difference < 0) {
        this.errorField.textContent = "Incorrect date.";
        (this.errorField as HTMLSpanElement).classList.remove(
          "form__message--empty",
        );
        (this.errorField as HTMLSpanElement).classList.remove(
          "form__message--strong",
        );
        (this.errorField as HTMLSpanElement).classList.add(
          "form__message--short",
        );
        this.target.classList.remove("valid");
        this.target.classList.add("invalid");
      } else {
        const userAge: number = new Date(difference).getFullYear() - 1970;
        if (userAge < 13) {
          this.errorField.textContent =
            "Users under the age of 13 are not allowed to register.";
          (this.errorField as HTMLSpanElement).classList.remove(
            "form__message--empty",
          );
          (this.errorField as HTMLSpanElement).classList.remove(
            "form__message--strong",
          );
          (this.errorField as HTMLSpanElement).classList.add(
            "form__message--short",
          );
          this.target.classList.remove("valid");
          this.target.classList.add("invalid");
        } else {
          this.errorField.textContent = "Allowed age.";
          (this.errorField as HTMLSpanElement).classList.remove(
            "form__message--empty",
          );
          (this.errorField as HTMLSpanElement).classList.remove(
            "form__message--short",
          );
          (this.errorField as HTMLSpanElement).classList.add(
            "form__message--strong",
          );
          this.target.classList.remove("invalid");
          this.target.classList.add("valid");
        }
      }
    }
  }

  public validateSelect(): void {
    if (this.errorField) {
      if (this.target.value && this.target.value !== "") {
        this.errorField.textContent = "";
        this.target.classList.remove("invalid");
        this.target.classList.add("valid");
      } else {
        this.errorField.textContent = "Select one option.";
        this.target.classList.remove("valid");
        this.target.classList.add("invalid");
      }
    }
  }
}
