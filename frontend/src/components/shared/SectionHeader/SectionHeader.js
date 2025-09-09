import "./SectionHeader.css";
import createModal from "../../UI/Modal/Modal.js";
import UserForm from "../UserForm/UserForm.js";
import { addUser } from "../../../actions/admins/usersManagement.js";

const modal = createModal();

const SectionHeader = (onUserAdded) => {
    const headerContainer = document.createElement("div");
    headerContainer.className = "container";

    const header = document.createElement("div");
    header.className = "section-header";

    const title = document.createElement("h2");
    title.textContent = "User Management";

    const button = document.createElement("button");
    button.textContent = "Add User";
    button.className = "add-user-btn";

    button.addEventListener("click", () => {
        modal.show({
            title: "Add User",
            content: UserForm(
                {},
                async (formData) => {
                    try {
                        const created = await addUser(formData);
                        if (created) {
                            alert("User added!");
                            modal.hide();
                            onUserAdded?.();
                        }
                    } catch (error) {

                    }

                }, () => modal.hide(), false),
            footerButtons: [],
        });
    });

    headerContainer.appendChild(header);
    header.appendChild(title);
    header.appendChild(button);

    return headerContainer;
};

export default SectionHeader;
