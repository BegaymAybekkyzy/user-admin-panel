import "./UserTable.css";
import dayjs from "dayjs";
import createModal from "../../UI/Modal/Modal.js";
import {getUserById, updateUser} from "../../../actions/admins/usersManagement.js";
import UserDetails from "./UserDetail.js";
import EditUserForm from "../EditUserForm/EditUserForm.js";

const modal = createModal();

const Table = (onSort, onEdit, onDelete) => {
    const table = document.createElement("table");
    table.className = "user-table";

    table.innerHTML = `
        <thead>
            <tr class="user-table-title">
                <th>#</th>
                <th data-sort="username">Username &#8645;</th>
                <th data-sort="first_name">First Name &#8645;</th>
                <th data-sort="birthdate">Birthdate &#8645;</th>
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
               <td data-clickable="true">${user.birthdate ? dayjs(user.birthdate).format("DD.MM.YYYY") : "-"}</td>
                <td class="table-actions">
                    <button class="edit-btn">&#9998;</button>
                    <button class="delete-btn">&#10006;</button>
                </td>
            `;

            tr.querySelector(".edit-btn").addEventListener("click", async (e) => {
                e.stopPropagation();

                const details = await getUserById(user.id);
                if (!details) return;

                modal.show({
                    title: "Edit User",
                    content: EditUserForm(details, async (formData) => {
                        const updated = await updateUser(user.id, formData);
                        if (updated) {
                            alert("User updated!");
                            modal.hide();
                            onEdit();
                        }
                    }, () => modal.hide()),
                    footerButtons: []
                });
            });

            tr.querySelector(".delete-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                onDelete(user);
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