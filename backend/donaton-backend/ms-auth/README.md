# Microservicio: Auth (ms-auth)

Este microservicio se encarga de gestionar la seguridad, la autenticación y la gestión de usuarios del sistema Donatón.

## Patrones Utilizados
*   **Dependency Injection:** A través de Spring Framework.
*   **Repository Pattern:** Para el acceso a la base de datos de usuarios (`UsuarioRepository`).
*   **Singleton:** Todos los `@Service` y `@Controller` son instanciados como singletons por el contenedor de Spring.

## Requisitos Previos
*   Java 21
*   PostgreSQL corriendo (ver `docker-compose.yml` en la raíz)
*   Módulo `ms-common` compilado e instalado localmente.

## Instalación y Ejecución

1. Compilar el módulo común (desde la raíz del proyecto):
   ```bash
   mvn clean install -pl ms-common -am
   ```
2. Ejecutar el microservicio:
   ```bash
   cd ms-auth
   mvn spring-boot:run
   ```

El microservicio se levantará en el puerto **8081**.
