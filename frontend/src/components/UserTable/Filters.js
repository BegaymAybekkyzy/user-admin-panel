import "./UserTable.css";

const Filters = (onFilter) => {
    const filtersDiv = document.createElement("div");
    filtersDiv.className = "user-filters";

    filtersDiv.innerHTML = `
        <input type="text" id="filterUsername" placeholder="Username">
        <input type="text" id="filterFirstName" placeholder="First name">
        <input type="date" id="filterBirthdate">
        <button id="applyFilters">Filter</button>
    `;

    filtersDiv.querySelector("#applyFilters").addEventListener("click", () => {
        const filters = {
            username: filtersDiv.querySelector("#filterUsername").value,
            firstName: filtersDiv.querySelector("#filterFirstName").value,
            birthdate: filtersDiv.querySelector("#filterBirthdate").value,
        };
        onFilter(filters);
    });

    return filtersDiv;
};

export default Filters;