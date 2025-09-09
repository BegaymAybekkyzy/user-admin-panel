import { logout, deleteUserSelf } from "../../../actions/users.js";
import "./Header.css";
import createToast from "../../UI/Toast/Toast.js";
import ProfileEditor from "../ProfileEditor/ProfileEditor.js";
import createModal from "../../UI/Modal/Modal.js";

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
  userButton.textContent = `Hello, ${user?.first_name || "Guest"} ▼`;

  const dropdown = document.createElement("ul");
  dropdown.className = "dropdown hidden";

  const profileEditor = ProfileEditor();
  const editItem = document.createElement("li");
  editItem.textContent = "Edit Profile";
  editItem.addEventListener("click", () => profileEditor.openEditor());

  const logoutItem = document.createElement("li");
  logoutItem.textContent = "Logout";
  logoutItem.addEventListener("click", async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      let message = "An error occurred while logging out of the system.";
      if (error.response) {
        try {
          const data = await error.response.json();
          message = data.error || message;
        } catch {
          message = error.message || message;
        }
      }
      createToast(message, "error");
    }
    localStorage.removeItem("user");
  });

  const deleteItem = document.createElement("li");
  deleteItem.textContent = "Delete Account";
  deleteItem.addEventListener("click", () => {
    const modal = createModal();

    const form = document.createElement("form");
    form.innerHTML = `
            <p>
                This action is irreversible. Your account will be permanently deleted.
            </p>
            <label>
                Confirm with your current password:
                <input type="password" name="currentPassword" required>
            </label>
        `;

    modal.show({
      title: "Delete Account",
      content: form,
      footerButtons: [
        {
          label: "Delete",
          class: "modal-btn danger",
          onClick: async () => {
            const formData = new FormData(form);
            const { currentPassword } = Object.fromEntries(formData.entries());

            if (!currentPassword) {
              createToast("Please enter your current password", "error");
              return;
            }

            try {
              await deleteUserSelf({ currentPassword });
              createToast("Account deleted successfully", "success");

              localStorage.removeItem("user");
              window.location.href = "/";
            } catch (err) {
              let message = "Failed to delete account";
              if (err.response) {
                try {
                  const data = await err.response.json();
                  message = data.error || message;
                } catch {
                  message = err.message || message;
                }
              }
              createToast(message, "error");
            }
          },
        },
        {
          label: "Cancel",
          class: "modal-btn cancel",
          onClick: () => modal.hide(),
        },
      ],
    });
  });

  dropdown.appendChild(editItem);
  dropdown.appendChild(logoutItem);
  dropdown.appendChild(deleteItem);

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
