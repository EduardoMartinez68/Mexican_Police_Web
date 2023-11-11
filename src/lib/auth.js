//we will watch if the user is login
module.exports={
    isLoggedIn(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        return res.redirect('/Mexico/login');
    },

    isNotLoggedIn(req,res,next){
        if(!req.isAuthenticated()){
            return next();
        }
        return res.redirect('/Mexico/home');
    }
};