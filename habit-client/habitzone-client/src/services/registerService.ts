import api from "./api";

export const registerUser = async (username: string, password: string) => {
  const response = await api.post("/auth/register", { username, password });
  return response.data;
};
