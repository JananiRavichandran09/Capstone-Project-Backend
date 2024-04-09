import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './Database/dbConfig.js'
import userRouter from './Router/useRouter.js'
import cookieParser from 'cookie-parser'

dotenv.config()
const port = process.env.PORT
const app = express()
app.use(express.json())
app.use(cors({
    origin: ["https://gold-rate-calculation.netlify.app"],
    methods:["GET", "POST"],
    credentials: true
}))
app.use(cookieParser())
connectDB()

app.use('/api/user', userRouter)

app.listen(port, () => {
    console.log("App is running in the port", port);
})

