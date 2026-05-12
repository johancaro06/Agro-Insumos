require('dotenv').config();

const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

conexion.connect((error) => {
    if (error) {
        console.log("❌ Error de conexión:", error);
    } else {
        console.log("✅ MySQL conectado");
    }
});

module.exports = conexion;