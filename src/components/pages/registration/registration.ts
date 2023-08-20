import { FieldTypes, Obj } from "../../../types/types";
import { registerUser } from "../../../sdk/sdk";

export default class Registration {

  public validationForm(target: HTMLInputElement): void {
    const errorField: ChildNode | null = target.nextElementSibling;
    if (target.tagName === "INPUT") {
      if (target.type === FieldTypes.Text) {
        const reg = /^[А-яЁёa-zA-Z]+$/;
        const codeReg = /^[0-9]{6}$/;
        if (target.value.length === 0) {
          if (errorField) errorField.textContent = "This is a required field.";
          target.classList.remove("valid");
          target.classList.add("invalid");
        }
        if (target.dataset.type === 'code') {
            if (!codeReg.test(target.value)) {
              if (errorField) errorField.textContent = "Only numbers allowed. Must be 6 characters long";
              target.classList.remove("valid");
              target.classList.add("invalid");
            } else {
              if (errorField) errorField.textContent = "";
              target.classList.remove("invalid");
              target.classList.add("valid");
            }
        } else if (target.dataset.type === 'names') {
          if (!reg.test(target.value)) {
            if (errorField) errorField.textContent = "Only letters allowed.";
            target.classList.remove("valid");
            target.classList.add("invalid");
          } else {
            if (errorField) errorField.textContent = "";
            target.classList.remove("invalid");
            target.classList.add("valid");
          }
        }
      } else if (target.type === FieldTypes.Password) {
        const passwordReg =
          /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]/;
        if (target.id !== "confirm-password") {
          if (!passwordReg.test(target.value)) {
            if (errorField) {
              errorField.textContent =
                "Use lowercase and uppercase letters, numbers and special characters.";
              (errorField as HTMLSpanElement).classList.remove(
                "form__message--empty",
              );
              (errorField as HTMLSpanElement).classList.remove(
                "form__message--strong",
              );
              (errorField as HTMLSpanElement).classList.add(
                "form__message--short",
              );
              target.classList.remove("valid");
              target.classList.add("invalid");
            }
          } else if (target.value.length < 8) {
              if (errorField) {
                errorField.textContent =
                  "Password must be at least 8 characters long";
                (errorField as HTMLSpanElement).classList.remove(
                  "form__message--empty",
                );
                (errorField as HTMLSpanElement).classList.remove(
                  "form__message--strong",
                );
                (errorField as HTMLSpanElement).classList.add(
                  "form__message--short",
                );
                target.classList.remove("valid");
                target.classList.add("invalid");
              }
            } else if (errorField) {
                errorField.textContent = "Strong Password!";
                (errorField as HTMLSpanElement).classList.remove(
                  "form__message--empty",
                );
                (errorField as HTMLSpanElement).classList.remove(
                  "form__message--short",
                );
                (errorField as HTMLSpanElement).classList.add(
                  "form__message--strong",
                );
                target.classList.remove("invalid");
                target.classList.add("valid");
              }
        } else {
          const passwordField: HTMLInputElement | null =
            document.querySelector("#password");
          const passwordValue: string | undefined = passwordField?.value;
          if (passwordValue && errorField) {
            if (passwordValue !== "") {
              if ((target ).value === passwordValue) {
                errorField.textContent = "Password confirm!";
                (errorField as HTMLSpanElement).classList.remove(
                  "form__message--empty",
                );
                (errorField as HTMLSpanElement).classList.remove(
                  "form__message--short",
                );
                (errorField as HTMLSpanElement).classList.add(
                  "form__message--strong",
                );
                (target ).classList.remove("invalid");
                (target ).classList.add("valid");
              } else {
                errorField.textContent = "This password is different";
                (errorField as HTMLSpanElement).classList.remove(
                  "form__message--empty",
                );
                (errorField as HTMLSpanElement).classList.remove(
                  "form__message--strong",
                );
                (errorField as HTMLSpanElement).classList.add(
                  "form__message--short",
                );
                (target ).classList.add("invalid");
              }
            }
          }
        }
      } else if ((target ).type === FieldTypes.Email) {
        const emailReg = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (target.value.length === 0) {
          if (errorField) {
            errorField.textContent = "This is a required field.";
            (errorField as HTMLSpanElement).classList.remove(
              "form__message--short",
            );
            (errorField as HTMLSpanElement).classList.remove(
              "form__message--strong",
            );
            (errorField as HTMLSpanElement).classList.add(
              "form__message--empty",
            );
          }
          target.classList.remove("valid");
          target.classList.add("invalid");
        }
        if (!emailReg.test(target.value)) {
          if (errorField) {
            errorField.textContent = "Wrong format. Use @ and . symbols";
            (errorField as HTMLSpanElement).classList.remove(
              "form__message--empty",
            );
            (errorField as HTMLSpanElement).classList.remove(
              "form__message--strong",
            );
            (errorField as HTMLSpanElement).classList.add(
              "form__message--short",
            );
          }
          target.classList.remove("valid");
          target.classList.add("invalid");
        } else {
          if (errorField) {
            target.value = target.value.trim();
            errorField.textContent = "Correct email";
            (errorField as HTMLSpanElement).classList.remove(
              "form__message--empty",
            );
            (errorField as HTMLSpanElement).classList.remove(
              "form__message--short",
            );
            (errorField as HTMLSpanElement).classList.add(
              "form__message--strong",
            );
          }
          target.classList.remove("invalid");
          target.classList.add("valid");
        }
      }
    }
  }

  public async submitForm() {
    const form: HTMLFormElement | null = document.querySelector(
      ".registration__form",
    );
    const userData: Obj = {};
    if (form) {
      const data = new FormData(form);
      for (const val of data.entries()) {
        const key: string = val[0];
        const newVal: string = val[1] as string;
        userData[`${key}`] = newVal;
      }
      const { firstName, lastName, email, password, country } = userData;
      try {
        const resp = await registerUser(email, password, firstName, lastName, country);
        if (resp.statusCode !== 400) {
          console.log(resp);
          setTimeout((): void =>{
            window.location.href = '/';
          }, 5 * 1000);
        } else {
          throw new Error('Something wrong');
        }
      } catch(err) {
        console.log(err);
      }
      
    //   const apiRoot = createApiBuilderFromCtpClient(client)
    //     .withProjectKey({ projectKey: "new_project" })
    //     .customers()
    //     .post({
    //       body: createCustomerDraft(userData),
    //     })
    //     .execute()
    //     .then((res) => console.log("Success!"))
    //     .catch((err) => console.log(err));
    //   return apiRoot;
    }
  }
}
