const conexion =
require("../configuracion/conexion");

const crearCliente = (datos, callback) => {
    const sql = `
        INSERT INTO clientes
        (
            nombres,
            apellidos,
            correo,
            telefono,
            dni,
            estatus,
            fecha_alta,
            usuario,
            contrasena,
            rol
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    conexion.query(sql, datos, callback);
};

module.exports = {
    crearCliente
};