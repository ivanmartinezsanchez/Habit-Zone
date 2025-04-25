import api from "./api";

export const markHabitAsDone = async (habitId: number, date: string, token: string) => {
  await api.post(
    "/api/tracker",
    { habitId, date },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const getTrackingByHabit = async (token: string, habitId: number) => {
  const response = await api.get(`/api/tracker/habit/${habitId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getTrackingByDate = async (token: string, date: string) => {
  const response = await api.get(`/api/tracker/date/${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
