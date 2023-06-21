const mongoose =require("mongoose")

const annotatedSchema= mongoose.Schema({
    id:{
        type:String,
        required:true,
    },
    
    malayalam:{
        type:String,
        // required:true,
        
    },
    other:{
        type:String,
        // required:true,

    }
})

module.exports=mongoose.model("Annotated",annotatedSchema)