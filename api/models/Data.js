const mongoose=require("mongoose")

const dataSchema=mongoose.Schema({
    id:{
        type:String,
        // required:true,
        unique:true,
    },
    text:{
        type:String,
        // required:tru>>e,

    },
})

module.exports=mongoose.model("Data",dataSchema)