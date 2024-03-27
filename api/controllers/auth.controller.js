import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import nodemailer from "nodemailer";

import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    //saving a login creditial takes time so we want first one to completely save until then other wait
    res.status(201).json("User created successfully!");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    //to show show password of user and rest here is all info without password that we want to show
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.bodyphoto,
      });
      await newUser.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been loged out!");
  } catch (error) {
    next(error);
  }
};

export const forgotpassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const token = jwt.sign({ email: validUser.email }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      
      tls: {
        ciphers: "SSLv3",
    },
    port: 465,
      secure: false,
      auth: {
        user: "dubeyayush1012@gmail.com",
        pass: process.env.pass_mailer,
      },
    });

    const mailOptions = {
      from: "dubeyayush1012@gmail.com",
      to: email,
      subject: "Reset your password",
      html: `<h1>Reset Your Password</h1>
      <p>Click on the following link to reset your password:</p>
      <a classname="text-blue-600 hover:underline" href="${process.env.ORIGIN}/reset-password/${validUser._id}/${token}">Reset Password</a>
      <p>The link will expire in 5 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

    transporter.sendMail(mailOptions, function (error,info) {
      if (error) {
        console.log(error);
      } else {
        return res.status(200).json({
          success: true,
          message: `Reset token is sent to ${validUser} `,
        });
        
      }
    });
  } catch (error) {
    next(error);
  }
};
export const resetpassword = async (req, res, next) => {
  const { id,token } = req.params;
  const { password } = req.body;
  const { confirm_password } = req.body;
  

  try {
    // const validUser=await User.findOne({params});
    // if(!validUser) return next(errorHandler(404, "User not found"));
    
    if (confirm_password !== password) {
      res.json({
        message: "confirm password does not match",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const update = await User.findByIdAndUpdate({_id:id},{
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "Password has been updated",
    });
  } catch (error) {
    
  next(error);
  }
};
