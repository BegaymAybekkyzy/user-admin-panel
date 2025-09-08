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
    try {
        const res = await kyAPI.get(`admins/users-management/${id}`);
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const addUser = async (userData) => {
    try {
        const res = await kyAPI.post("admins/users-management/add-user", {json: userData});
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const res = await kyAPI.put(`admins/users-management/${id}`, {json: userData});
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const deleteUser = async (id) => {
    try {
        const res = await kyAPI.delete(`admins/users-management/${id}`);
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
};