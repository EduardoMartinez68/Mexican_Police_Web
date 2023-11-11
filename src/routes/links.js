const express =require('express');
const router=express.Router();

const pool=require('../database');

router.get('/login',(req,res)=>{
    res.render('links/Login/login');
});

router.get('/dashboard',(req,res)=>{
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
router.get('/add-user',(req,res)=>{
    res.render('links/Dashboard/addUser');
});


router.post('/add-user',async(req,res)=>{

    if(confirm_password(req)){
        const newUser=get_data_user(req);
        if(await add_a_new_user(newUser)){
            res.redirect('/users');
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

function get_data_user(req){
    const {first_name,second_name,last_name_f,last_name_m,user,email,password,level}=req.body;
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

    return newUser;
}

async function add_a_new_user(user){
    var queryText = 'INSERT INTO usuario (first_name, second_name, last_name_father,last_name_mother,usuario,password,id_nivel)'
        +'VALUES ($1, $2, $3, $4, $5, $6, $7)';

    var values = [        
        user.first_name,
        user.second_name,
        user.last_name_f,
        user.last_name_m,
        user.user,
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


router.get('/users',async(req,res)=>{
    const users=await search_users();
    console.log(users)
    res.render('links/Dashboard/police',{users});
});

async function search_users(){
    var queryText = 'select * from usuario';

    //we will see if can add the user to the database
    try{
        const users=await pool.query(queryText)
        return users.rows
    } catch (error) {
        return [];
    }
};

router.get('/:id/delate-user',async(req,res)=>{
    const {id}=req.params;
    var queryText = 'DELETE FROM usuario WHERE id_login = $1';
    var values = [parseInt(id)];
    console.log(values)
    try {
        await pool.query(queryText, values);
    } catch (error) {
        console.error('Error al eliminar el registro en la base de datos:', error);
    }

    res.redirect('/Mexico/users');
});

router.get('/:id/edit-user',async(req,res)=>{
    const {id}=req.params;
    const user=await get_user(id);
    res.render('links/Dashboard/editUser',{user});
});

router.post('/:id/edit-user',async(req,res)=>{
    const {id}=req.params;
    if(confirm_password(req)){
        const user=get_data_user(req);
        if(await update_user(id,user)){
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
    var queryText = 'UPDATE usuario SET first_name = $1, second_name = $2, last_name_father = $3, last_name_mother = $4, usuario = $5,email = $6, password = $7, id_nivel = $8 WHERE id_login = $9';

    var values = [        
        user.first_name,
        user.second_name,
        user.last_name_f,
        user.last_name_m,
        user.user,
        user.email,
        user.password,
        user.level,
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
    var queryText = 'select * from usuario WHERE id_login = $1';
    var values = [parseInt(id)];
    //we will see if can add the user to the database
    try{
        const users=await pool.query(queryText,values)
        return users.rows;
    } catch (error) {
        return [];
    }
};
///-----------------------------------------------------------------------------------------criminals
router.get('/from-criminals',(req,res)=>{
    res.render('links/From/criminals');
});

///-----------------------------------------------------------------------------------------users

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