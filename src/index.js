require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth");
const dataRoutes = require("./routes/data");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());
app.use((req, res, next) => {
  const suspicious = /\.\.|%2E|%2F|%5C|\/etc\/|\/passwd|\.\.%5C/i;
  if (suspicious.test(req.url)) {
    console.log(`🔒 Bloqueado - IP: ${req.ip} - URL: ${req.url}`);
    return res.status(403).send(`Solicitud inválida`);
  }
  next();
});
/*const globalLImiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Demasiadas solicitudes, intenta más tarde",
});*/
//app.use(globalLImiter);
const healthLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 10,
  message: "Demasiadas verificaciones de salud",
});
app.use("/health", healthLimiter);

// BLOQUEO DE EMERGENCIA - Colocar ANTES que cualquier ruta
app.use((req, res, next) => {
  // Lista BLANCA: SOLO estas rutas existen en tu API
  const allowedPaths = ["/health", "/api", "/status"];

  // Si no es una ruta permitida, bloquear sin preguntar
  const isAllowed = allowedPaths.some(
    (path) => req.path === path || req.path.startsWith(path + "/"),
  );

  if (!isAllowed && req.path !== "/") {
    console.log(
      `🔴 BLOQUEO EMERGENCIA - ${req.ip} - ${req.method} ${req.path}`,
    );
    return res.status(403).send("Access denied");
  }

  next();
});

console.log("[SERVER] Servidor iniciado en puerto", PORT);

app.use("/api", authRoutes);
app.use("/api", dataRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log("[SERVER] Servidor corriendo en 181.30.15.92:" + PORT);
});
