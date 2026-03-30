# Documentación para Consumidores de la API

## URL Base
```
http://localhost:3000
```

## Autenticación

### Paso 1: Obtener Token
El sistema externo debe enviar una solicitud POST a `/api/login` con los datos del usuario ya validado.

**Endpoint:** `POST /api/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "id": "12345",
  "nombre": "Juan Pérez",
  "mail": "juan@ejemplo.com",
  "secret": "tu_api_secret_aqui"
}
```

**Respuesta exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Respuestas de error:**
- `400`: Faltan datos requeridos
- `401`: Secret inválido

---

### Paso 2: Usar el Token
Para acceder a rutas protegidas, incluir el token en el header `Authorization`.

**Endpoint:** `GET /api/datos`

**Headers:**
```
Authorization: Bearer <token_obtenido_en_login>
Content-Type: application/json
```

**Respuesta exitosa (200):**
```json
{
  "usuario": {
    "id": "12345",
    "nombre": "Juan Pérez",
    "mail": "juan@ejemplo.com"
  },
  "datos": [
    { "id": 1, "nombre": "Registro 1", ... },
    { "id": 2, "nombre": "Registro 2", ... }
  ]
}
```

**Respuestas de error:**
- `401`: Token no proporcionado
- `403`: Token inválido o expirado

---

## Ejemplo con cURL

### Obtener token:
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"id":"12345","nombre":"Juan Pérez","mail":"juan@ejemplo.com","secret":"tu_api_secret_aqui"}'
```

### Acceder a datos protegidos:
```bash
curl -X GET http://localhost:3000/api/datos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Ejemplo con JavaScript (fetch)

```javascript
// Obtener token
const loginResponse = await fetch('http://localhost:3000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: '12345',
    nombre: 'Juan Pérez',
    mail: 'juan@ejemplo.com',
    secret: 'tu_api_secret_aqui'
  })
});

const { token } = await loginResponse.json();

// Usar token
const datosResponse = await fetch('http://localhost:3000/api/datos', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const datos = await datosResponse.json();
console.log(datos);
```

---

## Notas Importantes

1. **El token no expira** (según lo configurado)
2. **El secret** debe coincidir con `API_SECRET` en el archivo `.env` del servidor
3. **Guardar el token** de forma segura en el cliente
4. **Incluir el token** en cada request a rutas protegidas con el formato `Bearer <token>`

---

## Health Check

Para verificar que el servidor está corriendo:
```
GET /api/health
```

**Respuesta:**
```json
{
  "status": "OK"
}
```
