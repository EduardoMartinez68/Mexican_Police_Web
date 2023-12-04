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
const pool=require('./database');

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
const { Console } = require('console');




app.post('/Mexico/upload-criminals', upload.single('file'),async(req, res) => {
    try {
        // read the file XLSX from memory
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

        //we create the list of the data
        var listData=[]
        var listDataForArrest=[]
        var listDataFamily=[]
        var listAnthropometricData=[]
        var listCriminalAddress=[]
        var listTrunkTattoos=[]
        var listFaceTattoos=[]
        var listLowerTattoos=[]
        var listTopTattoos=[]
        var listStoppedVehicle=[]
        var listClothingDescription=[]
        var saveData=false;
        


        // Iterar sobre cada hoja del libro
        workbook.SheetNames.forEach(sheetName =>{
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
            var street=""
            var NOAbroad=""
            var NOInterior=""
            var domicileColony=""

            //data for arrest
            id_arrested=get_id()
            reason_for_arrest=""
            place_of_detention=""
            cologne=""
            sector=""
            hour=""
            modus=""
            typeWeapon=""
            sizeWeapon=""
            accomplice=""

            //variable for anthropomorphic  data 
            var height=0;
            var headShape="";
            var hair="";
            var colorHair="";
            var eyebrows="";
            var eyeSize="";
            var earSize="";
            var complexion="";
            var facialHair="";

            //addictions
            var typeAddictions="";

            // Ropa y accesorios
            var hat = "";
            var hatColor = "";
            var hatFeature = "";
            var glasses = "";
            var top = "";
            var topColor = "";
            var print = "";
            var brand = "";
            var sleeve = "";
            var bottom = "";
            var bottomColor = "";
            var bottomFeature = "";
            var backpack = "";
            var backpackColor = "";
            var backpackFeature = "";
            var footwear = "";
            var footwearColor = "";
            var footwearFeature = "";
            var waistBag = "";
            var waistBagColor = "";
            var helmet = "";
            var helmetColor = "";

            // Rostro
            var leftFront = "";
            var rightFront = "";
            var centerFront = "";
            var leftCheek = "";
            var rightCheek = "";
            var leftTemple = "";
            var rightChin = "";

            // Tatuajes en el torso
            var leftNeck = "";
            var rightNeck = "";
            var centerNeck = "";
            var leftNape = "";
            var rightNape = "";
            var centerNape = "";
            var leftBack = "";
            var rightBack = "";
            var centerBack = "";
            var leftChest = "";
            var rightChest = "";
            var centerChest = "";
            var leftAbdomen = "";
            var rightAbdomen = "";
            var centerAbdomen = "";
            var leftGroin = "";
            var rightGroin = "";
            var centerGroin = "";

            // Tatuajes superiores
            var leftShoulder = "";
            var rightShoulder = "";
            var leftArm = "";
            var rightArm = "";
            var leftElbow = "";
            var rightElbow = "";
            var leftForearm = "";
            var rightForearm = "";
            var leftWrist = "";
            var rightWrist = "";
            var leftHand = "";
            var rightHand = "";

            // Tatuajes inferiores
            var leftHip = "";
            var rightHip = "";
            var centerHip = "";
            var leftThigh = "";
            var rightThigh = "";
            var leftKnee = "";
            var rightKnee = "";
            var leftLeg = "";
            var rightLeg = "";
            var leftCalf = "";
            var rightCalf = "";
            var leftAnkle = "";
            var rightAnkle = "";
            var leftHeel = "";
            var rightHeel = "";
            var leftFoot = "";
            var rightFoot = "";

            // Vehículo
            var vehicleBrand = "";
            var subBrand = "";
            var vehicleType = "";
            var series = "";
            var licensePlates = "";
            var engine = "";
            var model = "";

            // Otros
            var modus = "";
            var weaponType = "";
            var weaponSize = "";
            var disability = "";
            var robbery = "";
            var detentionRecord = "";

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

                    if (cellRef.startsWith("Q")) {
                        street = cellValue;
                    }
                    if (cellRef.startsWith("R")) {
                        NOAbroad = cellValue;
                    }
                    if (cellRef.startsWith("S")) {
                        NOInterior = cellValue;
                    }
                    if (cellRef.startsWith("T")) {
                        domicileColony = cellValue;
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

                    //Z4 to AH4   
                    if (cellRef.startsWith("Z")){
                        height=cellValue;
                    }            
                    if (cellRef.startsWith("AA")){
                        headShape=cellValue;
                    }   
                    if (cellRef.startsWith("AB")){
                        hair=cellValue;
                    }   
                    if (cellRef.startsWith("AC")){
                        colorHair=cellValue;
                    }   
                    if (cellRef.startsWith("AD")){
                        eyebrows=cellValue;
                    }   
                    if (cellRef.startsWith("AE")){
                        eyeSize=cellValue;
                    }   
                    if (cellRef.startsWith("AF")){
                        earSize=cellValue;
                    }   
                    if (cellRef.startsWith("AG")){
                        complexion=cellValue;
                    }   
                    if (cellRef.startsWith("AH")){
                        facialHair=cellValue;
                    }   

                    //addictions
                    if (cellRef.startsWith("AG")){
                        typeAddictions=cellValue;
                    }   
                    
                    //Clothing description
                    if (cellRef.startsWith("AJ")) {
                        hat = cellValue;
                    } else if (cellRef.startsWith("AK")) {
                        hatColor = cellValue;
                    } else if (cellRef.startsWith("AL")) {
                        hatFeature = cellValue;
                    } else if (cellRef.startsWith("AM")) {
                        glasses = cellValue;
                    } else if (cellRef.startsWith("AN")) {
                        top = cellValue;
                    } else if (cellRef.startsWith("AO")) {
                        topColor = cellValue;
                    } else if (cellRef.startsWith("AP")) {
                        print = cellValue;
                    } else if (cellRef.startsWith("AQ")) {
                        brand = cellValue;
                    } else if (cellRef.startsWith("AR")) {
                        sleeve = cellValue;
                    } else if (cellRef.startsWith("AS")) {
                        bottom = cellValue;
                    } else if (cellRef.startsWith("AT")) {
                        bottomColor = cellValue;
                    } else if (cellRef.startsWith("AU")) {
                        bottomFeature = cellValue;
                    } else if (cellRef.startsWith("AV")) {
                        backpack = cellValue;
                    } else if (cellRef.startsWith("AW")) {
                        backpackColor = cellValue;
                    } else if (cellRef.startsWith("AX")) {
                        backpackFeature = cellValue;
                    } else if (cellRef.startsWith("AY")) {
                        footwear = cellValue;
                    } else if (cellRef.startsWith("AZ")) {
                        footwearColor = cellValue;
                    } else if (cellRef.startsWith("BA")) {
                        footwearFeature = cellValue;
                    } else if (cellRef.startsWith("BB")) {
                        waistBag = cellValue;
                    } else if (cellRef.startsWith("BC")) {
                        waistBagColor = cellValue;
                    } else if (cellRef.startsWith("BD")) {
                        helmet = cellValue;
                    } else if (cellRef.startsWith("BE")) {
                        helmetColor = cellValue;
                    }

                    //Face Tattoos
                    if (cellRef.startsWith("BF")) {
                        leftFront = cellValue;
                    } else if (cellRef.startsWith("BG")) {
                        rightFront = cellValue;
                    } else if (cellRef.startsWith("BH")) {
                        centerFront = cellValue;
                    } else if (cellRef.startsWith("BI")) {
                        leftCheek = cellValue;
                    } else if (cellRef.startsWith("BJ")) {
                        rightCheek = cellValue;
                    } else if (cellRef.startsWith("BK")) {
                        leftTemple = cellValue;
                    } else if (cellRef.startsWith("BL")) {
                        rightChin = cellValue;
                    }

                    //Trunk Tattoos
                    if (cellRef.startsWith("BM")) {
                        leftNeck = cellValue;
                    } else if (cellRef.startsWith("BN")) {
                        rightNeck = cellValue;
                    } else if (cellRef.startsWith("BO")) {
                        centerNeck = cellValue;
                    } else if (cellRef.startsWith("BP")) {
                        leftNape = cellValue;
                    } else if (cellRef.startsWith("BQ")) {
                        rightNape = cellValue;
                    } else if (cellRef.startsWith("BR")) {
                        centerNape = cellValue;
                    } else if (cellRef.startsWith("BS")) {
                        leftBack = cellValue;
                    } else if (cellRef.startsWith("BT")) {
                        rightBack = cellValue;
                    } else if (cellRef.startsWith("BU")) {
                        centerBack = cellValue;
                    } else if (cellRef.startsWith("BV")) {
                        leftChest = cellValue;
                    } else if (cellRef.startsWith("BW")) {
                        rightChest = cellValue;
                    } else if (cellRef.startsWith("BX")) {
                        centerChest = cellValue;
                    } else if (cellRef.startsWith("BY")) {
                        leftAbdomen = cellValue;
                    } else if (cellRef.startsWith("BZ")) {
                        rightAbdomen = cellValue;
                    } else if (cellRef.startsWith("CA")) {
                        centerAbdomen = cellValue;
                    } else if (cellRef.startsWith("CB")) {
                        leftGroin = cellValue;
                    } else if (cellRef.startsWith("CC")) {
                        rightGroin = cellValue;
                    } else if (cellRef.startsWith("CD")) {
                        centerGroin = cellValue;
                    }

                    //Superior Tattoos
                    if (cellRef.startsWith("CE")) {
                        leftShoulder = cellValue;
                    } else if (cellRef.startsWith("CF")) {
                        rightShoulder = cellValue;
                    } else if (cellRef.startsWith("CG")) {
                        leftArm = cellValue;
                    } else if (cellRef.startsWith("CH")) {
                        rightArm = cellValue;
                    } else if (cellRef.startsWith("CI")) {
                        leftElbow = cellValue;
                    } else if (cellRef.startsWith("CJ")) {
                        rightElbow = cellValue;
                    } else if (cellRef.startsWith("CK")) {
                        leftForearm = cellValue;
                    } else if (cellRef.startsWith("CL")) {
                        rightForearm = cellValue;
                    } else if (cellRef.startsWith("CM")) {
                        leftWrist = cellValue;
                    } else if (cellRef.startsWith("CN")) {
                        rightWrist = cellValue;
                    } else if (cellRef.startsWith("CO")) {
                        leftHand = cellValue;
                    } else if (cellRef.startsWith("CP")) {
                        rightHand = cellValue;
                    }

                    //inferior Tattoos
                    if (cellRef.startsWith("CQ")) {
                        leftHip = cellValue;
                    } else if (cellRef.startsWith("CR")) {
                        rightHip = cellValue;
                    } else if (cellRef.startsWith("CS")) {
                        centerHip = cellValue;
                    } else if (cellRef.startsWith("CT")) {
                        leftThigh = cellValue;
                    } else if (cellRef.startsWith("CU")) {
                        rightThigh = cellValue;
                    } else if (cellRef.startsWith("CV")) {
                        leftKnee = cellValue;
                    } else if (cellRef.startsWith("CW")) {
                        rightKnee = cellValue;
                    } else if (cellRef.startsWith("CX")) {
                        leftLeg = cellValue;
                    } else if (cellRef.startsWith("CY")) {
                        rightLeg = cellValue;
                    } else if (cellRef.startsWith("CZ")) {
                        leftCalf = cellValue;
                    } else if (cellRef.startsWith("DA")) {
                        rightCalf = cellValue;
                    } else if (cellRef.startsWith("DB")) {
                        leftAnkle = cellValue;
                    } else if (cellRef.startsWith("DC")) {
                        rightAnkle = cellValue;
                    } else if (cellRef.startsWith("DD")) {
                        leftHeel = cellValue;
                    } else if (cellRef.startsWith("DE")) {
                        rightHeel = cellValue;
                    } else if (cellRef.startsWith("DF")) {
                        leftFoot = cellValue;
                    } else if (cellRef.startsWith("DG")) {
                        rightFoot = cellValue;
                    }

                    //vehicle
                    if (cellRef.startsWith("DH")) {
                        brand = cellValue;
                    } else if (cellRef.startsWith("DI")) {
                        subBrand = cellValue;
                    } else if (cellRef.startsWith("DJ")) {
                        vehicleType = cellValue;
                    } else if (cellRef.startsWith("DK")) {
                        series = cellValue;
                    } else if (cellRef.startsWith("DL")) {
                        licensePlates = cellValue;
                    } else if (cellRef.startsWith("DM")) {
                        engine = cellValue;
                    } else if (cellRef.startsWith("DN")) {
                        model = cellValue;
                    }

                    //other
                    if (cellRef.startsWith("DO")) {
                        modus = cellValue;
                    }
                    else if (cellRef.startsWith("DP")) {
                        weaponType = cellValue;
                    } else if (cellRef.startsWith("DQ")) {
                        weaponSize = cellValue;
                    } else if (cellRef.startsWith("DR")) {
                        disability = cellValue;
                    } else if (cellRef.startsWith("DS")) {
                        robbery = cellValue;
                    } else if (cellRef.startsWith("DT")) {
                        detentionRecord = cellValue;
                    }
                    
                    //oxxo


                    //we reach the end 
                    if (cellRef.startsWith("ED")){
                        //create a object with the data save
                        const personalInformation = [        
                            id_arrested,
                            324238,
                            last_name_f,
                            last_name_m,
                            first_name+" "+second_name,
                            alias,
                            new Date(Date.parse(birthday)),
                            parseInt(age),
                            sex,
                            job,
                            statusCivil,
                            disability
                        ]
                        listData.push(personalInformation);

                        const criminalAddress = {
                            id_arrested,
                            street,
                            NOAbroad,
                            NOInterior,
                            domicileColony
                        };
                        listCriminalAddress.push(criminalAddress);
                        
                        const dataForArrest = {
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
                        };
                        listDataForArrest.push(dataForArrest)
                        
                        const dataFamily = [        
                            id_arrested,
                            nameMother,
                            nameFather,
                            nameSister,
                            nameBrother,
                            relation
                        ]
                        listDataFamily.push(dataFamily);

                        const clothingDescription = {
                            id_arrested,
                            hat,
                            hatColor,
                            hatFeature,
                            glasses,
                            top,
                            topColor,
                            print,
                            brand,
                            sleeve,
                            bottom,
                            bottomColor,
                            bottomFeature,
                            backpack,
                            backpackColor,
                            backpackFeature,
                            footwear,
                            footwearColor,
                            footwearFeature,
                            waistBag,
                            waistBagColor,
                            helmet,
                            helmetColor
                        };
                        listClothingDescription.push(clothingDescription);
                        
                        const anthropometricData=[
                            id_arrested,
                            parseFloat(height),
                            headShape,
                            hair,
                            colorHair,
                            eyebrows,
                            eyeSize,
                            earSize,
                            complexion,
                            facialHair
                        ]
                        listAnthropometricData.push(anthropometricData);

                        const face_tattoos = [
                            id_arrested,
                            leftNeck,
                            rightNeck,
                            centerNeck,
                            leftNape,
                            rightNape,
                            centerNape,
                            leftBack,
                            rightBack,
                            centerBack,
                            leftChest,
                            rightChest,
                            centerChest,
                            leftAbdomen,
                            rightAbdomen,
                            centerAbdomen,
                            leftGroin,
                            rightGroin,
                            centerGroin
                        ];
                        listFaceTattoos.push(face_tattoos);

                        const lowerTattoos = [
                            id_arrested,
                            leftHip,
                            rightHip,
                            centerHip,
                            leftThigh,
                            rightThigh,
                            leftKnee,
                            rightKnee,
                            leftLeg,
                            rightLeg,
                            leftCalf,
                            rightCalf,
                            leftAnkle,
                            rightAnkle,
                            leftHeel,
                            rightHeel,
                            leftFoot,
                            rightFoot
                        ];
                        listLowerTattoos.push(lowerTattoos);

                        const topTattoos = [
                            id_arrested,
                            leftShoulder,
                            rightShoulder,
                            leftArm,
                            rightArm,
                            leftElbow,
                            rightElbow,
                            leftForearm,
                            rightForearm,
                            leftWrist,
                            rightWrist,
                            leftHand,
                            rightHand
                        ];
                        listTopTattoos.push(topTattoos);

                        const trunkTattoos = {
                            id_arrested,
                            leftNeck,
                            rightNeck,
                            centerNeck,
                            leftNape,
                            rightNape,
                            centerNape,
                            leftBack,
                            rightBack,
                            centerBack,
                            leftChest,
                            rightChest,
                            centerChest,
                            leftAbdomen,
                            rightAbdomen,
                            centerAbdomen,
                            leftGroin,
                            rightGroin,
                            centerGroin
                        };
                        listTrunkTattoos.push(trunkTattoos)

                        const stoppedVehicle = [
                            id_arrested,
                            vehicleBrand,
                            subBrand,
                            vehicleType,
                            series,
                            licensePlates,
                            engine,
                            model,
                            0
                        ];
                        listStoppedVehicle.push(stoppedVehicle);
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

                        //reset home 
                        street=""
                        NOAbroad=""
                        NOInterior=""
                        domicileColony=""

                        //data detention
                        id_arrested=get_id()
                        reason_for_arrest=""
                        place_of_detention=""
                        cologne=""
                        sector=""
                        hour=""
                        modus=""
                        typeWeapon=""
                        sizeWeapon=""
                        accomplice=""

                        //restart anthropomorphic  data 
                        height=0;
                        headShape="";
                        hair="";
                        colorHair="";
                        eyebrows="";
                        eyeSize="";
                        earSize="";
                        complexion="";
                        facialHair="";

                        //restart addictions
                        typeAddictions="";

                        // Ropa y accesorios
                        hat = "";
                        hatColor = "";
                        hatFeature = "";
                        glasses = "";
                        top = "";
                        topColor = "";
                        print = "";
                        brand = "";
                        sleeve = "";
                        bottom = "";
                        bottomColor = "";
                        bottomFeature = "";
                        backpack = "";
                        backpackColor = "";
                        backpackFeature = "";
                        footwear = "";
                        footwearColor = "";
                        footwearFeature = "";
                        waistBag = "";
                        waistBagColor = "";
                        helmet = "";
                        helmetColor = "";

                        // Rostro
                        leftFront = "";
                        rightFront = "";
                        centerFront = "";
                        leftCheek = "";
                        rightCheek = "";
                        leftTemple = "";
                        rightChin = "";

                        // Tatuajes en el torso
                        leftNeck = "";
                        rightNeck = "";
                        centerNeck = "";
                        leftNape = "";
                        rightNape = "";
                        centerNape = "";
                        leftBack = "";
                        rightBack = "";
                        centerBack = "";
                        leftChest = "";
                        rightChest = "";
                        centerChest = "";
                        leftAbdomen = "";
                        rightAbdomen = "";
                        centerAbdomen = "";
                        leftGroin = "";
                        rightGroin = "";
                        centerGroin = "";

                        // Tatuajes superiores
                        leftShoulder = "";
                        rightShoulder = "";
                        leftArm = "";
                        rightArm = "";
                        leftElbow = "";
                        rightElbow = "";
                        leftForearm = "";
                        rightForearm = "";
                        leftWrist = "";
                        rightWrist = "";
                        leftHand = "";
                        rightHand = "";

                        // Tatuajes inferiores
                        leftHip = "";
                        rightHip = "";
                        centerHip = "";
                        leftThigh = "";
                        rightThigh = "";
                        leftKnee = "";
                        rightKnee = "";
                        leftLeg = "";
                        rightLeg = "";
                        leftCalf = "";
                        rightCalf = "";
                        leftAnkle = "";
                        rightAnkle = "";
                        leftHeel = "";
                        rightHeel = "";
                        leftFoot = "";
                        rightFoot = "";

                        // vehicle
                        vehicleBrand = "";
                        subBrand = "";
                        vehicleType = "";
                        series = "";
                        licensePlates = "";
                        engine = "";
                        model = "";

                        // other
                        modus = "";
                        weaponType = "";
                        weaponSize = "";
                        disability = "";
                        robbery = "";
                        detentionRecord = "";
                    }
                } 
            });
        });

        await add_data_excel(
            listData,
            listDataForArrest,
            listDataFamily,
            listAnthropometricData,
            listCriminalAddress,
            listTrunkTattoos,
            listFaceTattoos,
            listLowerTattoos,
            listTopTattoos,
            listStoppedVehicle,
            listClothingDescription
        );
      //console.log(`${listData}`);
      //console.log(`${listAnthropometricData[1]}`);
      res.redirect('/Mexico/upload-criminals');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al procesar el archivo.');
    }
  });

