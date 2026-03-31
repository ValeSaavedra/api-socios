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


{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}


**Respuestas de error:**

- `400`: Faltan datos requeridos
- `401`: Secret inválido

---

### Paso 2: Consultar Datos del Socio

Para acceder a datos de un socio, incluir el token en el header `Authorization` y enviar el número de socio en el body

**Endpoint:** `POST /api/datos`

**Headers:**

```
Authorization: Bearer <token_obtenido_en_login>
Content-Type: application/json


**Body:**

```
{
  "numero_socio : "12345" 
}
```

**Respuesta exitosa (200) - Socio encontrado:**

```json
{
    "numero_socio": 
    "id": "12345",
    "nombre": "Juan",
    "apellido":"Pérez"
    "mail": "juan@ejemplo.com"
  
}
```

**Respuestas de error (404) - Socio no encontrado:**
```
{
    "error": "Socio no encontrado" 
}

**Respuestas de error de autenticación:**
-

- `401`: Token no proporcionado
- `403`: Token inválido o expirado
- `400`: numero de socio requerido

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
curl -X POST http://localhost:3000/api/datos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Ejemplo con JavaScript (fetch)

```javascript
// Obtener token
const loginResponse = await fetch("http://localhost:3000/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    id: "12345",
    nombre: "Juan Pérez",
    mail: "juan@ejemplo.com",
    secret: "tu_api_secret_aqui",
  }),
});

const { token } = await loginResponse.json();

// Usar token
const datosResponse = await fetch("http://localhost:3000/api/datos", {
  headers: { Authorization: `Bearer ${token}` },
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
