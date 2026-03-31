const express = require("express");
const { authenticateToken } = require("../middleware/auth");
//const pool = require("../config/db");
const { dbConnection } = require("../config/db");
const { sociosSP } = require("../../models/data");

const router = express.Router();

router.post("/datos", authenticateToken, async (req, res) => {
  console.log("[DATOS] Request recibida");
  console.log("[DATOS] Usuario autenticado:", req.user);

  try {
    const { nro_socio } = req.body;
    if (!nro_socio)
      return res.status(400).json({ error: "numero_socio requerido" });
    const pool = await dbConnection();
    const result = await pool
      .request()
      .input("IN_Soc_DNI", nro_socio)
      .execute(sociosSP);
    const socio = result.recordsets[0];
    if (socio.length === 0)
      return res.status(404).json({ error: "Socio no encontrado" });
    res.json(socio);
    //const [rows] = await pool.query("SELECT * FROM usuarios");
    //console.log("[DATOS] Datos obtenidos:", rows.length, "registros");
    //res.json({ usuario: req.user, datos: rows });
  } catch (error) {
    console.error("[DATOS] Error en consulta:", error);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

module.exports = router;
