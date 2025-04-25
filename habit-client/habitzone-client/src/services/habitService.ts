import api from "./api";

export const getHabits = async (token: string) => {
  const response = await api.get("/api/habits", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createHabit = async (title: string, token: string) => {
  const response = await api.post(
    "/api/habits",
    { title },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updateHabit = async (id: number, title: string, token: string) => {
  const response = await api.put(
    `/api/habits/${id}`,
    { title },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteHabit = async (id: number, token: string) => {
  const response = await api.delete(`/api/habits/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
