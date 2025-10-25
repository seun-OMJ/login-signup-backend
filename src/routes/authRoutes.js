import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
import { createUser, getUserByEmail } from '../DatabaseCode/databaseQueries.js'
const router = express.Router()

router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    console.log(req.body)
    try {
        const existingUser = await getUserByEmail(email)
        if(existingUser){
            return res.status(400).send({message:"user already exists"})
        }
        const hashedPassword = bcrypt.hashSync(password, 7)
        const newUser =  await createUser(firstName, lastName, email, hashedPassword)
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.status(201).json({
            message: "User created successfully",
            user: newUser,
            token: token
});
        
    } catch (error) {
        console.log(error.message)
        res.sendStatus(501)
    }
})

export default router