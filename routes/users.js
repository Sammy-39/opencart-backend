const express = require("express")
const { 
    getUserProfile, 
    authUser, 
    registerUser, 
    requestChangePasswordOTP,
    resetPassword
} = require("../controllers/userController")
const protect = require("../middlewares/auth")

const router = express.Router()

router.route("/profile").get(protect, getUserProfile)
router.post("/login", authUser)
router.post("/register", registerUser)
router.post("/forgot-password", requestChangePasswordOTP)
router.post("/reset-password", resetPassword)

module.exports = router