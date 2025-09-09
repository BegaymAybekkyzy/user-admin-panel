import "./UserForm.css";
import {validateSafeInput} from "../../../utils/forbiddenPatterns.js";

const UserForm = (user, onSubmit, onCancel, isEdit = false) => {
  const form = document.createElement("form");
  form.className = "user-form";

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const makeField = (labelText, inputEl, name) => {
    const label = document.createElement("label");

    const textNode = document.createTextNode(labelText);
    label.appendChild(textNode);
    label.appendChild(inputEl);

    const errorDiv = document.createElement("div");
    errorDiv.className = "error";
    errorDiv.dataset.errorFor = name;
    label.appendChild(errorDiv);

    return label;
  };

  if (!isEdit) {

    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.name = "username";
    usernameInput.value = user.username || "";
    form.appendChild(makeField("Username:", usernameInput, "username"));

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.name = "password";
    form.appendChild(makeField("Password:", passwordInput, "password"));
  }

  const firstNameInput = document.createElement("input");
  firstNameInput.type = "text";
  firstNameInput.name = "firstName";
  firstNameInput.value = user.first_name || "";
  form.appendChild(makeField("First Name:", firstNameInput, "firstName"));

  const lastNameInput = document.createElement("input");
  lastNameInput.type = "text";
  lastNameInput.name = "lastName";
  lastNameInput.value = user.last_name || "";
  form.appendChild(makeField("Last Name:", lastNameInput, "lastName"));

  const genderSelect = document.createElement("select");
  genderSelect.name = "gender";

  ["male", "female"].forEach((g) => {
    const option = document.createElement("option");
    option.value = g;
    option.textContent = g.charAt(0).toUpperCase() + g.slice(1);
    if (user.gender === g) option.selected = true;
    genderSelect.appendChild(option);
  });
  form.appendChild(makeField("Gender:", genderSelect, "gender"));

  const birthdateInput = document.createElement("input");
  birthdateInput.type = "date";
  birthdateInput.name = "birthdate";
  birthdateInput.value = formatDateForInput(user.birthdate);
  form.appendChild(makeField("Birthdate:", birthdateInput, "birthdate"));

  const actions = document.createElement("div");
  actions.className = "form-actions";

  const saveBtn = document.createElement("button");
  saveBtn.type = "submit";
  saveBtn.className = "save-btn";
  saveBtn.textContent = isEdit ? "Save" : "Create";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "cancel-btn";
  cancelBtn.textContent = "Cancel";

  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);
  form.appendChild(actions);

  const showError = (name, message) => {
    const errorDiv = form.querySelector(`[data-error-for="${name}"]`);
    if (errorDiv) errorDiv.textContent = message;
  };

  const clearErrors = () => {
    form.querySelectorAll(".error").forEach((div) => {
      div.textContent = "";
    });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    let hasErrors = false;

    for (const [key, val] of Object.entries(data)) {
      const result = validateSafeInput(val);
      if (!result.safe) {
        showError(key, result.message);
        hasErrors = true;
      }
    }

    if (!isEdit) {
      if (!data.username?.trim()) {
        showError("username", "Username is required");
        hasErrors = true;
      } else if (data.username.length > 50) {
        showError("username", "Max length is 50");
        hasErrors = true;
      }

      if (!data.password?.trim()) {
        showError("password", "Password is required");
        hasErrors = true;
      }
    }

    if (!data.firstName?.trim()) {
      showError("firstName", "First name is required");
      hasErrors = true;
    } else if (data.firstName.length > 150) {
      showError("firstName", "Max length is 150");
      hasErrors = true;
    }

    if (data.lastName && data.lastName.length > 150) {
      showError("lastName", "Max length is 150");
      hasErrors = true;
    }

    if (data.gender && !["male", "female"].includes(data.gender)) {
      showError("gender", "Gender must be male or female");
      hasErrors = true;
    }

    if (data.birthdate) {
      const date = new Date(data.birthdate);
      if (isNaN(date.getTime())) {
        showError("birthdate", "Invalid date");
        hasErrors = true;
      }
    }

    if (hasErrors) return;

    onSubmit(data);
  });

  cancelBtn.addEventListener("click", onCancel);

  return form;
};

export default UserForm;