import { habits_db } from "../config/conectionDB";
import { RowDataPacket } from "mysql2";
import { Habit } from "../types/habit";

export const createHabit = (userId: number, title: string): Promise<Habit> => {
  return new Promise((resolve, reject) => {
    habits_db.query("CALL sp_create_habit(?, ?)", [userId, title], (err, results: RowDataPacket[][]) => {
      if (err) return reject(err);
      const insertedHabit = results[0]?.[0] as Habit;
      if (insertedHabit) resolve(insertedHabit);
      else reject("❗ No se pudo recuperar el hábito insertado");
    });
  });
};

export const getHabitsByUser = (userId: number): Promise<Habit[]> => {
  return new Promise((resolve, reject) => {
    habits_db.query("CALL sp_get_habits_by_user(?)", [userId], (err, results: RowDataPacket[][]) => {
      if (err) return reject(err);
      resolve(results[0] as Habit[]);
    });
  });
};

export const updateHabit = (habitId: number, userId: number, title: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    habits_db.query("CALL sp_update_habit(?, ?, ?)", [habitId, userId, title], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

export const deleteHabit = (habitId: number, userId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    habits_db.query("CALL sp_delete_habit(?, ?)", [habitId, userId], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};
