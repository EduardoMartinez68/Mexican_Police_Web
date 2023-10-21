const express =require('express');
const router=express.Router();

const pool=require('../database');

router.get('/login',(req,res)=>{
    res.render('links/Login/login');
});

router.get('/dashboard',(req,res)=>{
    res.render('links/Dashboard/dashboard');
});

router.get('/add-user',(req,res)=>{
    res.render('links/Dashboard/addUser');
});

router.get('/users',(req,res)=>{
    res.render('links/Dashboard/police');
});

router.get('/criminals',(req,res)=>{
    res.render('links/Dashboard/criminals');
});

router.get('/upload-criminals',(req,res)=>{
    res.render('links/Dashboard/DataCaptureCriminal');
});

router.get('/profile',(req,res)=>{
    res.render('links/Login/profile');
});

router.post('/login',(req,res)=>{

});

module.exports=router;