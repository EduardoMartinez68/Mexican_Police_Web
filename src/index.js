const express=require('express');
const morgan=require('morgan');
const {engine}=require('express-handlebars');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const { database } = require('./keys');
const path=require('path');

//Initialization
const app=express();

//Settings
app.set('port',process.env.PORT || 4000);
app.set('views',path.join(__dirname,'views'))
app.engine('.hbs',engine({ //we will create the engine for the web
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers:require('./lib/handlebars')
}));
app.set('view engine','.hbs');

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//Global variables
app.use((req,res,next)=>{
    next();
});

//Routes
app.use(require('./routes/index.js'));
app.use(require('./routes/authentication'));
app.use('/Mexico',require('./routes/links'));

//Public
app.use(express.static(path.join(__dirname,'public')));

//Starting server
app.listen(app.get('port'),()=>{
    console.log('Server on port ',app.get('port'));
});