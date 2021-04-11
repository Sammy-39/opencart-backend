const asyncHandler = require("express-async-handler")
const User = require("../db/models/user")

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
            //secure: true
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

module.exports = { getUserProfile, authUser, registerUser }