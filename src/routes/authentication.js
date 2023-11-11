const express=require('express');
const router=express.Router();
const passport=require('passport');
const {isLoggedIn,isNotLoggedIn}=require('../lib/auth');

router.get('/Mexico/signup',isNotLoggedIn,(req,res)=>{
    res.render('links/web/singup');
});

router.get('/Mexico/login',isNotLoggedIn,(req,res)=>{
    res.render('links/web/login');
});

router.get('/Mexico/logout',(req,res)=>{
    req.logout(function(err) {
        if (err) {
          console.error('Error al desautenticar:', err);
          return res.status(500).json({ message: 'Error al desautenticar' });
        }
        res.redirect('/Mexico/login');
    })
});

router.post('/Mexico/:id/add-department',passport.authenticate('local.add_department',{
    successRedirect: '/Mexico/home', // /fud/:id/food-department
    failureRedirect: '/Mexico/home',
    failureFlash:true
}));


module.exports=router;