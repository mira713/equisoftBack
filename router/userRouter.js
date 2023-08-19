const express = require("express")
const { UserModel } = require("../model/userModel")
require("dotenv").config()
const userRouter = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { Authentication } = require("../middleware/authentication")

userRouter.post("/register", async (req, res) => {
    const { name, email, password, phone } = req.body
    try {
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            res.send({
                message: "User already exist",
                status: 0,
                error: true
            })
            return
        }
        const hash = await bcrypt.hash(password, 3)//hashing the password with salt round 3
        const user = new UserModel({ name, email, password: hash, phone })
        user.save()
        res.send({
            message: "You have register yourself successfully",
            status: 1,
            error: false
        })
    } catch (error) {
        res.send({
            message: "something went wrong " + error.message,
            status: 0,
            error: true
        })
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            res.send({
                message: "user not found",
                status: 0,
                error: true
            })
            return
        }
        if (user) {
            matchedpassword = await bcrypt.compare(password, user.password)
            const token = jwt.sign({ userId: user._id }, process.env.key)
            if (matchedpassword) {
                res.send({
                    message: "login succesfully",
                    status: 1,
                    error: false,
                    user,
                    token
                })
            } else {
                res.send({
                    message: "password do not match",
                    status: 0,
                    error: true
                })
            }
        }
    } catch (error) {
        res.send({
            message: "Somthing went wrong " + error.message,
            status: 0,
            error: true
        })
    }
})

userRouter.get("/", Authentication, async (req, res) => {
    try {
        const user = await UserModel.find()
        res.send({
            message: "All user data",
            user,
            status: 1,
            error: false
        })
    } catch (error) {
        res.send({
            message: "Something went wrong",
            status: 0,
            error: true
        })
    }
})

userRouter.get("/:id", async (req, res) => {
    const userId = req.params.id
    try {
        const user = await UserModel.findById(userId)
        if (!user) {
            res.send({
                message: "user not found",
                status: 0,
                error: false
            })
            return
        }
        res.send({
            message: " user details",
            user,
            status: 1,
            error: false
        })
    } catch (error) {
        res.send({
            message: "Somthing went wrong",
            status: 0,
            error: true
        })
    }
})

userRouter.patch("/:id", async (req, res) => {
    const userId = req.params.id;
    const updatedata = req.body;
    try {
        const user = await UserModel.findByIdAndUpdate(userId, updatedata, { new: true })
        if (!user) {
            res.send({
                message: "user not found",
                status: 0,
                error: true
            })
            return
        }
        res.send({
            message: "user updated",
            status: 1,
            error: false,
            user
        })
    } catch (error) {
        res.send({
            message: "something went wrong " + error.message,
            status: 0,
            error: true
        })
    }
})

userRouter.delete("/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        await UserModel.findByIdAndDelete(userId)
        res.send({
            message: "user Deleted",
            status: 1,
            error: false
        })
    } catch {
        res.send({
            message: "Something went wrong",
            status: 0,
            error: true
        })
    }
})

module.exports = {
    userRouter
}
