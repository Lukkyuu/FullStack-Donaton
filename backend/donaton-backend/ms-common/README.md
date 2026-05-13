# ms-common — Shared Kernel / Arquetipo Maven Base

> Módulo compartido que actúa como arquetipo base para todos los microservicios de Donatón.  
> Centraliza modelos, repositorios, seguridad JWT, mensajería RabbitMQ y configuración global.

**Rama GitHub:** `Backend` — https://github.com/Lukkyuu/FullStack-Donaton/tree/Backend

---

## ¿Qué es ms-common?

En lugar de descargar un arquetipo externo de terceros, el proyecto utiliza **ms-common**
como su propio arquetipo interno (Shared Kernel). Todo microservicio nuevo simplemente
lo declara como dependencia en su `pom.xml` y hereda automáticamente:

| Capacidad heredada | Tecnología |
|---|---|
| Acceso a base de datos | Spring Data JPA + PostgreSQL |
| Autenticación y autorización | Spring Security + JWT (jjwt 0.12.6) |
| Mensajería asíncrona | Spring AMQP + RabbitMQ |
| Validación de requests | Spring Validation |
| Modelos de dominio compartidos | Entidades JPA + Lombok |
| Manejo global de excepciones | `GlobalExceptionHandler` |
| Configuración CORS | `CorsConfig` |

---

## Contenido del módulo

```
ms-common/
├── src/main/java/com/donaton/backend/
│   ├── auth/
│   │   ├── dto/AuthDTO.java                   # DTOs de autenticación (request/response)
│   │   ├── model/Usuario.java                 # Entidad Usuario con roles (ADMIN, DONANTE, ORGANIZACION)
│   │   ├── repository/UsuarioRepository.java  # Repositorio JPA de usuarios
│   │   └── security/
│   │       ├── JwtUtil.java                   # Generación y validación de tokens JWT
│   │       ├── JwtFilter.java                 # Filtro HTTP para inyectar usuario desde JWT
│   │       └── UserDetailsServiceImpl.java    # Implementación de UserDetailsService
│   ├── config/
│   │   ├── SecurityConfig.java                # Configuración de Spring Security
│   │   ├── CorsConfig.java                    # Headers CORS globales
│   │   ├── RabbitMQConfig.java                # Exchange, Queue y Binding de RabbitMQ
│   │   └── GlobalExceptionHandler.java        # Manejo centralizado de errores HTTP
│   ├── donacion/
│   │   ├── dto/DonacionDTO.java               # DTOs de donaciones
│   │   ├── model/Donacion.java                # Entidad Donacion con @Builder
│   │   └── repository/DonacionRepository.java
│   ├── logistica/
│   │   ├── model/CentroAcopio.java
│   │   └── repository/CentroAcopioRepository.java
│   ├── matching/
│   │   ├── model/Matching.java
│   │   └── repository/MatchingRepository.java
│   ├── necesidad/
│   │   ├── dto/NecesidadDTO.java
│   │   ├── model/Necesidad.java
│   │   └── repository/NecesidadRepository.java
│   └── notificacion/
│       ├── model/Notificacion.java
│       └── repository/NotificacionRepository.java
└── pom.xml
```

---

## Cómo usar ms-common para crear un nuevo microservicio

### Paso 1 — Crear el módulo con el arquetipo Spring Boot

Desde IntelliJ IDEA: `New Module → Spring Initializr`  
O desde la terminal:

```bash
cd backend/donaton-backend
mvn archetype:generate \
  -DgroupId=com.donaton \
  -DartifactId=ms-nuevo \
  -DarchetypeArtifactId=maven-archetype-quickstart \
  -DinteractiveMode=false
```

### Paso 2 — Registrar el módulo en el POM raíz

En `backend/donaton-backend/pom.xml`, agregar dentro de `<modules>`:

```xml
<module>ms-nuevo</module>
```

### Paso 3 — Declarar ms-common como dependencia

En `ms-nuevo/pom.xml`:

```xml
<parent>
    <groupId>com.donaton</groupId>
    <artifactId>donaton-backend</artifactId>
    <version>0.0.1-SNAPSHOT</version>
</parent>

<artifactId>ms-nuevo</artifactId>

<dependencies>
    <dependency>
        <groupId>com.donaton</groupId>
        <artifactId>ms-common</artifactId>
        <version>0.0.1-SNAPSHOT</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

### Paso 4 — Agregar al docker-compose.yml

```yaml
ms-nuevo:
  build:
    context: ./ms-nuevo
  container_name: donaton-ms-nuevo
  ports:
    - "808X:808X"
  environment:
    - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/donaton
    - SPRING_DATASOURCE_USERNAME=root
    - SPRING_DATASOURCE_PASSWORD=password
    - SERVER_PORT=808X
  depends_on:
    - postgres
    - rabbitmq
  networks:
    - donaton-network
```

### Paso 5 — Agregar la ruta al Gateway

En `ms-gateway/src/main/resources/application.yml`:

```yaml
- id: nuevo-service
  uri: http://${NUEVO_HOST:localhost}:808X
  predicates:
    - Path=/api/nuevo/**
```

El nuevo microservicio hereda automáticamente JPA, Security, JWT, RabbitMQ y manejo de errores.

---

## Compilar ms-common antes de los otros módulos

```bash
cd backend/donaton-backend
mvn clean install -pl ms-common -am -DskipTests
```

Este comando es obligatorio antes de ejecutar cualquier microservicio que dependa de ms-common.