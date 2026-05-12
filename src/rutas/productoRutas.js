const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const productoControlador = require("../controladores/productoControlador");
const clienteControlador = require("../controladores/clienteControlador");

// --- CONFIGURACIÓN DE MULTER (Imágenes) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "../public/imagenes")),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// --- RUTAS DE USUARIO (CLIENTE) ---
router.post("/registro", clienteControlador.registrarCliente);
router.post("/login", clienteControlador.login);

// --- RUTAS DE PRODUCTOS ---
router.get("/productos", productoControlador.listarProductos);
router.get("/productos/:id", productoControlador.obtenerProducto);
router.post("/comprar", productoControlador.finalizarCompra);

// --- CRUD ADMINISTRATIVO ---
router.post("/productos", upload.single("imagen"), productoControlador.guardarProducto);
router.put("/productos/:id", upload.single("imagen"), productoControlador.editarProducto);
router.delete("/productos/:id", productoControlador.eliminarProducto);

module.exports = router;