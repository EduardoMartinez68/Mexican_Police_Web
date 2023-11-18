const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');
require('dotenv').config();

const {
  APP_PG_USER,
  APP_PG_HOST,
  APP_PG_DATABASE,
  APP_PG_PASSWORD,
  APP_PG_PORT
} = process.env;

// Configura los detalles de conexión a tu base de datos MySQL
const connection = mysql.createConnection({
  host: APP_PG_HOST,
  user: APP_PG_USER,
  password: APP_PG_PASSWORD,
  database: APP_PG_DATABASE,
});

// Conecta a la base de datos MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a MySQL:', err);
    return;
  }
  console.log('Conexión exitosa a MySQL');
  // Realiza tus operaciones con la base de datos aquí
});

// Usar promisify en MySQL es un poco diferente, ya que las consultas no son métodos de un objeto
const query = promisify(connection.query).bind(connection);
module.exports = { connection, query };



/*
const  { Client }=require('pg');
const {promisify}=require('util');
const {database}=require('./keys');

//we will watch all the data of the database
require('dotenv').config();
const {APP_PG_USER,APP_PG_HOST,APP_PG_DATABASE,APP_PG_PASSWORD,APP_PG_PORT}=process.env;


const client = new Client({
  user: APP_PG_USER,
  host: APP_PG_HOST,
  database: APP_PG_DATABASE,
  password: APP_PG_PASSWORD,
  port: APP_PG_PORT,
});

client.connect()
  .then(() => {
    console.log('Conexión exitosa a PostgreSQL');
    // Realiza tus operaciones con la base de datos aquí
  })
  .catch((error) => {
    console.error('Error al conectar a PostgreSQL', error);
  });

promisify(client.query);
module.exports=client;
*/