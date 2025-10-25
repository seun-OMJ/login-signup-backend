import pool from "./DatabaseCode/database.js" // make sure the path is correct
import dotenv from 'dotenv';
dotenv.config();


const test = async () => {
    console.log('DB_NAME:', process.env.DB_NAME)
    console.log('DB_NAME:', process.env.DB_USER);
    try {
        const res = await pool.query('SELECT * FROM users;');
        console.log('Users:', res.rows);
    } catch (err) {
        console.error('Error querying users:', err);
        

    } finally {
        await pool.end();
    }
};

test();
