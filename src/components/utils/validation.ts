import { postcodeValidator } from "postcode-validator";

export default class Validate {
  private errorField: ChildNode | null;

  constructor(private target: HTMLInputElement | HTMLSelectElement) {
    this.target = target;
    this.errorField = this.target.nextElementSibling;
  }

  public validateText(): void {
    const reg = /^(?! )(?!.* $)(?!(?:.* ){2})[ёЁA-zА-я -]+$/;
      if (!this.target.value || this.target.value === "") {
        this.error("This is a required field.");
      }
      if (this.target.dataset.type === "code") {
        let country: HTMLElement | null;
        let countryVal: string;
        if (this.target.id === "billing_postal_code") {
          country = document.getElementById("billing_country");
          if (country) {
            countryVal = (country as HTMLSelectElement).value;
            if (!postcodeValidator(this.target.value, countryVal)) {
              this.error("Incorrect postcode.");
            } else {
              this.valid("Correct postcode!");
            }
          }
        } else if (this.target.id === "shipping_postal_code") {
          country = document.getElementById("shipping_country");
          if (country) {
            countryVal = (country as HTMLSelectElement).value;
            if (!postcodeValidator(this.target.value, countryVal)) {
              this.error("Incorrect postcode.");
            } else {
              this.valid("Correct postcode!");
            }
          }
        }
      } else if (
        this.target.dataset.type === "names" ||
        this.target.dataset.type === "city"
      ) {
        if (!reg.test(this.target.value)) {
          if (/^\s/.test(this.target.value)) this.target.value = "";
          this.error(
            "Only letters, '-' and one space for double names allowed. Spaces at the beginning or end of a line are not allowed.",
          );
        } else {
          this.target.value = this.target.value.replace(
            /(-| |^)[а-яёa-z]/g,
            (firstLetter) => firstLetter.toUpperCase(),
          );
          this.valid("Correct!");
        }
      } else if (this.target.dataset.type === "street") {
        const street = /^(?! )(?!.* $)((?!\s{2}).)+$/;
        if (!street.test(this.target.value)) {
          if (/^\s/.test(this.target.value)) this.target.value = "";
          this.error(
            "Must be at least 1 character. Spaces at the beginning or end of a line or more than one space between characters are not allowed.",
          );
        } else {
          this.valid("Correct street!");
        }
      }
  }

  public validateEmail(): void {
    const emailReg =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
      if (!this.target.value || this.target.value === "") {
        this.error("This is a required field.");
      }
      if (!emailReg.test(this.target.value)) {
        this.error(
          "Please enter a valid email address, e.g., user@example.com, and ensure it contains no leading or trailing whitespace, includes a domain name, and has an '@' symbol separating the local part and domain name.",
        );
      } else {
        this.target.value = this.target.value.trim();
        this.valid("Correct email!");
      }
  }

  public validatePassword(): void {
    const passwordReg =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
      if (this.target.id !== "confirm-password") {
        if (/^\s/.test(this.target.value)) this.target.value = "";
        if (/\s+$/.test(this.target.value))
          this.target.value = this.target.value.trimEnd();
        if (!passwordReg.test(this.target.value)) {
          this.error(
            "Your password must contain at least 8 characters, at least one uppercase and lowercase letter, digit, and special character (such as !, @, #, $) and must not start or end with a whitespace character.",
          );
        } else if (this.target.value.length < 8) {
          this.error("Password must be at least 8 characters long");
        } else {
          this.valid("Strong Password!");
        }
      } else {
        const passwordField: HTMLInputElement | null =
          document.querySelector("#password");
        if (passwordField && passwordField.classList.contains("valid")) {
          const passwordValue: string | undefined = passwordField.value;
          if (passwordValue && passwordValue !== "") {
            if (this.target.value === passwordValue) {
              this.valid("Password confirm!");
            } else {
              this.error("This password is different.");
            }
          }
        } else {
          this.error("This password is invalid.");
        }
      }
  }

  public validateAge(): void {
    const currDate: number = Date.now();
    const userBirth: number = new Date(this.target.value).getTime();
    const difference: number = currDate - userBirth;
    if (difference < 0) {
      this.error("Incorrect date.");
    } else {
      const userAge: number = new Date(difference).getFullYear() - 1970;
      if (userAge < 13) {
        this.error("Users under the age of 13 are not allowed to register.");
      } else {
        this.valid("Allowed age.");
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

  private error(message: string): void {
    if (this.errorField) {
      this.errorField.textContent = message;
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
    }
  }

  private valid(message: string): void {
    if (this.errorField) {
      this.errorField.textContent = message;
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