async function add_data_excel(
    listData,
    listDataForArrest,
    listDataFamily,
    listAnthropometricData,
    listCriminalAddress,
    listTrunkTattoos,
    listFaceTattoos,
    listLowerTattoos,
    listTopTattoos,
    listStoppedVehicle,
    listClothingDescription
) {
    await add_list_data(listData,'INSERT INTO detenido VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)');
    /*
    await add_list_data(listDataFamily,'INSERT INTO datos_familiares_detenido VALUES (?, ?, ?,?,?,?,?)');
    await add_list_data(listCriminalAddress,'INSERT INTO domicilio_detenido VALUES (?, ?, ?, ?, ?, ?)');
    await add_list_data(listDataForArrest,'INSERT INTO detencion VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?)');
    await add_list_data(listAnthropometricData,'INSERT INTO datos_antropometricos VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?)');
    */
    /*
    await add_list_data(listTrunkTattoos,'INSERT INTO detenido VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)');
    await add_list_data(listFaceTattoos,'INSERT INTO detenido VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)');
    await add_list_data(listLowerTattoos,'INSERT INTO detenido VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)');
    await add_list_data(listTopTattoos,'INSERT INTO detenido VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)');
    await add_list_data(listStoppedVehicle,'INSERT INTO detenido VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)');
    await add_list_data(listClothingDescription,'INSERT INTO detenido VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)');*/
}

async function add_list_data(list,queryText){
    for (let i = 2; i < list.length; i++) {
        const data= list[i];
        const values = Object.values(data);
        try{
            await pool.query(queryText, values);
        } catch (error) {
            console.error('Error to add the data:', error);
        }
    }
}



function get_id(){
    // Obtener la fecha y hora actual
    const now = new Date();

    // Obtener los componentes de la fecha y hora
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Sumar 1 porque los meses van de 0 a 11
    const day = now.getDate();
    const hours = now.getHours();
    //const minutes = now.getMinutes();
    //const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    // Formar un valor numérico único concatenando los componentes
    //const numericValue = parseInt(`${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`);
    const numericValue = parseInt(`${day}${hours}${milliseconds}`);
    return numericValue+Math.floor(Math.random() * 1000) + 1;
}

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