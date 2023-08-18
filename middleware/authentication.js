const express=require("express")
const jwt=require("jsonwebtoken")
require("dotenv").config()


const Authentication=(req,res,next)=>{
    const token=req.headers.authorization;

    if(token){
        jwt.verify(token,process.env.key,(err,user)=>{
            if(err){
                return res.send({
                    message:"it looks like token is broken please take look",
                    status:0,
                    error:true

                })
            }
            req.user=user,
            next()
        })
    }else{
        res.send({
            message:"You are not authenticated please login",
            status:0,
            error:true
        })
    }
}

module.exports={
    Authentication
}