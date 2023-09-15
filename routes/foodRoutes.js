const { addfood, getAllFoods ,updateAvailableFoods} = require('../controllers/foodsController');
const Foods=require("../model/foodModel")
const multer=require('multer')
const path=require("path")
const fs=require("fs")

const uploadDirectory=path.join(__dirname,'../upload');
fs.mkdirSync(uploadDirectory,{recursive:true})

const storage=multer.memoryStorage();
const upload=multer({storage});

//, login, getAllUsers   //
const router=require('express').Router();

router.post("/addfood",upload.single("foodimg"),async(req,res,next)=>{
    try {
      console.log("hello tiger")
      const {foodname,foodprice}=req.body;
    //   const {foodimg}=req.file;

    const checkFood=await Foods.findOne({foodname});
    
    if(checkFood){
      return res.json({msg:"this food is already added",status:false})
    }
    let {originalname}=req.file;
    originalname=originalname.split(" ").join("");
    const buffer=req.file.buffer;
    fs.writeFileSync(`upload/${originalname}`,buffer)

    let img=originalname;
      const food=await Foods.create({
      foodname:foodname,
      foodprice:foodprice,
      foodimg:img,
      foodAvailable:false
  
     
      })
      return res.json({status:true,food});
    } catch (error) {
      next(error);
    }
  })
// router.post("/login",login)
router.get("/getAllFoods",getAllFoods)
router.post("/updateAvailable/:id",updateAvailableFoods)

module.exports=router;