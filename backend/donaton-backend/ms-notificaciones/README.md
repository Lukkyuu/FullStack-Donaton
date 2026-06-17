# ms-notificaciones — Microservicio de Notificaciones

> Gestor de notificaciones internas y preferencias de canales de mensajería (Email/SMS/Push) para usuarios de Donatón.

**Rama GitHub:** `Backend` — https://github.com/Lukkyuu/FullStack-Donaton/tree/Backend  
**Puerto:** `8087`

---

## Endpoints expuestos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/notificaciones` | Autenticado | Obtiene el historial de notificaciones del usuario logueado |
| GET | `/api/notificaciones/no-leidas` | Autenticado | Obtiene notificaciones pendientes de leer del usuario |
| GET | `/api/notificaciones/preferencias` | Autenticado | Consulta mapa general de preferencias del usuario actual |
| PUT | `/api/notificaciones/preferencias` | Autenticado | Guarda mapa general de preferencias del usuario actual |
| GET | `/api/notificaciones/preferencias/{usuarioId}` | Autenticado | Obtiene preferencias detalladas de un usuario |
| PUT | `/api/notificaciones/preferencias/{usuarioId}` | Autenticado | Modifica preferencias de canales para un usuario |

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

### Paso 3 — Ejecutar ms-notificaciones

```bash
cd backend/donaton-backend/ms-notificaciones
mvn spring-boot:run
```

El microservicio queda disponible en: **http://localhost:8087**

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
ms-notificaciones/
├── src/main/java/com/donaton/backend/
│   ├── MsNotificacionesApplication.java
│   └── notificacion/
│       ├── controller/NotificacionController.java   # Mapeo de rutas REST
│       ├── dto/NotificacionDTO.java                 # DTOs de envío/recepción
│       ├── model/Notificacion.java                 # Entidad JPA
│       ├── repository/NotificacionRepository.java   # Acceso a persistencia
│       └── service/NotificacionService.java         # Lógica de canal y plantillas
├── src/main/resources/
│   └── application.properties
├── pom.xml
└── Dockerfile
```
