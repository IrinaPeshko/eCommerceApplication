import {
  createApiBuilderFromCtpClient,
  ApiRoot,
} from "@commercetools/platform-sdk";
import { Obj, FieldTypes } from "../../../types/types";
import Validate from "../../utils/validation";
import { getUser } from "../../../sdk/sdk";
import { handleLocation } from "../../utils/router";
import {
  createPasswordClient,
  createClient,
} from "../../../sdk/createPasswordClient";
import { MyTokenCache } from "../../../sdk/token/TokenCache";

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
        const tokenCache = new MyTokenCache();
        const clientAPI = createPasswordClient(email, password, tokenCache);
        const client = createClient(clientAPI);
        const apiRoot: ApiRoot = createApiBuilderFromCtpClient(client);
        try {
          const resp = await getUser(email, password, apiRoot);
          console.log(resp);
          if (resp.statusCode !== 400) {
            console.log(resp);
            const { token } = tokenCache.get();
            localStorage.setItem("token", token);
            console.log(localStorage.token);
            setTimeout((): void => {
              window.location.pathname = "/";
              handleLocation();
            }, 2 * 1000);
          } else {
            throw new Error("User not found!");
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
}
