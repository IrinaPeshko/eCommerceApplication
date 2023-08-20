import { Obj, FieldTypes } from "../../../types/types";
import { getUser } from "../../../sdk/sdk";

export default class Login {

  public validationForm(target: HTMLInputElement): void {
    const errorField: ChildNode | null = target.nextElementSibling;
    if (target.tagName === "INPUT") {
      if (target.type === FieldTypes.Email) {
        const emailReg = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (target.value.length) {
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
            errorField.textContent = "Use @ and . characters.";
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
      } else if (target.type === FieldTypes.Password) {
        const passwordReg =
          /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]/;
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
          console.log(resp);
          if (resp.statusCode !== 400) {
            console.log(resp);
            setTimeout((): void =>{
              window.location.href = '/';
            }, 5 * 1000);
          } else {
            throw new Error('User not found!');
          }
        } catch(err) {
          console.log(err);
        }
      }
    }
  }
}
