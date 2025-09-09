import dayjs from "dayjs";

const UserDetails = (details) => {
    const wrapper = document.createElement("div");
    wrapper.className = "user-details";

    wrapper.innerHTML = `
    <p><b>ID:</b> ${details.id}</p>
    <p><b>Username:</b> ${details.username}</p>
    <p><b>First Name:</b> ${details.first_name}</p>
    <p><b>Last Name:</b> ${details.last_name}</p>
    <p><b>Birthdate:</b> ${details.birthdate ? dayjs(details.birthdate).format("DD.MM.YYYY") : "-"}</p>
    <p><b>Gender:</b> ${details.gender || "-"}</p>
    <p><b>Role:</b> ${details.role || "-"}</p>
  `;

    return wrapper;
};

export default UserDetails;