import Header from "./components/Header.js";
import LoginForm from "./components/LoginForm.js";

const app = document.getElementById("app");
const user = JSON.parse(localStorage.getItem("user"));

if (user) {
    app.appendChild(Header());
} else {
    app.appendChild(LoginForm());
}