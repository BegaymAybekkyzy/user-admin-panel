import "./EditUserForm.css";

const EditUserForm = (user, onSubmit, onCancel) => {
    const form = document.createElement("form");
    form.className = "edit-user-form";

    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };


    form.innerHTML = `
    <label>
      First Name:
      <input type="text" name="firstName" value="${user.first_name || ""}" />
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
    <label>
      Role:
      <select name="role">
        <option value="">-</option>
        <option value="user" ${user.role === "user" ? "selected" : ""}>User</option>
        <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
      </select>
    </label>
    <div class="form-actions">
      <button type="submit" class="save-btn">Save</button>
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

export default EditUserForm;
