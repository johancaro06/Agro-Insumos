
const conexion = require("../configuracion/conexion");

/* --- GESTIÓN DE PRODUCTOS (CRUD) --- */

const obtenerProductos = (callback) => {
    conexion.query("SELECT * FROM productos", callback);
};

const obtenerProductoPorId = (id, callback) => {
    const sql = "SELECT * FROM productos WHERE id = ?";
    conexion.query(sql, [id], callback);
};

const crearProducto = (datos, callback) => {
    const sql = `
        INSERT INTO productos
        (nombre, descripcion, precio, descuento, id_categoria, activo, imagen, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    conexion.query(sql, datos, callback);
};

const actualizarProducto = (id, datos, callback) => {
    const sql = `
        UPDATE productos
        SET nombre = ?, descripcion = ?, precio = ?, stock = ?, id_categoria = ?, imagen = ?
        WHERE id = ?
    `;

    conexion.query(sql, [...datos, id], callback);
};

const eliminarProducto = (id, callback) => {
    conexion.query("DELETE FROM productos WHERE id = ?", [id], callback);
};


const registrarCompra = (datos, callback) => {
    const sql = `
        INSERT INTO compra
        (id_transaccion, fecha, status, email, id_cliente, total, medio_pago)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    conexion.query(sql, datos, callback);
};

const registrarDetalleCompra = (datos, callback) => {
    const sql = `
        INSERT INTO detalle_compra
        (id_compra, id_producto, nombre, precio, cantidad)
        VALUES ?
    `;

    conexion.query(sql, [datos], callback);
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    registrarCompra,
    registrarDetalleCompra
};