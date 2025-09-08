import { API_BASE_URL } from "./globalConstants.js";

let accessToken = localStorage.getItem("accessToken");

const refreshAccessToken = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/users/refresh`, {
            method: "POST",
            credentials: "include",
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data.accessToken;
    } catch (err) {
        console.error("Refresh error:", err);
        return null;
    }
};

export const api = async (endpoint, options = {}) => {
    const makeRequest = async (token = accessToken) => {
        const headers = new Headers(options.headers || {});

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        return fetch(`${API_BASE_URL}/${endpoint}`, {
            ...options,
            headers,
            credentials: "include",
        });
    };

    try {
        let res = await makeRequest();

        if (res.status === 401) {
            const newToken = await refreshAccessToken();

            if (newToken) {
                accessToken = newToken;
                localStorage.setItem("accessToken", newToken);

                res = await makeRequest(newToken);
            }
        }

        return res;
    } catch (err) {
        console.error("apiFetch error:", err);
        throw err;
    }
};

export const apiFetch = {
    get: (endpoint, options = {}) =>
        api(endpoint, { ...options, method: "GET" }),

    post: (endpoint, data, options = {}) =>
        api(endpoint, {
            ...options,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
            body: JSON.stringify(data),
        }),

    put: (endpoint, data, options = {}) =>
        api(endpoint, {
            ...options,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
            body: JSON.stringify(data),
        }),

    delete: (endpoint, options = {}) =>
        api(endpoint, { ...options, method: "DELETE" }),
};