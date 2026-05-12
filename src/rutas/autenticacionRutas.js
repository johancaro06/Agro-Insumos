const express = require("express");
const router = express.Router();

const autenticacionControlador =
require("../controladores/autenticacionControlador");

router.post(
    "/login",
    autenticacionControlador.iniciarSesion
);

module.exports = router;