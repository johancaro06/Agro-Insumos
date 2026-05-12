const express = require("express");
const router = express.Router();

const clienteControlador =
require("../controladores/clienteControlador");

router.post(
    "/registro",
    clienteControlador.registrarCliente
);

module.exports = router;