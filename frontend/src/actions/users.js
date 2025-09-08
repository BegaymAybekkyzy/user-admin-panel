import kyAPI from "../utils/kyApi.js";
import {API_BASE_URL} from "../utils/globalConstants.js";

export const login = async ({ username, password }) => {
    try {
        const res = await kyAPI.post("users/login", {
            json: { username, password }
        });

        const { user, accessToken } = await res.json();
        localStorage.setItem("user", JSON.stringify({ ...user, accessToken }));

        return user;
    } catch (err) {
        console.error("Login error:", err);
        return null;
    }
};

export const logout = async () => {
    try {
        await kyAPI.delete("users/logout");
    } catch (err) {
        console.error("Logout error:", err);
    }
    localStorage.removeItem("user");
    return true;
};

export const refreshAccessToken = async () => {
    const res = await fetch(`${API_BASE_URL}users/refresh`, {
        method: "POST",
        credentials: "include",
    });

    if (!res.ok) return null;
    const { accessToken } = await res.json();
    return accessToken;
};
