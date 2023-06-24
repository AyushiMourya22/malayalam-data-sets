const importData=async(req,res)=>{
    try{
        res.status(200).send("Okauyyyy")
    }catch(e){
        res.status(400).send(e.message)
    }
}

module.exports={
    importData
}