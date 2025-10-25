import pool from "./database.js"


// Create (Insert new user)
export async function createUser(firstName, lastName, email, hashedPassword) {
    const query = `
    INSERT INTO users (first_name, last_name, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`
    const values = [firstName, lastName, email, hashedPassword]
    const result = await pool.query(query, values)
    return result.rows[0]
}

// Read (Get user by email)
export async function getUserByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1;`
    const result = await pool.query(query, [email])
    return result.rows[0]
}

// Update (Change password or info)
export async function updateUserPassword(email, newHashedPassword) {
    const query = `
    UPDATE users
    SET password = $1
    WHERE email = $2
    RETURNING *;`
    const result = await pool.query(query, [newHashedPassword, email])
    return result.rows[0]
}

// Delete (Remove a user)
export async function deleteUser(email) {
    const query = `DELETE FROM users WHERE email = $1 RETURNING *;`
    const result = await pool.query(query, [email])
    return result.rows[0]
}