//we are connecting to the database
const mysql=require('mysql');
const {promisify}=require('util'); //this is for promise
const {database}=require('./keys');

const pool=mysql.createPool(database);

pool.getConnection((err,connection)=>{
    if(err){
        if(err.code=='PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if(err.code=='ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTION');
        }
        if(err.code=='ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if(connection) connection.release();
    console.log('DB is Connected');
    return;
});

//promisify pool query
pool.query=promisify(pool.query);
module.exports=pool;