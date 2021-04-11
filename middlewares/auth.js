const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")

const protect = asyncHandler(async (req,res,next) =>{
    const token = req.cookies.token
    if(!token){ 
        res.status(401)
        throw new Error("You need to login!")
    }
    const decrypt = await jwt.verify(token, process.env.JWT_SECRET)
    req.user = decrypt
    next()
})

module.exports = protect