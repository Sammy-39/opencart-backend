const asyncHandler = require("express-async-handler")
const Product = require("../db/models/product")
const mongoose = require("mongoose")

// Fetch all products
const getProducts =  asyncHandler(async (req,res) =>{
    const products = await Product.find()
    res.status(200).json(products)
})

//Fetch product by id
const getProductById = asyncHandler(async (req,res)=>{
    const product = await Product.findById(req.params.id)
    if(product){
        res.status(200).json(product)
    }
    else{
        res.status(404)
        throw new Error("Product not found!")
    }
})

const createProductReview = asyncHandler( async (req,res)=>{
    const { rating, comment } = req.body 

    const product = await Product.findByIdAndUpdate(req.params.id, 
        {$pull:{'reviews':{'user': mongoose.mongo.ObjectID(req.user._id)}}}, {new: true})
    if(product){
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        product.reviews.unshift(review)
        product.numReviews = product.reviews.length
        product.rating = (product.reviews.reduce((acc,item)=>item.rating+acc, 0) / product.reviews.length).toFixed(1)

        await product.save()
        res.status(201).json({ message: 'Review posted!' })
    }
    else{
        res.status(404)
        throw new Error('Product not found!')
    }
})

module.exports = {getProducts, getProductById, createProductReview}