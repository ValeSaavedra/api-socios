require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());

console.log('[SERVER] Servidor iniciado en puerto', PORT);

app.use('/api', authRoutes);
app.use('/api', dataRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log('[SERVER] Servidor corriendo en http://localhost:' + PORT);
});
