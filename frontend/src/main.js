import Header from "./components/Header/Header.js";
import LoginForm from "./components/LoginForm/LoginForm.js";
import UserTable from "./components/UserTable/UserTable.js";

const app = document.getElementById("app");
const user = JSON.parse(localStorage.getItem("user"));

if (user) {
    app.appendChild(Header());
    app.appendChild(UserTable());
} else {
    app.appendChild(LoginForm());
}