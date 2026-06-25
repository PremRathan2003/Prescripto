import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middlewares
app.use(express.json())
app.use(cors({
    origin: (origin, callback) => {
        const allowed = [
            'https://prescripto-b2dg.vercel.app',
            'https://prescripto-admin.vercel.app',
            'http://localhost:5173',
            'http://localhost:5174'
        ]
        if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))

// api endpoint 
app.use('/api/admin', adminRouter)
app.use("/api/doctor", doctorRouter)
app.use("/api/user", userRouter);

//                   localhost:4000/api-admin

app.get('/', (req, res) => {
    res.send('API WORKING')
})

app.listen(port, () => console.log("Server Started", port))