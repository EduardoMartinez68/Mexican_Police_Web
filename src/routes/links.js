const express =require('express');
const router=express.Router();

const pool=require('../database');

router.get('/login',(req,res)=>{
    res.render('links/Login/login');
});

router.post('/login',(req,res)=>{

});
module.exports=router;