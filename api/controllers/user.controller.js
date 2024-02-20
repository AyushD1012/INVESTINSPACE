import express from "express";

export const test=(req,res)=>{
    res.json({
        message: "api route is working",
    });

}