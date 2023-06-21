const express=require("express")

const router=express.Router()
const User =require("../models/User")

const bcrypt=require("bcryptjs")
const {body , validationResult}=require('express-validator')
const jwt=require("jsonwebtoken")
const cookieParser = require('cookie-parser');
const Data = require("../models/Data")
const Annotated = require("../models/Annotated")

router.use(cookieParser());
// router.use(express.json());


router.post("/register",[
    body('email',"Enter a valid email address").isEmail(),
    body('name','Enter a valid name').isLength({min:3}),
    body('password',"The minimum length of password is 4").isLength({min:4}),

], async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    } 
    try{
        const {name,email,password}=req.body
        let user=await User.findOne({email})
        console.log(user)
        if(user){
            return res.status(422).json({"error":"Email already exists"})
        }else{
            const salt=await bcrypt.genSalt(10)
            const securePassword=await bcrypt.hash(password,salt)
            user=await User.create({name,email,password:securePassword})
            res.status(200).json(user)
        }
    }catch(e){
        console.log(e.message)
        res.status(500).send("Some internal error occured")
    }

})



router.post("/login",[
    body("email","Enter a valid email").isEmail(),
    body("password","Password cannot be blank").isLength({min:1}),
]
,async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(user){
            const passok=await bcrypt.compare(password,user.password)
            if(passok){
                const token=jwt.sign({name:user.name,email:user.email,id:user._id},process.env.JWT_SECRET)
                    
                    res.cookie("jwt",token,{ httpOnly: true })
                    res.send({token,user})
                
            }
            else{
                res.status(422).send("Incorrect credentials")
            }
        }else{
            res.status(422).send("Incorrect credentials")
        }
    }catch(e){
        res.status(500).send("Some internal error occured")
    }

})

const authenticateAdminToken = (req, res, next) => {
    const token = req.cookies.jwt;
  
    if (!token) {
      return res.status(401).json({ message: 'Admin authentication token missing' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET,async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired admin token' });
      }
  
      // Retrieve admin details from the database based on the decoded token
      const admin=await User.findOne({ email: decoded.email });
      if (!admin) {
        return res.status(401).json({ message: 'Admin not found' });
    }else{

        req.admin = admin;
        next();
        
    }
    });
  };





  router.get('/login/user/home', authenticateAdminToken, (req, res) => {
    res.json(req.admin);
  });
  





router.post("/logout",(req,res)=>{
    res.cookie("jwt","").json("done")
})


router.get("/alldata",async (req,res)=>{

    console.log(req.body.email)
    try{
        // const alldata=await Data.find({})
        // res.send(alldata)
        const allData = await Data.find({});

        // Find the annotated IDs from the Annotated collection
        const annotatedIDs = await Annotated.find({}, 'id');
    
        // Filter unannotated values
        const unannotatedValues = allData.filter(data => !annotatedIDs.some(annotated => annotated.id === data.id));
    
        console.log(unannotatedValues);
      
          console.log(unannotatedValues);
          res.send(unannotatedValues)
        }
    catch(e){
        res.status(500).send("Server Error")
    }
})

router.post("/alldata/form",async(req,res)=>{
    // console.log(req.body)
    const {formData}=req.body
    try{

        Object.keys(formData).forEach(async function(key, index) {
            const e=await Annotated.findOne({id:formData[key].id})
            if(e){
                
                console.log(formData[key])
                await Annotated.updateOne({id:formData[key].id},{$set:{
                   malayalam:formData[key].tamil,
                   other:formData[key].other,
                }})
            }else{
                
                console.log(formData[key])
                const entry=await Annotated.create({
                    id:formData[key].id,
                    malayalam:formData[key].tamil,
                    other:formData[key].other,
                })
            }
        });
        return res.send("Okayyy")
    }catch(e){
        res.status(400).send("Error")
    }
})

module.exports=router