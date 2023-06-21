const mongoose=require("mongoose")
const mongoosePaginate = require('mongoose-paginate');

const dataSchema=mongoose.Schema({
    id:{
        type:String,
        // required:true,
        unique:true,
    },
    text:{
        type:String,
        // required:true,

    },
})

dataSchema.plugin(mongoosePaginate);
module.exports=mongoose.model("Data",dataSchema)