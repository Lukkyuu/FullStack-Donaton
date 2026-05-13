# ms-logistica — Microservicio de Logística

> Gestión de centros de acopio y asignación logística de donaciones en el sistema Donatón.

**Rama GitHub:** `Backend` — https://github.com/Lukkyuu/FullStack-Donaton/tree/Backend  
**Puerto:** `8083`

---

## Endpoints expuestos

| Método | Ruta | Rol requerido | Descripción |
|---|---|---|---|
| GET | `/api/logistica/donaciones/pendientes` | ADMIN, LOGISTICA | Listar donaciones en estado PENDIENTE |
| POST | `/api/logistica/donaciones/{donacionId}/asignar/{centroId}` | ADMIN, LOGISTICA | Asignar donación a un centro de acopio |
| GET | `/api/logistica/centros` | ADMIN, LOGISTICA | Listar centros de acopio activos |
| PATCH | `/api/logistica/donaciones/{id}/entregar` | ADMIN, LOGISTICA | Marcar donación como entregada |

---

## Flujo logístico

```
1. PENDIENTE    → Donación registrada, sin centro asignado
2. EN_PROCESO   → Centro de acopio asignado (POST /asignar/{centroId})
3. ENTREGADA    → Donación confirmada como entregada (PATCH /entregar)
```

---

## Requisitos previos

| Herramienta | Versión |
|---|---|
| Java | 21 |
| Maven | 3.9.x |
| PostgreSQL | 15 (o vía Docker) |
| RabbitMQ | 3.x (o vía Docker) |
| ms-common compilado | 0.0.1-SNAPSHOT |

---

## Instalación y ejecución

### Paso 1 — Levantar infraestructura

```bash
cd backend/donaton-backend
docker-compose up postgres rabbitmq -d
```

### Paso 2 — Compilar ms-common

```bash
mvn clean install -pl ms-common -am -DskipTests
```

### Paso 3 — Ejecutar ms-logistica

```bash
cd backend/donaton-backend/ms-logistica
mvn spring-boot:run
```

El microservicio queda disponible en: **http://localhost:8083**

---

## Variables de entorno

| Variable | Descripción | Default local |
|---|---|---|
| `DB_URL` | URL de conexión PostgreSQL | `jdbc:postgresql://localhost:5432/donaton` |
| `DB_USERNAME` | Usuario de la BD | `postgres` |
| `DB_PASSWORD` | Contraseña de la BD | `postgres` |
| `RABBITMQ_HOST` | Host de RabbitMQ | `localhost` |
| `JWT_SECRET` | Clave secreta JWT | `donaton_secret_key_must_be_at_least_32_chars_long!` |

---

## Probar el servicio

```bash
# Listar donaciones pendientes (requiere token JWT de ADMIN o LOGISTICA)
curl http://localhost:8083/api/logistica/donaciones/pendientes \
  -H "Authorization: Bearer <TOKEN>"

# Listar centros de acopio activos
curl http://localhost:8083/api/logistica/centros \
  -H "Authorization: Bearer <TOKEN>"

# Asignar donación ID=1 al centro ID=2
curl -X POST http://localhost:8083/api/logistica/donaciones/1/asignar/2 \
  -H "Authorization: Bearer <TOKEN>"

# Marcar donación ID=1 como entregada
curl -X PATCH http://localhost:8083/api/logistica/donaciones/1/entregar \
  -H "Authorization: Bearer <TOKEN>"
```

---

## Patrones implementados

| Patrón | Ubicación | Descripción |
|---|---|---|
| **Service Layer** | `LogisticaService` | Separación clara entre controlador y lógica de negocio |
| **Repository** | `DonacionRepository`, `CentroAcopioRepository` (ms-common) | Abstracción del acceso a datos |
| **Dependency Injection** | `@RequiredArgsConstructor` en Service y Controller | Inyección por constructor |

---

## Estructura

```
ms-logistica/
├── src/main/java/com/donaton/backend/
│   ├── MsLogisticaApplication.java
│   └── logistica/
│       ├── controller/LogisticaController.java   # Endpoints REST con @PreAuthorize
│       └── service/LogisticaService.java          # Lógica de asignación de centros
├── src/main/resources/
│   └── application.properties
├── pom.xml
└── Dockerfile
```