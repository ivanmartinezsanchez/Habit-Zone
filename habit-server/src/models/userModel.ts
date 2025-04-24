import { habits_db } from "../config/conectionDB";
import { User } from "../types/user";

export const findUserByUsername = (username: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    habits_db.query("CALL sp_find_user(?)", [username], (err, results) => {
      if (err) return reject(err);
      const user = results[0][0]; // resultado anidado
      resolve(user || null);
    });
  });
};

export const createUser = (username: string, hashedPassword: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    habits_db.query("CALL sp_create_user(?, ?)", [username, hashedPassword], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

