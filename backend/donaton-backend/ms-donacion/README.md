# ms-donacion — Microservicio de Donaciones

> Gestión del ciclo de vida completo de donaciones con mensajería asíncrona vía RabbitMQ.

**Rama GitHub:** `Backend` — https://github.com/Lukkyuu/FullStack-Donaton/tree/Backend  
**Puerto:** `8082`

---

## Endpoints expuestos

| Método | Ruta | Rol requerido | Descripción |
|---|---|---|---|
| POST | `/api/donaciones` | DONANTE | Crear nueva donación |
| GET | `/api/donaciones` | ADMIN, LOGISTICA | Listar todas las donaciones |
| GET | `/api/donaciones/mis-donaciones` | Autenticado | Donaciones del usuario actual |
| GET | `/api/donaciones/{id}` | Autenticado | Obtener donación por ID |
| PUT | `/api/donaciones/{id}` | DONANTE | Actualizar donación propia |
| POST | `/api/donaciones/{id}/cancelar` | DONANTE | Cancelar donación propia |
| PATCH | `/api/donaciones/{id}/estado` | ADMIN, LOGISTICA | Cambiar estado de donación |

---

## Estados de una donación

```
PENDIENTE → EN_PROCESO → EN_TRANSITO → ENTREGADA
     └──────────────────────────────→ CANCELADA
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

### Paso 3 — Ejecutar ms-donacion

```bash
cd backend/donaton-backend/ms-donacion
mvn spring-boot:run
```

El microservicio queda disponible en: **http://localhost:8082**

### Panel de administración RabbitMQ

Acceder a: **http://localhost:15672** (usuario: `guest`, contraseña: `guest`)  
Se puede observar la cola de eventos de donaciones en tiempo real.

---

## Variables de entorno

| Variable | Descripción | Default local |
|---|---|---|
| `DB_URL` | URL de conexión PostgreSQL | `jdbc:postgresql://localhost:5432/donaton` |
| `DB_USERNAME` | Usuario de la BD | `postgres` |
| `DB_PASSWORD` | Contraseña de la BD | `postgres` |
| `RABBITMQ_HOST` | Host de RabbitMQ | `localhost` |
| `RABBITMQ_PORT` | Puerto de RabbitMQ | `5672` |
| `JWT_SECRET` | Clave secreta JWT | `donaton_secret_key_must_be_at_least_32_chars_long!` |

---

## Probar el servicio

```bash
# Crear una donación (requiere token JWT de un DONANTE)
curl -X POST http://localhost:8082/api/donaciones \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"descripcion":"Ropa de invierno","categoria":"ROPA","cantidad":10}'

# Listar donaciones propias
curl http://localhost:8082/api/donaciones/mis-donaciones \
  -H "Authorization: Bearer <TOKEN>"
```

---

## Patrones implementados

| Patrón | Ubicación | Descripción |
|---|---|---|
| **Builder** | `Donacion.builder()` en `DonacionService` | Construcción inmutable de entidades con Lombok @Builder |
| **Publisher/Subscriber** | `DonacionPublisher` + `DonacionConsumer` | Emisión y consumo de eventos vía RabbitMQ |
| **Repository** | `DonacionRepository`, `UsuarioRepository` (ms-common) | Abstracción del acceso a datos |
| **Dependency Injection** | `@RequiredArgsConstructor` en Service y Controller | Inyección por constructor |

---

## Estructura

```
ms-donacion/
├── src/main/java/com/donaton/backend/
│   ├── MsDonacionApplication.java
│   └── donacion/
│       ├── controller/DonacionController.java   # Endpoints REST
│       ├── service/DonacionService.java          # Lógica de negocio + Builder
│       └── messaging/
│           ├── DonacionPublisher.java            # Emite eventos a RabbitMQ
│           └── DonacionConsumer.java             # Consume eventos de RabbitMQ
├── src/main/resources/
│   └── application.properties
├── pom.xml
└── Dockerfile
```