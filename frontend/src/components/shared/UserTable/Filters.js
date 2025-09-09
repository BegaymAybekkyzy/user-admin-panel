import "./UserTable.css";
import {validateSafeInput} from "../../../utils/forbiddenPatterns.js";

const Filters = (onFilter) => {
  const filtersDiv = document.createElement("div");
  filtersDiv.className = "user-filters";

  filtersDiv.innerHTML = `
        <input type="text" id="filterUsername" placeholder="Username">
        <input type="text" id="filterFirstName" placeholder="First name">
        <input type="date" id="filterBirthdate">
        <button id="applyFilters" class="btn-primary">Search</button>
        <button id="cleanFilters" class="btn-outline">Clean</button>
        <div class="error global-error"></div>
    `;

  const showError = (message) => {
    const errorDiv = filtersDiv.querySelector(".global-error");
    errorDiv.textContent = message;
  };

  const clearError = () => {
    const errorDiv = filtersDiv.querySelector(".global-error");
    errorDiv.textContent = "";
  };

  filtersDiv.querySelector("#applyFilters").addEventListener("click", () => {
    clearError();

    const filters = {
      username: filtersDiv.querySelector("#filterUsername").value,
      firstName: filtersDiv.querySelector("#filterFirstName").value,
      birthdate: filtersDiv.querySelector("#filterBirthdate").value,
    };

    for (const [key, val] of Object.entries(filters)) {
      const result = validateSafeInput(val);
      if (!result.safe) {
        showError(`${key}: ${result.message}`);
        return;
      }
    }

    onFilter(filters);
  });

  filtersDiv.querySelector("#cleanFilters").addEventListener("click", () => {
    filtersDiv.querySelector("#filterUsername").value = "";
    filtersDiv.querySelector("#filterFirstName").value = "";
    filtersDiv.querySelector("#filterBirthdate").value = "";
    clearError();
    onFilter({});
  });

  return filtersDiv;
};

export default Filters;