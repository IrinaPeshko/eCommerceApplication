import { FieldTypes, Obj } from "../../../types/types";
import Validate from "../../utils/validation";
import { registerUser } from "../../../sdk/sdk";

export default class Registration {
  public validationForm(target: HTMLInputElement): void {
    const validate = new Validate(target);
    if (target.tagName === "INPUT") {
      if (target.type === FieldTypes.Text) {
        validate.validateText();
      } else if (target.type === FieldTypes.Password) {
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
    }
  }
}
