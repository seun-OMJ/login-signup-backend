import express from 'express'
import authRoutes from './routes/authRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use('/', authRoutes)


app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
})