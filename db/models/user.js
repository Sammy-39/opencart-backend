const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    resetPasswordOTP :{
        type: Number
    },
    resetPasswordOTPExpire :{
        type: Date
    }
},{timestamps: true})

userSchema.methods.isValidPassword = function(pwd) {
    return bcrypt.compareSync(pwd, this.password)
}

userSchema.methods.generateToken = function() {
    return jwt.sign({
        _id: this._id, 
        email: this.email,
        name: this.name
    }, process.env.JWT_SECRET,{expiresIn: '1d'})
}

userSchema.pre("save", function(next){
    if(this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, 10)
    }
    next()
})

const User = mongoose.model("User",userSchema)

module.exports = User