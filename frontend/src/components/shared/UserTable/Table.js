import "./UserTable.css";
import createModal from "../../UI/Modal/Modal.js";
import {deleteUser, getUserById, updateUser} from "../../../actions/admins/usersManagement.js";
import UserDetails from "./UserDetail.js";
import EditUserForm from "../UserForm/UserForm.js";
import createToast from "../../UI/Toast/Toast.js";

const modal = createModal();

const Table = (onSort, onEdit) => {
    const table = document.createElement("table");
    table.className = "user-table";

    table.innerHTML = `
        <thead>
            <tr class="user-table-title">
                <th>#</th>
                <th data-sort="username">Username &#8645;</th>
                <th data-sort="first_name">First Name &#8645;</th>
                <th data-sort="birthdate">Last Name &#8645;</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    table.querySelectorAll("th[data-sort]").forEach(th => {
        th.addEventListener("click", () => {
            onSort(th.getAttribute("data-sort"));
        });
    });

    const updateRows = (data) => {
        const tbody = table.querySelector("tbody");
        tbody.innerHTML = "";

        data.forEach((user, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
               <td data-clickable="true">${user.index ?? index + 1}</td>
               <td data-clickable="true">${user.username}</td>
               <td data-clickable="true">${user.first_name}</td>
               <td data-clickable="true">${user.last_name ? user.last_name: "-"}</td>
                <td class="table-actions">
                    <button class="edit-btn">&#9998;</button>
                    <button class="delete-btn">&#10006;</button>
                </td>
            `;

            tr.querySelector(".edit-btn").addEventListener("click", async (e) => {
                e.stopPropagation();

                const details = await getUserById(user.id);
                if (!details) return;

                let saveBtn

                const form = EditUserForm(
                    details,
                    async (formData) => {
                        try {
                            saveBtn.disabled = true;

                            const updated = await updateUser(user.id, formData);
                            if (updated) {
                                createToast("User updated", "success");
                                modal.hide();
                                onEdit();
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
                    true
                );

                saveBtn = form.querySelector(".save-btn");

                modal.show({
                    title: "Edit User",
                    content: form,
                    footerButtons: []
                });
            });

            tr.querySelector(".delete-btn").addEventListener("click", (e) => {
                e.stopPropagation();

                modal.show({
                    title: "Confirm Delete",
                    content: document.createTextNode(`Are you sure you want to delete user "${user.username}"?`),
                    footerButtons: [
                        {
                            label: "Cancel",
                            class: "modal-btn cancel-btn",
                            onClick: () => modal.hide(),
                        },
                        {
                            label: "Delete",
                            class: "modal-btn delete-btn",
                            onClick: async () => {
                                try {
                                    await deleteUser(user.id);
                                    createToast("User deleted", "success");
                                    modal.hide();
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
                                }
                            },
                        },
                    ],
                });
            });

            tr.querySelectorAll("td:not(.table-actions)").forEach(td => {
                td.addEventListener("click", async () => {
                    const details = await getUserById(user.id);
                    if (!details) return;

                    modal.show({
                        title: "User Details",
                        content: UserDetails(details),
                        footerButtons: [
                            { label: "Close", class: "modal-btn", onClick: () => modal.hide() }
                        ]
                    });
                });
            });

            tbody.appendChild(tr);
        });
    };

    return { table, updateRows };
};

export default Table;