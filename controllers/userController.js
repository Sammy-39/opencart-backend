const asyncHandler = require("express-async-handler")
const User = require("../db/models/user")
const nodemailer = require("nodemailer")

// Fetch user
const getUserProfile = asyncHandler(async (req,res) =>{
    const user = await User.findById(req.user._id).select('_id name email isAdmin')
    if(user){ res.status(200).json(user) }
    else{
        res.status(404)
        throw new Error("User not found!")
    }
})

// Login user
const authUser = asyncHandler(async (req,res)=>{
    const { email, password } = req.body
    const user = await User.findOne({email})
    if(user && user.isValidPassword(password)){
        const authToken = user.generateToken()
        res.cookie("token", authToken, {
            expires: new Date(Date.now() + 86400000), 
            httpOnly: true,
            secure: true
        })
        res.status(200).json({ 
            message: "Login Success!",
            user : { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin}
        })        
    }
    else{
        res.status(404)
        throw new Error("Invalid email or password!")
    }
})

// Register User
const registerUser = asyncHandler(async (req,res)=>{
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    const userExists = await User.findOne({email: user.email})
    if(userExists) {
        res.status(400)
        throw new Error("EmailId already exists!")
    }
    else{
        await User.create(user)
        res.status(201).json({
            message: "Registered Successfully!"
        })
    }
})

const requestChangePasswordOTP = asyncHandler( async (req,res)=>{
    const { email } = req.body
    const user = await User.findOne({email})
    if(user){

        const resetPasswordOTP = Math.floor(100000 + Math.random() * 900000)

        user.resetPasswordOTP = resetPasswordOTP
        user.resetPasswordOTPExpire = Date.now() + 3600000

        await user.save()

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })

        transporter.sendMail({
            to: user.email,
            from: "no-reply@opencart.com",
            subject: "Password reset",
            html: `
                  <p> You have requested for password reset</p>
                  <p> Use this OTP <strong> ${resetPasswordOTP} </strong>to reset your password </p>
                  <p> This OTP will expire in one hour. </p>
                  <p> If you have not requested to change password ignore the mail. </p>
            `
        })

        res.status(200).json({
            message: "Check your inbox for reset password OTP"
        })
    }
    else{
        res.status(404)
        throw new Error("Email not registered!")
    }
}) 

const resetPassword = asyncHandler( async (req,res)=>{
    const { email, password ,resetPasswordOTP } = req.body

    const user = await User.findOne({email})
    if(user){
        if(user.resetPasswordOTP===Number(resetPasswordOTP)){
            if(user.resetPasswordOTPExpire > Date.now()){
                user.password = password
                user.resetPasswordOTP = undefined
                user.resetPasswordOTPExpire = undefined
                await user.save()
                res.status(200).json({
                    message: "Password updated successfully!"
                })
            }
            else{
                res.status(401)
                throw new Error("OTP expired!")
            }
        }
        else{
            res.status(401)
            throw new Error("Wrong OTP!")
        }
    }
    else{
        res.status(404)
        throw new Error("Email not registered!")
    }
})

module.exports = { getUserProfile, authUser, registerUser, requestChangePasswordOTP, resetPassword }