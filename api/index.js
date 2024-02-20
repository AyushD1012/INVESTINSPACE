import  express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js"

dotenv.config();


mongoose.connect(process.env.MONGO).then(()=>{
    console.log('Connected to Database Mongodb');
})
.catch((err)=>{
    console.log('Error in connecting the server');
})

const app=express();

app.listen(3000, ()=>{
    console.log('Server is running at port 3000');
})


app.use('/api/user', userRouter);