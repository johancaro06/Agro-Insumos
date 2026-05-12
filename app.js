const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const productoRutas = require("./src/rutas/productoRutas");

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS ---
// Servimos imágenes, CSS/JS y Vistas para que sean accesibles desde la raíz /
app.use("/imagenes", express.static(path.join(__dirname, "src/public/imagenes")));
app.use(express.static(path.join(__dirname, "src/public")));
app.use(express.static(path.join(__dirname, "src/vistas")));

// --- RUTAS DE LA API ---
app.use("/", productoRutas);

// --- MANEJO DE RUTAS NO ENCONTRADAS (404 Fallback) ---
app.use((req, res, next) => {
    // Si la ruta no es de la API y no se encontró el archivo estático
    if (!req.url.startsWith("/productos") && !req.url.startsWith("/login") && !req.url.startsWith("/comprar")) {
        // Opcional: res.status(404).sendFile(path.join(__dirname, "src/vistas/404.html"));
    }
    next();
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("---------------------------------------------------------");
    console.log(`🚀 AgroInsumos Backend ejecutándose en http://localhost:${PORT}`);
    console.log("---------------------------------------------------------");
});