import {
  ApiRoot,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";
import { FieldTypes, Obj } from "../../../types/types";
import Validate from "../../utils/validation";
import { getUser, registerUser } from "../../../sdk/sdk";
import { MyTokenCache } from "../../../sdk/token/TokenCache";
import {
  createClient,
  createPasswordClient,
} from "../../../sdk/createPasswordClient";

export default class Registration {
  public validationForm(target: HTMLInputElement): void {
    const form: HTMLFormElement | null = document.querySelector(
      ".registration__form",
    );
    if (form) form.noValidate = true;
    const validate = new Validate(target);
    if (target.tagName === "INPUT") {
      if (target.type === FieldTypes.Text) {
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

  public validationSelect(target: HTMLSelectElement): void {
    const validate = new Validate(target);
    validate.validateSelect();
  }

  public async submitForm() {
    const form: HTMLFormElement | null = document.querySelector(
      ".registration__form",
    );
    const userData: Obj = {};
    if (form) {
      const fields = form.querySelectorAll(".form__field[required]");
      if (fields) {
        const fieldsArr: Element[] = Array.from(fields);
        fieldsArr.forEach((elem) => {
          if (elem.hasAttribute("disabled")) {
            elem.classList.add("valid");
          }
        });
        if (fieldsArr.every((elem) => elem.classList.contains("valid"))) {
          const data = new FormData(form);
          for (const val of data.entries()) {
            const key: string = val[0];
            const newVal: string = val[1] as string;
            userData[`${key}`] = newVal;
          }
          const { firstName, lastName, email, password, country } = userData;
          try {
            const resp = await registerUser(
              email,
              password,
              firstName,
              lastName,
              country,
            );
            if (resp.statusCode !== 400) {
              const tokenCache = new MyTokenCache();
              const clientAPI = createPasswordClient(
                email,
                password,
                tokenCache,
              );
              const client = createClient(clientAPI);
              const apiRoot: ApiRoot = createApiBuilderFromCtpClient(client);
              const respGetUser = await getUser(email, password, apiRoot);
              if (respGetUser.statusCode !== 400) {
                const { token } = tokenCache.get();
                localStorage.setItem("token", token);
              } else {
                throw new Error("User not found!");
              }
              setTimeout((): void => {
                window.location.href = "/";
              }, 2 * 1000);
            } else {
              throw new Error("Something wrong");
            }
          } catch (err) {
            console.error(err);
          }
        } else {
          fieldsArr
            .filter((elem) => !elem.classList.contains("valid"))
            .forEach((elem) => {
              elem.classList.add("invalid");
            });
        }
      }
      form.reset();
    }
  }
}
