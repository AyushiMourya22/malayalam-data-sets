const mongoose=require("mongoose")
require("dotenv").config()
mongoose.connect(process.env.MONGOURL).then(()=>{
    console.log("Connection established")
}).catch((e)=>console.log(e))