const express =require('express');
const router=express.Router();

const pool=require('../database');

router.get('/login',(req,res)=>{
    res.render('links/Login/login');
});

router.get('/dashboard',(req,res)=>{
    res.render('links/Dashboard/dashboard');
});


router.post('/login',(req,res)=>{

});
module.exports=router;