const conexion =
require("../configuracion/conexion");

const iniciarSesion = (req, res) => {
    const {
        usuario,
        contrasena
    } = req.body;

    const sql = `
        SELECT * FROM clientes
        WHERE usuario = ?
        AND contrasena = ?
        AND estatus = 1
    `;

    conexion.query(
        sql,
        [usuario, contrasena],
        (error, resultados) => {
            if (error) {
                return res.status(500).json(error);
            }

            if (resultados.length > 0) {
                res.json({
                    acceso: true,
                    rol: resultados[0].rol,
                    mensaje:
                    "Inicio de sesión correcto"
                });
            } else {
                res.json({
                    acceso: false,
                    mensaje:
                    "Usuario o contraseña incorrectos"
                });
            }
        }
    );
};

module.exports = {
    iniciarSesion
};