const express=require("express")

const router=express.Router()
const Admin=require("../models/Admin")

const bcrypt=require("bcryptjs")
const {body , validationResult}=require('express-validator')
const jwt=require("jsonwebtoken")



const cookieParser=require('cookie-parser')
router.use(cookieParser())

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
        let user=await Admin.findOne({email})
        console.log(user)
        if(user){
            return res.status(422).json({"error":"Email already exists"})
        }else{
            const salt=await bcrypt.genSalt(10)
            const securePassword=await bcrypt.hash(password,salt)
            user=await Admin.create({name,email,password:securePassword})
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
        const userDoc=await Admin.findOne({email})
        if(userDoc){
            const passok= await bcrypt.compare(password,userDoc.password)
            if(passok){
                
                const token=jwt.sign({name:userDoc.name,email:userDoc.email,id:userDoc._id},process.env.JWT_SECRET)
                res.cookie("jwt",token,{ httpOnly: true })
                    res.send({token,userDoc})
                
            }else{
                res.status(422).send("Incorrect credentials")
            }
        }
        else{
            res.status(422).send("Incorrect credentials")
        }
    }catch(e){
        res.status(500).send("Some internal error occured")
    }

})


const getAdmin = require("../middlewares/admin")
router.get("/getadmin",getAdmin,async(req,res)=>{
    try {
        const user=req.user
         res.status(200).send(user)
        
    } catch (error) {
        console.log(error.message)
         res.status(500).send("Some internal error occured")
    }
})


router.post("/logout",(req,res)=>{
    res.cookie("token","").json("done")
})



const multer = require('multer');
const csvtojson = require('csvtojson');
const Data = require("../models/Data")
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/addData', upload.single('csvFile'), (req, res) => {
    const fileBuffer = req.file.buffer;
  
    // Convert CSV to JSON
    csvtojson()
      .fromString(fileBuffer.toString())
      .then(async(jsonArrayObj) => {
        // Store JSON data in MongoDB
        try{
            await Data.insertMany(jsonArrayObj);
            res.json({ message: 'Data inserted successfully' });
        }catch(e){
            res.send(e.message)
        }
        }
        )
        .catch((err) => {
            console.error('Failed to convert CSV to JSON:', err);
            res.status(500).json({ error: 'Failed to convert CSV to JSON' });
          });
      })
router.get("/getalldata",async(req,res)=>{
    // const data=await Data.find({})
    // res.send(data)
    const pageNumber = req.query.page || 1; // Get the current page number from the query parameters
    const pageSize = 50; // Number of items per page

    Data.paginate({}, { page: pageNumber, limit: pageSize }, (err, result) => {
  if (err) {
    return res.status(500).json({ message: 'Error occurred while fetching users.' });
  }

  const { docs, total, limit, page, pages } = result;
  res.json({ users: docs, total, limit, page, pages });
});
})


module.exports=router