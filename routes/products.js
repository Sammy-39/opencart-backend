const express = require("express")
const { getProducts, getProductById, createProductReview } = require("../controllers/productController")
const protect = require("../middlewares/auth")

const router = express.Router()

router.get("/products", getProducts)

router.get("/product/:id", getProductById)

router.post("/product/:id/review", protect, createProductReview)

module.exports = router