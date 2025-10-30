import express from 'express'
import authRoutes from './routes/authRoutes.js'
import EmailSendRoutes from './routes/EmailSendRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use('/', authRoutes)
app.use('/requestPasswordReset', EmailSendRoutes)


app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
})
