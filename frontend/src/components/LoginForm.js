import { login } from "../actions/users.js";

const LoginForm = () => {
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

    const message = document.createElement("p");
    message.className = "login-message";

    form.appendChild(usernameInput);
    form.appendChild(passwordInput);
    form.appendChild(submitBtn);
    form.appendChild(message);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        message.textContent = "Loading...";

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        const user = await login({ username, password });

        if (user) {
            message.textContent = `Welcome, ${user.username}!`;
            window.location.reload();
        } else {
            message.textContent = "Invalid credentials";
        }
    });

    return form;
};

export default LoginForm;
