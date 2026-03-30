const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

router.post('/login', (req, res) => {
  console.log('[LOGIN] Request recibida');
  console.log('[LOGIN] Body:', req.body);

  const { id, nombre, mail, secret } = req.body;

  if (!id || !nombre || !mail || !secret) {
    console.log('[LOGIN] Error: Faltan datos requeridos');
    return res.status(400).json({ error: 'Faltan datos requeridos: id, nombre, mail, secret' });
  }

  if (secret !== process.env.API_SECRET) {
    console.log('[LOGIN] Error: API_SECRET inválido');
    return res.status(401).json({ error: 'Secret inválido' });
  }

  const user = { id, nombre, mail };
  const token = jwt.sign(user, process.env.JWT_SECRET);

  console.log('[LOGIN] Token generado para usuario:', nombre);
  console.log('[LOGIN] Token:', token);

  res.json({ token });
});

module.exports = router;
