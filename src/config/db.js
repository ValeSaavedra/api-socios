//const mysql = require('mysql2/promise');
require("dotenv").config();

/*
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('[DB] Conectado a MySQL');

module.exports = pool;
*/

const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  //password: "Uj?yLe=$tM",
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  requestTimeout: 130000,
  trustServerCertificate: true,
  port: 1433, // 49960,
  options: {
    trustedconnection: true,
    enableArithAbort: true,
    encript: true,
  },
};

const dbConnection = async () => {
  try {
    const pool = await sql.connect(config);
    console.log("Conectado a DB - pasa por config.js");
    return pool;
  } catch (e) {
    console.error(e);
  }
};

module.exports = { dbConnection };
