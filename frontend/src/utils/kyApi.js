import ky from "ky";
import { API_BASE_URL } from "./globalConstants.js";
import {logout, refreshAccessToken} from "../actions/users.js";

const kyAPI = ky.create({
    prefixUrl: API_BASE_URL,
    credentials: "include",
    hooks: {
        beforeRequest: [
            request => {
                const user = JSON.parse(localStorage.getItem("user") || "null");
                if (user?.accessToken) {
                    request.headers.set("Authorization", `Bearer ${user.accessToken}`);
                }
            }
        ],
        afterResponse: [
            async (request, options, response) => {
                if (response.status === 401 && !options._retry) {
                    options._retry = true;

                    let newToken;
                    try {
                        newToken = await refreshAccessToken();
                    } catch (e) {
                        await logout();
                        throw e;
                    }

                    if (!newToken) {
                        await logout();
                        throw new Error("Failed to update token");
                    }

                    const user = JSON.parse(localStorage.getItem("user") || "null");
                    if (user) {
                        user.accessToken = newToken;
                        localStorage.setItem("user", JSON.stringify(user));
                    }

                    const retryHeaders = new Headers(options.headers ?? request.headers);
                    retryHeaders.set("Authorization", `Bearer ${newToken}`);

                    return ky(request, { ...options, headers: retryHeaders });
                }

                return response;
            }
        ]
    }
});

export default kyAPI;
