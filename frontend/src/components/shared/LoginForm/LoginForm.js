import { login } from "../../../actions/users.js";
import "./LoginForm.css";

const LoginForm = () => {
  const wrapper = document.createElement("div");
  wrapper.className = "login-wrapper";

  const title = document.createElement("h2");
  title.textContent = "Login";

  const form = document.createElement("form");
  form.className = "login-form";

  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.name = "username";
  usernameInput.placeholder = "Username";
  usernameInput.required = true;

  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.name = "password";
  passwordInput.placeholder = "Password";
  passwordInput.required = true;

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Login";
  submitBtn.className = "btn-primary";

  const message = document.createElement("p");
  message.className = "login-message";

  form.appendChild(usernameInput);
  form.appendChild(passwordInput);
  form.appendChild(submitBtn);
  form.appendChild(message);

  wrapper.appendChild(title);
  wrapper.appendChild(form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const user = await login({ username, password });

    if (user) {
      window.location.reload();
    } else {
      message.textContent = "Invalid credentials";
    }
  });

  return wrapper;
};

export default LoginForm;
