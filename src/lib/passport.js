const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const pool=require('../database');
const helpers=require('../lib/helpers');

passport.use('local.signin',new LocalStrategy({
    usernameField:'username',
    password:'password',
    passReqToCallback:true
},async(req,username,password,done)=>{
    const row=await pool.query('SELECT * FROM usuario where username=?',[username]);
    if(row.length>0){
        const user=row[0];
        const validPassword=await helpers.matchPassword(password,user.password);
        if(validPassword){
            console.log('enter');
            done(null,user,req.flash('success','Bienvenido '+user.username));
        }
        else{
            console.log('no enter');
            done(null,false,req.flash('message','Password incorrecta'));
        }
    }
    else{
        return done(null,false,req.flash('message','el usuario no existe'));
    }
}));

passport.serializeUser((user,done)=>{
    done(null,user.ID_usuario);
});

passport.deserializeUser(async(id,done)=>{
    const rows=await pool.query('SELECT * FROM usuario where ID_usuario=?',[id]);
    done(null,rows[0]);
})
