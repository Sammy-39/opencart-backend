const express = require("express")

const { addOrderItems, 
        getOrdersByUser,
        getOrderById, 
        updateOrderToPaid 
    } = require("../controllers/orderController")
const protect = require("../middlewares/auth")

const router = express.Router()

router.post("/order", protect, addOrderItems)
router.get("/myorders", protect, getOrdersByUser)
router.get("/order/:id", protect, getOrderById)
router.put("/order/:id/pay", protect, updateOrderToPaid)

module.exports = router