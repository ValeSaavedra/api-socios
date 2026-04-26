const express = require("express");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 10, // 10 intentos
  message: "Demasiados intentos de autenticación",
});

router.post("/login", authLimiter, (req, res) => {
  console.log("[LOGIN] Request recibida");
  console.log("[LOGIN] Body:", req.body);

  //PRUEBA TEMPORAL
  console.log("[LOGIN] JWT_SECRET usado para firmar:", process.env.JWT_SECRET);
  console.log("[LOGIN] Longitud del secret:", process.env.JWT_SECRET?.length);
  //FIN PRUEBA TEMPORAL

  const { nombre, mail, secret } = req.body;

  if (!nombre || !mail || !secret) {
    console.log("[LOGIN] Error: Faltan datos requeridos");
    return res
      .status(400)
      .json({ error: "Faltan datos requeridos: id, nombre, mail, secret" });
  }

  if (secret !== process.env.API_SECRET) {
    console.log("[LOGIN] Error: API_SECRET inválido");
    return res.status(401).json({ error: "Secret inválido" });
  }

  const user = { nombre, mail };
  const token = jwt.sign(user, process.env.JWT_SECRET);

  //PRUEBA TEMPORAL
  console.log("[LOGIN] Token generado:", token);
  // Decodificar para ver el algoritmo usado
  const decodedHeader = jwt.decode(token, { complete: true });
  console.log("[LOGIN] Algoritmo usado:", decodedHeader.header.alg);
  //FIN PRUEBA TEMPORAL

  console.log("[LOGIN] Token generado para usuario:", nombre);
  console.log("[LOGIN] Token:", token);

  res.json({ token });
});

module.exports = router;
