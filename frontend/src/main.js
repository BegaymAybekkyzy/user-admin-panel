import Header from "./components/shared/Header/Header.js";
import LoginForm from "./components/shared/LoginForm/LoginForm.js";
import UserTable from "./components/shared/UserTable/UserTable.js";

const app = document.getElementById("app");
const user = JSON.parse(localStorage.getItem("user"));

if (user) {
    app.appendChild(Header());
    app.appendChild(UserTable());
} else {
    app.appendChild(LoginForm());
}