const express =require('express');
const router=express.Router();

const pool=require('../database');
const helpers=require('../lib/helpers');

const {isLoggedIn,isNotLoggedIn}=require('../lib/auth');

router.get('/login',(req,res)=>{
    res.render('links/Login/login');
});

router.get('/dashboard',isLoggedIn,(req,res)=>{
    res.render('links/Dashboard/dashboard');
});

async function search_data_session(user){
    var queryText = 'select * from session (first_name, second_name, last_name_father,last_name_mother,usuario,password,id_nivel)'
        +'VALUES ($1, $2, $3, $4, $5, $6, $7)';

    var values = [        
        user.first_name,
        user.second_name,
        user.last_name_f,
        user.last_name_m,
        user.email,
        user.password,
        user.level
    ] 

    //we will see if can add the user to the database
    try{
        await pool.query(queryText, values);
        return true;
    } catch (error) {
        console.error('Error to add the data:', error);
        return false;
    }
};






///-----------------------------------------------------------------------------------------users
router.get('/add-user',isLoggedIn,(req,res)=>{
    res.render('links/Dashboard/addUser');
});


router.post('/add-user',async(req,res)=>{
    if(confirm_password(req)){
        const newUser=await get_data_user(req);
        if(await add_a_new_user(newUser)){
            res.redirect('/Mexico/users');
        }
        else{
            res.send('no recived');
        }
    }
    else{
        res.send('password incorrect');
    }
});

function confirm_password(req){
    const {password,confirm_password}=req.body;
    return (password==confirm_password) && (password!='');
}

async function get_data_user(req){
    const {first_name,second_name,last_name_f,last_name_m,user,email,password,level}=req.body;

    if (password == undefined || password == null) {
        const newUser={
            first_name,
            second_name,
            last_name_f,
            last_name_m,
            user,
            email,
            level
        };
        return newUser;
    }

    const newUser={
        first_name,
        second_name,
        last_name_f,
        last_name_m,
        user,
        email,
        password,
        level
    };
    newUser.password=await helpers.encrytPassword(password);
    return newUser;
}

async function add_a_new_user(user){
    var queryText = 'INSERT INTO usuario (nombre, second_name, last_name_father, last_name_mother, username, correo, password, id_nivel) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)';

    var values = [    
        user.first_name,
        user.second_name,
        user.last_name_f,
        user.last_name_m,
        user.user,
        user.email,
        user.password,
        parseInt(user.level)
    ] 
    values.password=await helpers.encrytPassword(user.password);
    console.log(values);
    //we will see if can add the user to the database
    try{
        await pool.query(queryText, values);
        return true;
    } catch (error) {
        console.error('Error to add the data:', error);
        return false;
    }
};


router.get('/users',isLoggedIn,async(req,res)=>{
    const users=await search_users();
    console.log(users)
    res.render('links/Dashboard/police',{users});
});

async function search_users(){
    var queryText = 'SELECT * FROM usuario';

    //we will see if can add the user to the database
    try{
        const users=await pool.query(queryText)
        return users
    } catch (error) {
        return [];
    }
};

router.get('/:id/delate-user',async(req,res)=>{
    const {id}=req.params;
    var queryText = 'DELETE FROM usuario WHERE ID_usuario = ?';
    var values = [parseInt(id)];
    console.log(values)
    try {
        await pool.query(queryText, values);
    } catch (error) {
        console.error('Error al eliminar el registro en la base de datos:', error);
    }

    res.redirect('/Mexico/users');
});

router.get('/:id/edit-user',isLoggedIn,async(req,res)=>{
    const {id}=req.params;
    const user=await get_user(id);
    user.password=
    res.render('links/Dashboard/editUser',{user});
});

router.post('/:id/edit-user',isLoggedIn,async(req,res)=>{
    const {id}=req.params;
    const row=await pool.query('SELECT * FROM usuario where ID_usuario=?',[id]);
    if(row.length>0){
        const user=row[0];
        const use=await get_data_user(req);
        if(await update_user(id,use)){
            res.redirect('/Mexico/users');
        }
        else{
            res.send('no update');
        }
    }
    else{
        res.send('password incorrect');
    }
});

async function update_user(id,user){
    var queryText = 'UPDATE usuario SET nombre = ?, second_name = ?, last_name_father = ?, last_name_mother = ?, username = ?, correo = ?, ID_nivel = ? WHERE ID_usuario = ?';
    console.log(user)
    console.log(user[0])
    const values = [        
        user.first_name,
        user.second_name,
        user.last_name_f,
        user.last_name_m,
        user.user,
        user.email,
        parseInt(user.level),
        id
    ] 

    //we will see if can add the user to the database
    try{
        await pool.query(queryText, values);
        return true;
    } catch (error) {
        console.error('Error to add the data:', error);
        return false;
    }
};


async function get_user(id){
    var queryText = 'select * from usuario WHERE ID_usuario = ?';
    var values = [parseInt(id)];
    //we will see if can add the user to the database
    try{
        const users=await pool.query(queryText,values)
        return users;
    } catch (error) {
        return [];
    }
};
///-----------------------------------------------------------------------------------------criminals
router.get('/from-criminals',isLoggedIn,(req,res)=>{
    res.render('links/From/criminals');
});

///-----------------------------------------------------------------------------------------users

router.get('/criminals',isLoggedIn,(req,res)=>{
    res.render('links/Dashboard/criminals');
});

router.get('/upload-criminals',isLoggedIn,(req,res)=>{
    res.render('links/Dashboard/DataCaptureCriminal');
});

router.get('/profile',isLoggedIn,(req,res)=>{
    res.render('links/Login/profile');
});

router.post('/login',(req,res)=>{

});

module.exports=router;