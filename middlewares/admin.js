var jwt=require("jsonwebtoken")

const getAdmin=(req,res,next)=>{

    const token=req.cookies.token
    if(!token){
        res.status(401).send({error:"Please authenticate using a valid token"})  
    }
    try {
        jwt.verify(token,process.env.JWT_SECRET,{},(err,user)=>{
            if(err)throw err
            req.user=user
            next()
        })
        
    } catch (error) {
        res.status(401).send({error:"Please authenticate using a valid token"})  
        
    }

}


module.exports=getAdmin