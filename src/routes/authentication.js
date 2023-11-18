const express=require('express');
const router=express.Router();
const passport=require('passport');
const {isLoggedIn,isNotLoggedIn}=require('../lib/auth');

router.get('/Mexico/signin',isNotLoggedIn,(req,res)=>{
    res.render('links/Login/login');
});

router.post('/Mexico/signin',passport.authenticate('local.signin',{
    successRedirect:'/Mexico/dashboard',
    failureRedirect:'/Mexico/signin',
    failureFlash:true
}));


router.get('/Mexico/login',isNotLoggedIn,(req,res)=>{
    res.render('links/Login/login');
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

router.get('/Mexico/logout',(req,res)=>{
    console.log('enter')
    req.logOut();
    res.redirect('/Mexico/signin');
})

module.exports=router;