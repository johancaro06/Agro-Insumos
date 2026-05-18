const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const productoRutas = require("./src/rutas/productoRutas");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/imagenes", express.static(path.join(__dirname, "src/public/imagenes")));
app.use(express.static(path.join(__dirname, "src/public")));
app.use(express.static(path.join(__dirname, "src/vistas")));

app.use("/", productoRutas);

app.use((req, res, next) => {
    if (!req.url.startsWith("/productos") && !req.url.startsWith("/login") && !req.url.startsWith("/comprar")) {
    }
    next();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 AgroInsumos Backend ejecutándose en puerto ${PORT}`);
});