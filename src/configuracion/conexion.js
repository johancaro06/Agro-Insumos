const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root1234",
    database: "agroinsumos",
    port: 3307
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Conectado a MySQL");
    }
});

module.exports = db;