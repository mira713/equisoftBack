const jwt =require("jsonwebtoken")
require("dotenv").config()


const Validator=(req,res,next)=>{
    const token=req.headers.tkn

    if(token){
        jwt.verify(token,process.env.key,async(err,decoded)=>{
            if(err){
                res.send({
                    message:"Somthing went wrong "+err.message,
                    status:0,
                    error:true
                })
            }
            if(decoded){
                if(Array.isArray(req.body)){
                    req.body.forEach((el)=>{
                        el.user=decoded.userId
                        console.log(req.body)
                        
                    })
                }else{
                    req.body.user=decoded.userId
                    console.log(req.body)
                }
                next()
            }else{
                res.send({
                    message:"Something went wrong "+ err.message,
                    status:0,
                    error:true
                })
            }
        })
    }
}

module.exports={
    Validator
}