import { apiFetch } from "../utils/apiFetch.js";

export const login = async ({ username, password }) => {
    try {
        const res = await apiFetch.post("users/login", { username, password });

        if (!res.ok) {
            console.error("Login failed:", res.status);
            return null;
        }

        const { user, accessToken } = await res.json();
        localStorage.setItem("user", JSON.stringify({...user, accessToken}));

        return user;
    } catch (err) {
        console.error("Login error:", err);
        return null;
    }
};

export const logout = async () => {
    try {
        const res = await apiFetch.delete("users/logout");

        if (!res.ok) {
            console.error("Logout failed:", res.status);
            return null;
        }

        localStorage.removeItem("user");
        return true;
    } catch (err) {
        console.error("Logout error:", err);
        return null;
    }
};
