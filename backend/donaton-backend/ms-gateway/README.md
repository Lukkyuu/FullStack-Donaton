# ms-gateway — Backend For Frontend (BFF) / API Gateway

> Punto de entrada único del sistema Donatón.  
> Implementa el patrón **API Gateway** y **Backend For Frontend (BFF)** con Spring Cloud Gateway.

**Rama GitHub:** `Backend` — https://github.com/Lukkyuu/FullStack-Donaton/tree/Backend  
**Puerto:** `8080`

---

## Responsabilidad

| Función | Detalle |
|---|---|
| Enrutamiento | Redirige cada ruta `/api/**` al microservicio correspondiente |
| CORS centralizado | Permite peticiones desde el frontend sin configurar CORS en cada MS |
| Punto de entrada único | El frontend solo necesita conocer la URL del gateway |
| Balanceo futuro | Preparado para integrar Spring Cloud LoadBalancer |

---

## Tabla de enrutamiento

| Ruta del Gateway | Microservicio destino | Puerto |
|---|---|---|
| `/api/auth/**` | ms-auth | 8081 |
| `/api/donaciones/**` | ms-donacion | 8082 |
| `/api/logistica/**` | ms-logistica | 8083 |
| `/api/centros/**` | ms-logistica | 8083 |
| `/api/necesidades/**` | ms-necesidad | 8084 |
| `/api/usuarios/**` | ms-usuarios | 8085 |
| `/api/matching/**` | ms-matching | 8086 |
| `/api/notificaciones/**` | ms-notificaciones | 8087 |

---

## Requisitos previos

| Herramienta | Versión |
|---|---|
| Java | 21 |
| Maven | 3.9.x |
| Docker + Docker Compose | 24.x |

---

## Instalación y ejecución

### Opción A — Docker Compose (recomendado)

Desde la raíz del proyecto backend, levanta todos los servicios de una vez:

```bash
cd backend/donaton-backend
docker-compose up --build
```

El gateway queda disponible en: **http://localhost:8080**

### Opción B — Ejecución local

Asegurarse de que ms-auth, ms-donacion y ms-logistica estén corriendo primero.

```bash
cd backend/donaton-backend/ms-gateway
mvn spring-boot:run
```

---

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `AUTH_HOST` | Host de ms-auth | `localhost` |
| `DONACION_HOST` | Host de ms-donacion | `localhost` |
| `LOGISTICA_HOST` | Host de ms-logistica | `localhost` |
| `NECESIDAD_HOST` | Host de ms-necesidad | `localhost` |
| `FRONTEND_ORIGIN` | Origen permitido por CORS | `http://localhost:3000` |

---

## Verificar que el gateway está activo

```bash
curl http://localhost:8080/api/auth/me
# Respuesta esperada: 401 Unauthorized (gateway funcionando, sin token)

curl http://localhost:8080/actuator/health
# Respuesta esperada: {"status":"UP"}
```

---

## Patrones implementados

| Patrón | Descripción |
|---|---|
| **API Gateway** | Centraliza el enrutamiento y oculta la topología interna de microservicios |
| **BFF (Backend For Frontend)** | Permite adaptar respuestas para el cliente web sin modificar los microservicios |
| **CORS Centralizado** | Un solo punto de configuración de headers CORS para toda la API |

---

## Estructura

```
ms-gateway/
├── src/main/
│   ├── java/com/donaton/backend/
│   │   └── MsGatewayApplication.java
│   └── resources/
│       └── application.yml       # Configuración de rutas y CORS
├── pom.xml
├── Dockerfile
└── README.md
```