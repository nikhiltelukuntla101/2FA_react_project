import api from "./api";
export const register = async (username, password) => {
  return await api.post("/auth/register", {
    username,
    password,
  });
};

export const loginUser = async (username, password) => {
  return await api.post(
    "/auth/login",
    {
      username,
      password,
    },
    {
      withCredentials: true,
    },
  );
};

export const authStatus = async () => {
  return await api.get("/auth/status", {
    withCredentials: true,
  });
};

export const logOutUser = async () => {
  return await api.get("/auth/status", {
    withCredentials: true,
  });
};
