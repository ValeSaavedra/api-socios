const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('[AUTH] Token recibido:', token ? 'Sí' : 'No');

  if (!token) {
    console.log('[AUTH] Error: Token no proporcionado');
    return res.status(401).json({ error: 'Token requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('[AUTH] Error: Token inválido', err.message);
      return res.status(403).json({ error: 'Token inválido' });
    }

    console.log('[AUTH] Usuario autenticado:', user);
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
