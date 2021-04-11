const mongoose = require("mongoose")

const ConnectDb = async () => {
    try{
        const conn = await mongoose.connect(process.env.DBURL,{
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        })

        console.log("Connected to mongodb successfully")

        conn.connection.on("connected", ()=>{
            console.log("Connected to mongodb successfully")
        })

        conn.connection.on("disconnected", ()=>{
            console.log("Disconnected from mongodb")
        })
        
        const gracefulExit = () => {conn.disconnect()}
        process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit)
    }
    catch(err){
        console.log("Connection to mongodb failed "+err)
    }
}

module.exports = ConnectDb