# ms-usuarios — Microservicio de Gestión de Usuarios

> Administración de perfiles, contraseñas, listados de usuarios y eliminación de cuentas en Donatón.

**Rama GitHub:** `Backend` — https://github.com/Lukkyuu/FullStack-Donaton/tree/Backend  
**Puerto:** `8085`

---

## Endpoints expuestos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/usuarios` | ADMIN | Retorna la lista de todos los usuarios registrados |
| POST | `/api/usuarios` | ADMIN / Público | Crea un nuevo usuario en la plataforma |
| GET | `/api/usuarios/perfil` | Autenticado | Retorna el perfil completo del usuario autenticado actual |
| GET | `/api/usuarios/{id}` | Autenticado | Retorna un usuario específico por su ID |
| PUT | `/api/usuarios/perfil` | Autenticado | Actualiza los datos de perfil (nombre) del usuario actual |
| POST | `/api/usuarios/cambiar-contraseña` | Autenticado | Permite al usuario cambiar su clave validando la actual |
| DELETE | `/api/usuarios/{id}` | ADMIN / Propietario | Elimina un usuario por su ID |

---

## Requisitos previos

| Herramienta | Versión |
|---|---|
| Java | 21 |
| Maven | 3.9.x |
| PostgreSQL | 15 (o vía Docker) |
| ms-common compilado | 0.0.1-SNAPSHOT |

---

## Instalación y ejecución

### Paso 1 — Levantar la base de datos y mensajería

```bash
cd backend/donaton-backend
docker-compose up postgres rabbitmq -d
```

### Paso 2 — Compilar ms-common (dependencia compartida)

```bash
cd backend/donaton-backend
mvn clean install -pl ms-common -am -DskipTests
```

### Paso 3 — Ejecutar ms-usuarios

```bash
cd backend/donaton-backend/ms-usuarios
mvn spring-boot:run
```

El microservicio queda disponible en: **http://localhost:8085**

---

## Variables de entorno

| Variable | Descripción | Default local |
|---|---|---|
| `DB_URL` | URL de conexión PostgreSQL | `jdbc:postgresql://localhost:5432/donaton` |
| `DB_USERNAME` | Usuario de la BD | `postgres` |
| `DB_PASSWORD` | Contraseña de la BD | `postgres` |

---

## Estructura

```
ms-usuarios/
├── src/main/java/com/donaton/backend/
│   ├── MsUsuariosApplication.java
│   └── usuario/
│       ├── controller/UsuarioController.java     # Mapeo de rutas REST
│       ├── dto/UsuarioDTO.java                   # Formato de requests/responses
│       └── service/UsuarioService.java           # Actualización, borrado, contraseñas
├── src/main/resources/
│   └── application.properties
├── pom.xml
└── Dockerfile
```
