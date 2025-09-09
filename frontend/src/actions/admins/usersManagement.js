import kyAPI from "../../utils/kyApi.js";

export const fetchUsers = async ({
                                     page = 1,
                                     limit = 10,
                                     username = "",
                                     firstName = "",
                                     birthdate = "",
                                     sortBy = "first_name",
                                     order = "asc"
                                 } = {}) => {

    const res = await kyAPI.get("admins/users-management/", {
        searchParams: {page, limit, username, firstName, birthdate, sortBy, order}
    });
    return await res.json();

};

export const getUserById = async (id) => {
    const res = await kyAPI.get(`admins/users-management/${id}`);
    return await res.json();
};

export const addUser = async (userData) => {
    const res = await kyAPI.post("admins/users-management/add-user",
        {json: userData});
    return await res.json();
};

export const updateUser = async (id, userData) => {
    const res = await kyAPI.put(`admins/users-management/update-user/${id}`,
        {json: userData});
    return await res.json();
};

export const deleteUser = async (id) => {
    const res = await kyAPI.delete(`admins/users-management/${id}`);
    return await res.json();
};