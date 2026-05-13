# Donaton Backend (Maven Multi-Module)

Este README centraliza como ejecutar y probar cada microservicio del backend.

## 1. Requisitos

- Java 21
- Maven Wrapper (`mvnw` / `mvnw.cmd`)
- Docker Desktop (opcional, recomendado para PostgreSQL y RabbitMQ)

## 2. Ubicacion del proyecto

Trabajar desde:

```powershell
cd backend/donaton-backend
```

## 3. Levantar infraestructura base (recomendado)

```powershell
docker-compose up postgres rabbitmq -d
```

Servicios esperados:
- PostgreSQL: `localhost:5432`
- RabbitMQ AMQP: `localhost:5672`
- RabbitMQ UI: `localhost:15672` (guest/guest)

## 4. Compilar dependencia compartida

`ms-common` debe estar instalado antes de correr los MS que dependen de el.

```powershell
.\mvnw -pl ms-common -am clean install -DskipTests
```

## 5. Ejecutar un microservicio

Formato general:

```powershell
.\mvnw -pl <microservicio> spring-boot:run
```

Ejemplos:

```powershell
.\mvnw -pl ms-auth spring-boot:run
.\mvnw -pl ms-donacion spring-boot:run
.\mvnw -pl ms-logistica spring-boot:run
.\mvnw -pl ms-necesidad spring-boot:run
.\mvnw -pl ms-usuarios spring-boot:run
.\mvnw -pl ms-matching spring-boot:run
.\mvnw -pl ms-notificaciones spring-boot:run
.\mvnw -pl ms-gateway spring-boot:run
```

## 6. Probar (tests unitarios) por microservicio

Formato general:

```powershell
.\mvnw -pl <microservicio> test
```

Ejemplos:

```powershell
.\mvnw -pl ms-auth test
.\mvnw -pl ms-donacion test
.\mvnw -pl ms-logistica test
.\mvnw -pl ms-necesidad test
.\mvnw -pl ms-usuarios test
.\mvnw -pl ms-matching test
.\mvnw -pl ms-notificaciones test
.\mvnw -pl ms-gateway test
```

Para incluir modulos requeridos automaticamente:

```powershell
.\mvnw -pl ms-gateway -am test
```

## 7. Tabla rapida por microservicio

| Microservicio | Puerto | Ejecutar | Probar |
|---|---:|---|---|
| `ms-gateway` | 8080 | `.\\mvnw -pl ms-gateway spring-boot:run` | `.\\mvnw -pl ms-gateway test` |
| `ms-auth` | 8081 | `.\\mvnw -pl ms-auth spring-boot:run` | `.\\mvnw -pl ms-auth test` |
| `ms-donacion` | 8082 | `.\\mvnw -pl ms-donacion spring-boot:run` | `.\\mvnw -pl ms-donacion test` |
| `ms-logistica` | 8083 | `.\\mvnw -pl ms-logistica spring-boot:run` | `.\\mvnw -pl ms-logistica test` |
| `ms-necesidad` | 8084 | `.\\mvnw -pl ms-necesidad spring-boot:run` | `.\\mvnw -pl ms-necesidad test` |
| `ms-usuarios` | 8085 | `.\\mvnw -pl ms-usuarios spring-boot:run` | `.\\mvnw -pl ms-usuarios test` |
| `ms-matching` | 8086 | `.\\mvnw -pl ms-matching spring-boot:run` | `.\\mvnw -pl ms-matching test` |
| `ms-notificaciones` | 8087 | `.\\mvnw -pl ms-notificaciones spring-boot:run` | `.\\mvnw -pl ms-notificaciones test` |
| `ms-common` | N/A (libreria) | `.\\mvnw -pl ms-common -am clean install -DskipTests` | `.\\mvnw -pl ms-common test` |

## 8. Probar endpoint basico de cada MS

Con el MS ejecutandose, revisar salud:

```powershell
curl http://localhost:8080/actuator/health
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
curl http://localhost:8083/actuator/health
curl http://localhost:8084/actuator/health
```

Nota: algunos microservicios pueden no exponer `actuator` segun su configuracion actual.

## 9. Ejecutar todos via Docker Compose

```powershell
docker-compose up --build
```

Luego probar por gateway:

```powershell
curl http://localhost:8080/
curl http://localhost:8080/health
```

## 10. Troubleshooting rapido

- Si `mvnw` no se reconoce: ejecutar comandos desde `backend/donaton-backend`.
- Si falla un MS por dependencias: volver a instalar `ms-common`.
- Si falla conexion a BD o RabbitMQ: verificar `docker-compose ps` y puertos.
- Si un test no se detecta: validar clase con sufijo `*Test` y anotaciones JUnit 5 (`@Test`).
