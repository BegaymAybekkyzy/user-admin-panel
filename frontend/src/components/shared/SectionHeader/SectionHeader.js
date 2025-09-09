import "./SectionHeader.css";
import createModal from "../../UI/Modal/Modal.js";
import UserForm from "../UserForm/UserForm.js";
import { addUser } from "../../../actions/admins/usersManagement.js";
import createToast from "../../UI/Toast/Toast.js";

const modal = createModal();

const SectionHeader = (onUserAdded) => {
  const header = document.createElement("div");
  header.className = "section-header";

  const title = document.createElement("h2");
  title.textContent = "User Management";

  const button = document.createElement("button");
  button.textContent = "Add User";
  button.className = "btn-primary";

  button.addEventListener("click", () => {
    modal.show({
      title: "Add User",
      content: (() => {
        let saveBtn;

        const form = UserForm(
          {},
          async (formData) => {
            try {
              saveBtn.disabled = true;

              const created = await addUser(formData);
              if (created) {
                createToast("User added!", "success");
                modal.hide();
                onUserAdded?.();
              }
            } catch (error) {
              let message = "Server error";
              if (error.response) {
                try {
                  const data = await error.response.json();
                  message = data.error || message;
                } catch {
                  message = error.message || message;
                }
              }
              createToast(message, "error");
            } finally {
              saveBtn.disabled = false;
            }
          },
          () => modal.hide(),
          false,
        );

        saveBtn = form.querySelector(".save-btn");

        return form;
      })(),
      footerButtons: [],
    });
  });

  header.appendChild(title);
  header.appendChild(button);

  return header;
};

export default SectionHeader;
