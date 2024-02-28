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
        default:"https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.winhelponline.com%2Fblog%2Fwp-content%2Fuploads%2F2017%2F12%2Fuser.png&tbnid=_sT5BJJAq9Y_VM&vet=12ahUKEwi4t9Dd486EAxXwSGwGHTCoCu4QMygaegUIARCYAQ..i&imgrefurl=https%3A%2F%2Fwww.winhelponline.com%2Fblog%2Freplace-default-user-account-picture-avatar-windows-10%2F&docid=BlO5mdfz_MWV_M&w=256&h=256&q=default%20user%20photo&ved=2ahUKEwi4t9Dd486EAxXwSGwGHTCoCu4QMygaegUIARCYAQ"
    }
}, {timestamps: true});

const User= mongoose.model('User', userSchema);

export default User;