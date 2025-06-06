import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();    

export const habits_db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

habits_db.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to DB:', err.message);
        return;
    }
    console.log('✅ Connected to the HABITS database!');
});
