const express=require('express');
const morgan=require('morgan');
const {engine}=require('express-handlebars');
const multer=require('multer');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const { database } = require('./keys');

const { v4: uuid } = require('uuid');
const path=require('path');

//Initialization
const app=express();
require('./lib/passport.js');

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
require('dotenv').config();
app.use(session({
    secret: 'FudSession',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

/*
const storage=multer.diskStorage({ //this function is for load a image in the forms
    destination: path.join(__dirname,'public/img/uploads'),
    filename: (req,file,cb,filename)=>{
        cb(null,uuid()+path.extname(file.originalname));
    }
});
app.use(multer({storage: storage}).single('image'));*/

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const xlsx = require('xlsx');




app.post('/Mexico/upload-criminals', upload.single('file'), (req, res) => {
    try {
        // read the file XLSX from memory
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

        //we create the list of the data
        var listData=[]
        var listLastNameFather=[] 
        var listLastNameMother=[]
        var listName=[]
        var listSecondName=[]
        var listAlias=[]
        var listBirthday=[]


        var saveData=false;


        // Iterar sobre cada hoja del libro
        workbook.SheetNames.forEach(sheetName => {
            console.log(`Hoja: ${sheetName}`);

            // Obtener la hoja actual
            const sheet = workbook.Sheets[sheetName];

            // variable personal information
            var id_store=0
            var first_name = "";
            var second_name = "";
            var last_name_f = "";
            var last_name_m = "";
            var alias = "";
            var birthday = "";
            var age = 0;
            var sex = "";
            var job = "";
            var disability="";

            //variable family information
            var nameMother=""
            var nameFather=""
            var nameSister=""
            var nameBrother=""
            var statusCivil=""
            var relation=""

            //variable house
            var address=""

            //data for arrest
            id_arrested=0
            reason_for_arrest=""
            place_of_detention=""
            cologne=""
            sector=""
            hour=""
            modus=""
            typeWeapon=""
            sizeWeapon=""
            accomplice=""

             // Iterar sobre cada celda de la hoja
            Object.keys(sheet).forEach(cellRef => {
                // get the value of the row
                const cellValue = sheet[cellRef].v;
                
                //this is the row that be the point of start for save the data
                if (cellRef.startsWith("ED4")){
                    saveData=true;
                }   

                //save the data of the row
                if(saveData){
                    //-----------------------------read the data 
                    // from B5 to D5
                    if (cellRef.startsWith("B")) {
                        last_name_f=cellValue;
                    }        
                    if (cellRef.startsWith("C")){
                        last_name_m=cellValue;
                    }  
                    if (cellRef.startsWith("D")){
                        first_name=cellValue;
                    }

                    //from U4-Y4
                    if (cellRef.startsWith("U")){
                        reason_for_arrest=cellValue;
                    }
                    if (cellRef.startsWith("V")){
                        place_of_detention=cellValue;
                    }
                    if (cellRef.startsWith("W")){
                        cologne=cellValue;
                    }
                    if (cellRef.startsWith("X")){
                        sector=cellValue;
                    }
                    if (cellRef.startsWith("Y")){
                        hour=cellValue;
                    }





                    if (cellRef.startsWith("E") && !cellRef.startsWith("ED")){
                        second_name=cellValue;
                    } 

                    //we reach the end 
                    if (cellRef.startsWith("ED")){
                        //create a object with the data save
                        const personalInformation = [        
                            id_store,
                            last_name_f,
                            last_name_m,
                            first_name,
                            second_name,
                            alias,
                            birthday,
                            age,
                            sex,
                            job,
                            statusCivil,
                            disability
                        ]
                        listData.push(personalInformation);

                        const arrestData=[
                            id_arrested,
                            reason_for_arrest,
                            place_of_detention,
                            cologne,
                            sector,
                            hour,
                            modus,
                            typeWeapon,
                            sizeWeapon,
                            accomplice
                        ]





                        //reset the person's data when we reach the end 
                        id_store=0
                        first_name = "";
                        second_name = "";
                        last_name_f = "";
                        last_name_m = "";
                        alias = "";
                        birthday = "";
                        age = 0;
                        sex = "";
                        job = "";
                        disability=""

                        //reset data family
                        nameMother=""
                        nameFather=""
                        nameSister=""
                        nameBrother=""
                        statusCivil=""
                        relation=""

                        //data detention
                        id_arrested=0
                        reason_for_arrest=""
                        place_of_detention=""
                        cologne=""
                        sector=""
                        hour=""
                        modus=""
                        typeWeapon=""
                        sizeWeapon=""
                        accomplice=""
                    }
                } 
            });
        });
        
        
      console.log(`${listData}`);
      res.send('Archivo cargado y procesado correctamente.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al procesar el archivo.');
    }
  });

  

//Global variables
app.use((req,res,next)=>{
    app.locals.success=req.flash('success');
    app.locals.message=req.flash('message');
    app.locals.user=req.user;
    next();
});

//Routes
app.use(require('./routes/index.js'));
app.use(require('./routes/authentication'));
app.use('/Mexico',require('./routes/links'));

//Public
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'views/partials')));

//Starting server
app.listen(app.get('port'),()=>{
    console.log('Server on port ',app.get('port'));
});