const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("dotenv").config()

const ConnectDb = require("./db/connectDb")
const {notFound, errorHandler} = require("./middlewares/errorHandler")


const app = express()

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())
app.use(express.static("public"))
app.use(cookieParser())

// Connect to mongodb
ConnectDb()

// routes
const productsRouter = require("./routes/products")
const usersRouter = require("./routes/users")
const ordersRouter = require("./routes/orders")
const protect = require("./middlewares/auth")

app.use("/api",productsRouter)
app.use("/api",usersRouter)
app.use("/api",ordersRouter)

app.get("/api/config/paypal", protect, (req,res)=>res.send(process.env.PAYPAL_CLIENT_ID))

// error handlers
app.use(notFound)
app.use(errorHandler)


const port = process.env.PORT || 5000

app.listen(port, ()=>{
    console.log("Server is running on http://localhost:"+port)
})