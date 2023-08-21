import { Obj, FieldTypes, BadRequest } from "../../../types/types";
import Validate from "../../utils/validation";
import { getUser } from "../../../sdk/sdk";
import Popap from "../../popap/popap";

export default class Login {
  public validationForm(target: HTMLInputElement): void {
    const validate = new Validate(target);
    if (target.tagName === "INPUT") {
      if (target.type === FieldTypes.Email) {
        validate.validateEmail();
      } else if (target.type === FieldTypes.Password) {
        validate.validatePassword();
      }
    }
  }

  public async signIn(): Promise<void> {
    const form: HTMLFormElement | null = document.querySelector(".login__form");
    const passwordField: HTMLElement | null =
      document.getElementById("login-password");
    const emailField: HTMLElement | null =
      document.getElementById("login-email");
    const userData: Obj = {};
    if (passwordField && emailField) {
      if (
        passwordField.classList.contains("valid") &&
        emailField.classList.contains("valid")
      ) {
        if (form) {
          const data = new FormData(form);
          for (const [key, value] of data.entries()) {
            userData[`${key}`] = `${value}`;
          }
        }
        const { email, password } = userData;
        try {
          const resp = await getUser(email, password);
          if (resp.statusCode !== 400) {
            setTimeout((): void => {
              window.location.href = "/";
            }, 3 * 1000);
          } else {
            throw new Error("User not found!");
          }
        } catch (err) {
          Popap.open(`<div>${(err as BadRequest).message}</div>`);
        }
      }
    }
  }
}
