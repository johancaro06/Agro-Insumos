require('dotenv').config();

const mysql = require('mysql2');

const conexion = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

conexion.getConnection((error, connection) => {
    if (error) {
        console.log("❌ Error de conexión:", error);
    } else {
        console.log("✅ MySQL conectado");
        connection.release();
    }
});

module.exports = conexion;