import "./UserTable.css";

const Table = (onSort) => {
    const table = document.createElement("table");
    table.className = "user-table";

    table.innerHTML = `
        <thead>
            <tr>
                <th data-sort="username">Username</th>
                <th data-sort="first_name">First Name</th>
                <th data-sort="birthdate">Birthdate</th>
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
        data.forEach(user => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${user.username}</td>
                <td>${user.first_name}</td>
                <td>${user.birthdate || "-"}</td>
            `;
            tbody.appendChild(tr);
        });
    };

    return { table, updateRows };
};

export default Table;
