import {logout} from "../../actions/users.js";
import "./Header.css"

const Header = () => {
    const header = document.createElement("header");
    header.className = "header";

    const container = document.createElement("div");
    container.className = "container header-container";

    const link = document.createElement("a");
    link.href = "/";
    link.className = "header-title";
    link.textContent = "Admin panel";

    const userMenu = document.createElement("div");
    userMenu.className = "user-menu";

    const user = JSON.parse(localStorage.getItem("user"));
    const userButton = document.createElement("button");
    userButton.className = "user-button";
    userButton.textContent = `Hello, ${user?.username || "Guest"} ▼`;

    const dropdown = document.createElement("ul");
    dropdown.className = "dropdown hidden";

    const logoutItem = document.createElement("li");
    logoutItem.textContent = "Logout";
    logoutItem.addEventListener("click", async () => {
        const success = await logout();
        if (success) {
            window.location.href = "/";
        }
    });

    dropdown.appendChild(logoutItem);
    userMenu.appendChild(userButton);
    userMenu.appendChild(dropdown);

    userButton.addEventListener("click", () => {
        dropdown.classList.toggle("hidden");
    });

    container.appendChild(link);
    container.appendChild(userMenu);
    header.appendChild(container);

    return header;
};

export default Header;
