import { habits_db } from "../config/conectionDB";

export const createHabit = (userId: number, title: string): Promise<{ id: number, title: string }> => {
  return new Promise((resolve, reject) => {
    habits_db.query("CALL sp_create_habit(?, ?)", [userId, title], (err, results) => {
      if (err) return reject(err);

      const insertedHabit = results[0]?.[0];
      if (insertedHabit) resolve(insertedHabit);
      else reject("No se pudo recuperar el hábito insertado");
    });
  });
};
export const getHabitsByUser = (userId: number): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    habits_db.query("CALL sp_get_habits_by_user(?)", [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]); // resultado anidado
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


  
