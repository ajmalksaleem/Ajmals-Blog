import express from 'express'
import connectDb from './db/connection.js'
import {config} from 'dotenv'
import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'

const app = express()
app.use(express.json())
config()

connectDb()
.then(()=>{
    app.listen(3000, ()=>{
        console.log("server started running  .!")
       
    })
})
.catch((err)=>{
    console.log(err)
})


app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)