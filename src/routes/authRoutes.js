import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail } from '../DatabaseCode/databaseQueries.js';
dotenv.config();
const router = express.Router()

router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    console.log(req.body)
    try {
        const existingUser = await getUserByEmail(email)
        if (existingUser) {
            return res.status(400).send({ message: "user already exists" })
        }
        const hashedPassword = bcrypt.hashSync(password, 7)
        const newUser = await createUser(firstName, lastName, email, hashedPassword)
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


router.post('/login', async (req, res) => {
    const { email, password } = req.body
    console.log(req.body)
    try {
        const existingUser = await getUserByEmail(email)
        if (!existingUser) {
            return res.status(400).send({ message: "invalid email" })
        }
        const passwordIsValid = bcrypt.compareSync(password, existingUser.password)
        if (!passwordIsValid) {
            return res.status(401).send({ message: "Invalid login attempt!" })
        }
        const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.status(201).json({
            message: "Login attempt successful",
            token: token
        });

    } catch (error) {
        console.log(error.message)
        res.sendStatus(501)
    }
})

router.post('/resetPassword', async (req, res) => {
    const { token, email, password } = req.body

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const email = decoded.email
        const hashedPassword = bcrypt.hashSync(password, 7)
        const updatedUser = await updateUserPassword(email, hashedPassword)
        res.status(200).json({
            message: "password reset successful"
        })
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).send({ message: "Reset link expired" });
        }
        res.status(400).send({ message: "Invalid or expired token" });
    }
})

export default router