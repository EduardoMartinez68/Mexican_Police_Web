//we will watch all the data of the database
require('dotenv').config();
const {HOST,USER,PASSWORD,NAME_DATABASE}=process.env;
module.exports={
    database:{
        host:HOST,
        user:USER,
        password:PASSWORD,
        database:NAME_DATABASE
    }
};