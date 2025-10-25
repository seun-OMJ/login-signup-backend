import express from 'express'
import bcrypt from 'bcryptjs'
const router = express.Router()

router.post('/signup', async (req, res) => {
    console.log(req.body)
    const { firstName, lastName, email, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 7)
try {
    
} catch (error) {
    console.log(error.mesage)
    res.sendStatus(501)
}

    res.status(201).send({ mesage: "created successfully" })
})

export default router