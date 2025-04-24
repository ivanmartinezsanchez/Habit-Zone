import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();    

export const habits_db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

habits_db.connect((err) => {
    if (err) throw err;
    console.log('✅ Connected to the HABITS database!');
});