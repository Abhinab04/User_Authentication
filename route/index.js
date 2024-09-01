const express=require('express')
const router = express.Router();

router.get('/',(req,res)=>{
    res.render("wel")
})

router.get('/dashboard',(req,res)=>{
    res.render("dashboard",{
        name:req.user.name
    });
    
})

module.exports=router;