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

    form.innerHTML = `
      ${!isEdit ? `
      <label>
        Username:
        <input type="text" name="username" value="${user.username || ""}" required />
      </label>
      
      <label>
        Password:
        <input type="password" name="password" required />
      </label>
      ` : ""}
      
      <label>
        First Name:
        <input type="text" name="firstName" value="${user.first_name || ""}" required />
      </label>
      
      <label>
        Last Name:
        <input type="text" name="lastName" value="${user.last_name || ""}" />
      </label>
      <label>

        Gender:
        <select name="gender">
          <option value="">-</option>
          <option value="male" ${user.gender === "male" ? "selected" : ""}>Male</option>
          <option value="female" ${user.gender === "female" ? "selected" : ""}>Female</option>
        </select>
      </label>
      
      <label>
        Birthdate:
        <input type="date" name="birthdate" value="${formatDateForInput(user.birthdate)}" />
      </label>
      
      <div class="form-actions">
        <button type="submit" class="save-btn">${isEdit ? "Save" : "Create"}</button>
        <button type="button" class="cancel-btn">Cancel</button>
      </div>
    `;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        onSubmit(data);
    });

    form.querySelector(".cancel-btn").addEventListener("click", onCancel);

    return form;
};

export default UserForm;