import createModal from "../../UI/Modal/Modal.js";
import createToast from "../../UI/Toast/Toast.js";
import "./ProfileEditor.css";
import { getUserSelf, updateUserSelf } from "../../../actions/users.js";
import {validateSafeInput} from "../../../utils/forbiddenPatterns.js";

const ProfileEditor = () => {
  const modal = createModal();

  const openEditor = async () => {
    const user = await getUserSelf();

    const form = document.createElement("form");
    form.className = "profile-form";

    form.innerHTML = `
      <label>
          First Name:
          <input type="text" name="firstName" value="${user.first_name || ""}">
      </label>
      <label>
          Last Name:
          <input type="text" name="lastName" value="${user.last_name || ""}">
      </label>
      <label>
          Username:
          <input type="text" name="username" value="${user.username || ""}">
      </label>
      <label>
          Gender:
          <select name="gender">
              <option value="">Select</option>
              <option value="male" ${user.gender === "male" ? "selected" : ""}>Male</option>
              <option value="female" ${user.gender === "female" ? "selected" : ""}>Female</option>
          </select>
      </label>
      <label>
          Birthdate:
          <input type="date" name="birthdate" value="${user.birthdate ? user.birthdate.split("T")[0] : ""}">
      </label>
      <hr>
      <label>
          Current Password (required to change password):
          <input type="password" name="currentPassword">
      </label>
      <label>
          New Password:
          <input type="password" name="password">
      </label>
    `;

    modal.show({
      title: "Edit Profile",
      content: form,
      footerButtons: [
        {
          label: "Save",
          class: "btn-primary save",
          onClick: async () => {
            const formData = new FormData(form);
            const userData = Object.fromEntries(formData.entries());

            for (const [key, value] of Object.entries(userData)) {
              const result = validateSafeInput(value);
              if (!result.safe) {
                createToast(`${key}: ${result.message}`, "error");
                return;
              }
            }

            try {
              await updateUserSelf(userData);
              createToast("Profile updated successfully!", "success");

              const freshUser = await getUserSelf();
              const updatedUser = {
                id: freshUser.id,
                first_name: freshUser.first_name,
                role: user.role,
              };
              localStorage.setItem("user", JSON.stringify(updatedUser));

              modal.hide();
              window.location.reload();
            } catch (err) {
              let message = "Failed to update profile";
              if (err.response) {
                try {
                  const data = await err.response.json();
                  message = data.error || message;
                } catch {
                  message = err.message || message;
                }
              }
              createToast(message, "error");
            }
          },
        },
        {
          label: "Cancel",
          class: "btn-outline cancel",
          onClick: () => modal.hide(),
        },
      ],
    });
  };

  return { openEditor };
};

export default ProfileEditor;