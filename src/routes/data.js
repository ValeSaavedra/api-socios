const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const pool = require('../config/db');

const router = express.Router();

router.get('/datos', authenticateToken, async (req, res) => {
  console.log('[DATOS] Request recibida');
  console.log('[DATOS] Usuario autenticado:', req.user);

  try {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    console.log('[DATOS] Datos obtenidos:', rows.length, 'registros');
    res.json({ usuario: req.user, datos: rows });
  } catch (error) {
    console.error('[DATOS] Error en consulta:', error);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

module.exports = router;
