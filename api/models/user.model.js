import { timeStamp } from "console";
import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique: true,
        required:true

    },
    email:{
        type:String,
        unique: true,
        required:true

    },
    password:{
        type:String,
        required:true

    },
    avatar:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTcoK-dlbjL7C1eAPifV1gUs2n6ukUugyM-J5wFbSEptPEn7GCoJXnFXMDlp9SdP-JcIQ&usqp=CAU"
    }
}, {timestamps: true});

const User= mongoose.model('User', userSchema);

export default User;