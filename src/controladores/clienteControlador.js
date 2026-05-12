const db = require("../configuracion/conexion");


const registrarCliente = (req, res) => {
    const { nombres, apellidos, correo, telefono, dni, usuario, contrasena } = req.body;


    const query = `INSERT INTO clientes
        (nombres, apellidos, correo, telefono, dni, estatus, fecha_alta, usuario, contrasena, rol)
        VALUES (?, ?, ?, ?, ?, 1, NOW(), ?, ?, 'cliente')`;

    const valores = [nombres, apellidos, correo, telefono, dni, usuario, contrasena];

    db.query(query, valores, (error, resultado) => {
        if (error) {
            console.error("Error al registrar en MySQL:", error);
            return res.status(500).json({
                mensaje: "Error al registrar el usuario",
                detalles: error.message
            });
        }
        res.json({
            mensaje: "Cliente registrado correctamente",
            id: resultado.insertId
        });
    });
};


const login = (req, res) => {
    const { usuario, contrasena } = req.body;


    const query = "SELECT id, nombres, rol FROM clientes WHERE usuario = ? AND contrasena = ?";

    db.query(query, [usuario, contrasena], (err, result) => {
        if (err) {
            console.error("Error en login:", err);
            return res.status(500).json({ acceso: false, mensaje: "Error en el servidor" });
        }

        if (result.length > 0) {

            res.json({
                acceso: true,
                id: result[0].id,
                nombre: result[0].nombres,
                rol: result[0].rol
            });
        } else {

            res.status(401).json({ acceso: false, mensaje: "Usuario o contraseña incorrectos" });
        }
    });
};

module.exports = {
    registrarCliente,
    login
};