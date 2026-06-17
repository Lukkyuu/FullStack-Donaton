# ms-matching — Microservicio de Matching

> Motor automático de emparejamiento entre Donaciones y Necesidades humanitarias activas en el sistema Donatón.

**Rama GitHub:** `Backend` — https://github.com/Lukkyuu/FullStack-Donaton/tree/Backend  
**Puerto:** `8086`

---

## Endpoints expuestos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/matching` | ADMIN | Ejecuta algoritmo de matching y genera emparejamiento |
| GET | `/api/matching/pendientes` | ADMIN | Lista propuestas de matching en estado PENDIENTE |
| GET | `/api/matching/resultados` | Autenticado | Lista todos los resultados/historial de matchings |
| GET | `/api/matching/resultados/{id}` | Autenticado | Retorna un matching específico por su ID |
| PATCH | `/api/matching/{id}/estado` | ADMIN | Aprueba o rechaza (estado APROBADO/RECHAZADO) un matching |

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

### Paso 3 — Ejecutar ms-matching

```bash
cd backend/donaton-backend/ms-matching
mvn spring-boot:run
```

El microservicio queda disponible en: **http://localhost:8086**

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
ms-matching/
├── src/main/java/com/donaton/backend/
│   ├── MsMatchingApplication.java
│   └── matching/
│       ├── controller/MatchingController.java  # Mapeo de rutas REST
│       ├── dto/MatchingDTO.java                # Objetos de transferencia de datos
│       ├── model/Matching.java                 # Entidad JPA
│       ├── repository/MatchingRepository.java  # Acceso a persistencia
│       └── service/MatchingService.java        # Reglas de negocio de emparejamiento
├── src/main/resources/
│   └── application.properties
├── pom.xml
└── Dockerfile
```
