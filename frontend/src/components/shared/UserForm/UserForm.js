import "./UserForm.css";

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

  const makeField = (label, inputHtml, name) => `
      <label>
        ${label}
        ${inputHtml}
        <div class="error" data-error-for="${name}"></div>
      </label>
    `;

  form.innerHTML = `
      ${
        !isEdit
          ? `
        ${makeField(
          "Username:",
          `<input type="text" name="username" value="${user.username || ""}" />`,
          "username",
        )}
        
        ${makeField(
          "Password:",
          `<input type="password" name="password" />`,
          "password",
        )}
      `
          : ""
      }

      ${makeField(
        "First Name:",
        `<input type="text" name="firstName" value="${user.first_name || ""}" />`,
        "firstName",
      )}

      ${makeField(
        "Last Name:",
        `<input type="text" name="lastName" value="${user.last_name || ""}" />`,
        "lastName",
      )}

      ${makeField(
        "Gender:",
        `<select name="gender">
          <option value="male" ${user.gender === "male" ? "selected" : ""}>Male</option>
          <option value="female" ${user.gender === "female" ? "selected" : ""}>Female</option>
        </select>`,
        "gender",
      )}

      ${makeField(
        "Birthdate:",
        `<input type="date" name="birthdate" value="${formatDateForInput(user.birthdate)}" />`,
        "birthdate",
      )}

      <div class="form-actions">
        <button type="submit" class="save-btn">${isEdit ? "Save" : "Create"}</button>
        <button type="button" class="cancel-btn">Cancel</button>
      </div>
    `;

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

  form.querySelector(".cancel-btn").addEventListener("click", onCancel);

  return form;
};

export default UserForm;
