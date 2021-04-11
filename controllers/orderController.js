const asyncHandler = require("express-async-handler")
const Order = require("../db/models/order")

// Create new order
const addOrderItems =  asyncHandler(async (req,res) =>{
    const { 
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice 
    } = req.body

    if(orderItems && orderItems.length===0){
        res.status(400)
        throw new Error('No order items!')
    }
    else{
        const order = new Order({
            user: req.user._id,
            orderItems, 
            shippingAddress, 
            paymentMethod, 
            itemsPrice, 
            taxPrice, 
            shippingPrice, 
            totalPrice
        })
        
        const newOrder = await order.save()
        res.status(201).json(newOrder)
    }
})

const getOrdersByUser = asyncHandler( async(req,res)=>{
    const orders = await Order.find({user:req.user._id}).sort({'updatedAt': -1})
    res.status(200).json(orders)
})

const getOrderById = asyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "name email")
    if(order){
        res.status(200).json(order)
    }
    else{
        res.status(404)
        throw new Error("Order not found!")
    }
})

const updateOrderToPaid = asyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id)
    if(order){
        const { id, status, update_time, payer } = req.body
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id, 
            status,
            update_time,
            email_address : payer.email_address
        }

        const updatedOrder = await order.save()

        res.status(204).json(updatedOrder)
    }
    else{
        res.status(404)
        throw new Error("Order not found!")
    }
})

module.exports = { addOrderItems, getOrdersByUser, getOrderById, updateOrderToPaid }