const express = require("express")
const { getUserProfile, authUser, registerUser } = require("../controllers/userController")
const protect = require("../middlewares/auth")

const router = express.Router()

router.route("/profile").get(protect, getUserProfile)
router.post("/login", authUser)
router.post("/register", registerUser)

module.exports = router