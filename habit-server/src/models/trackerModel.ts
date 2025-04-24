import { habits_db } from "../config/conectionDB";

export const markHabit = (habitId: number, date: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    habits_db.query("CALL sp_mark_habit(?, ?)", [habitId, date], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

export const getTrackingByHabit = (habitId: number): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    habits_db.query("CALL sp_get_tracking_by_habit(?)", [habitId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

export const getTrackingByDate = (userId: number, date: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    habits_db.query("CALL sp_get_tracking_by_date(?, ?)", [userId, date], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};
