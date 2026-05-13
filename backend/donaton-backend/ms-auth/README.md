# ms-auth — Microservicio de Autenticación

> Gestión de usuarios, autenticación JWT y control de roles en el sistema Donatón.

**Rama GitHub:** `Backend` — https://github.com/Lukkyuu/FullStack-Donaton/tree/Backend  
**Puerto:** `8081`

---

## Endpoints expuestos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | Público | Autentica usuario y retorna JWT |
| POST | `/api/auth/register` | Público | Registra nuevo usuario (rol DONANTE u ORGANIZACION) |
| POST | `/api/auth/logout` | Autenticado | Cierra la sesión |
| POST | `/api/auth/refresh` | Autenticado | Renueva el token JWT |
| GET | `/api/auth/me` | Autenticado | Retorna datos del usuario actual |

---

## Roles del sistema

| Rol | Descripción | Registro público |
|---|---|---|
| `DONANTE` | Puede crear y gestionar sus propias donaciones | ✅ Sí |
| `ORGANIZACION` | Gestiona necesidades de su organización | ✅ Sí |
| `ADMIN` | Acceso total al sistema | ❌ Solo por admin |

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

### Paso 1 — Levantar la base de datos

```bash
cd backend/donaton-backend
docker-compose up postgres rabbitmq -d
```

### Paso 2 — Compilar ms-common (dependencia compartida)

```bash
cd backend/donaton-backend
mvn clean install -pl ms-common -am -DskipTests
```

### Paso 3 — Ejecutar ms-auth

```bash
cd backend/donaton-backend/ms-auth
mvn spring-boot:run
```

El microservicio queda disponible en: **http://localhost:8081**

---

## Variables de entorno

| Variable | Descripción | Default local |
|---|---|---|
| `DB_URL` | URL de conexión PostgreSQL | `jdbc:postgresql://localhost:5432/donaton` |
| `DB_USERNAME` | Usuario de la BD | `postgres` |
| `DB_PASSWORD` | Contraseña de la BD | `postgres` |
| `JWT_SECRET` | Clave secreta JWT (mínimo 32 chars) | `donaton_secret_key_must_be_at_least_32_chars_long!` |
| `JWT_EXPIRATION` | Duración del token en ms | `86400000` (24 horas) |

---

## Probar el servicio

```bash
# Registrar un usuario
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@donaton.cl","password":"12345678","nombre":"Test User","rol":"DONANTE"}'

# Login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@donaton.cl","password":"12345678"}'
```

---

## Patrones implementados

| Patrón | Ubicación |
|---|---|
| **Repository** | `UsuarioRepository` (ms-common) — abstrae acceso a BD |
| **Dependency Injection** | `@RequiredArgsConstructor` en `AuthService` y `AuthController` |
| **Builder** | `Usuario.builder()` para construcción inmutable de entidades |
| **Singleton** | Todos los `@Service` y `@Controller` gestionados por Spring |

---

## Estructura

```
ms-auth/
├── src/main/java/com/donaton/backend/
│   ├── MsAuthApplication.java
│   └── auth/
│       ├── controller/AuthController.java   # POST /login, /register, /logout, /refresh, /me
│       └── service/AuthService.java         # Lógica de negocio y generación JWT
├── src/main/resources/
│   └── application.properties
├── pom.xml
└── Dockerfile
```