import kyAPI from "../utils/kyApi.js";
import { API_BASE_URL } from "../utils/globalConstants.js";

export const login = async ({ username, password }) => {
  try {
    const res = await kyAPI.post("users/login", {
      json: { username, password },
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
  await kyAPI.delete("users/logout");
  return true;
};

export const updateUserSelf = async (userData) => {
  const res = await kyAPI.put("admins/users/me", {
    json: userData,
  });
  return await res.json();
};

export const getUserSelf = async () => {
  const res = await kyAPI.get("admins/users/me");
  return await res.json();
};

export const deleteUserSelf = async ({ currentPassword }) => {
  await kyAPI.delete("admins/users/me", {
    json: { currentPassword },
  });
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
