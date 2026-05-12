const productoModelo = require("../modelos/productoModelo");

// --- GESTIÓN DE PRODUCTOS (CRUD) ---

const listarProductos = (req, res) => {
    productoModelo.obtenerProductos((error, resultados) => {
        if (error) {
            console.error("Error al listar:", error);
            return res.status(500).json({ error });
        }
        res.json(resultados);
    });
};

const obtenerProducto = (req, res) => {
    const id = req.params.id;
    productoModelo.obtenerProductoPorId(id, (error, resultado) => {
        if (error) return res.status(500).json({ error });
        if (resultado.length === 0) return res.status(404).json({ mensaje: "Producto no encontrado" });
        res.json(resultado[0]);
    });
};

const guardarProducto = (req, res) => {
    const { nombre, descripcion, precio, stock, id_categoria } = req.body;

    const nombreImagen = req.file ? `/imagenes/${req.file.filename}` : "/imagenes/default.jpg";


    const datos = [nombre, descripcion, precio, 0, id_categoria, 1, nombreImagen, stock];

    productoModelo.crearProducto(datos, (error) => {
        if (error) return res.status(500).json({ estado: "error", mensaje: error.message });
        res.json({ estado: "exito", mensaje: "✅ Producto guardado correctamente" });
    });
};

const editarProducto = (req, res) => {
    const id = req.params.id;
    const { nombre, descripcion, precio, stock, id_categoria, imagenAntigua } = req.body;


    const nombreImagen = req.file ? `/imagenes/${req.file.filename}` : imagenAntigua;

    const datos = [nombre, descripcion, precio, stock, id_categoria, nombreImagen];

    productoModelo.actualizarProducto(id, datos, (error) => {
        if (error) return res.status(500).json({ estado: "error", mensaje: error.message });
        res.json({ estado: "exito", mensaje: "🔄 Producto actualizado con éxito" });
    });
};

const eliminarProducto = (req, res) => {
    productoModelo.eliminarProducto(req.params.id, (error) => {
        if (error) return res.status(500).json({ error });
        res.json({ mensaje: "🗑️ Producto eliminado satisfactoriamente" });
    });
};



const finalizarCompra = (req, res) => {
    const { id_transaccion, id_cliente, email, total, productos } = req.body;

    const fecha = new Date();
    const status = 'COMPLETADO';
    const medio_pago = 'EFECTIVO';


    const datosCompra = [id_transaccion, fecha, status, email, id_cliente, total, medio_pago];


    productoModelo.registrarCompra(datosCompra, (err, resultado) => {
        if (err) {
            console.error("Error Cabecera:", err);
            return res.status(500).json({ estado: "error", mensaje: "Error al registrar cabecera" });
        }

        const idCompraGenerada = resultado.insertId;


        const detalles = productos.map(p => [
            idCompraGenerada,
            p.id,
            p.nombre,
            p.precio,
            p.cantidad
        ]);


        productoModelo.registrarDetalleCompra(detalles, (errDetalle) => {
            if (errDetalle) {
                console.error("Error Detalle:", errDetalle);
                return res.status(500).json({ estado: "error", mensaje: "Error al registrar el detalle de la compra" });
            }

            res.json({
                estado: "exito",
                mensaje: "🚀 ¡Compra procesada! Gracias por confiar en AgroInsumos",
                id_compra: idCompraGenerada
            });
        });
    });
};

module.exports = {
    listarProductos,
    obtenerProducto,
    guardarProducto,
    editarProducto,
    eliminarProducto,
    finalizarCompra
};