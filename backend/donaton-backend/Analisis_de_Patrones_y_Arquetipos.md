# Análisis de Patrones de Diseño y Arquetipos

## 1. Patrones de Diseño Seleccionados y Justificación

### A. Patrón Backend For Frontend (BFF) / API Gateway
*   **Componente:** `ms-gateway`
*   **Justificación:** En lugar de exponer todos los microservicios (Auth, Donaciones, Logística, Necesidad) directamente al frontend web o móvil, se implementó un API Gateway usando Spring Cloud Gateway. Esto centraliza la autenticación, el manejo de CORS y el enrutamiento (ej. mapeando `/api/auth/**` al puerto correspondiente). Facilita enormemente el consumo para el equipo de frontend.

### B. Patrón Builder
*   **Componente:** Entidades como `Donacion.java` y `Necesidad.java` (A través de la anotación `@Builder` de Lombok).
*   **Justificación:** Permite la creación inmutable y clara de objetos complejos. Al guardar un nuevo registro en la base de datos, el patrón Builder evita constructores con múltiples parámetros confusos, mejorando la mantenibilidad del código.

### C. Patrón Publisher / Subscriber (Mensajería Asíncrona)
*   **Componente:** `DonacionPublisher` y `DonacionConsumer` (vía RabbitMQ).
*   **Justificación:** Para desacoplar servicios. Cuando se realiza una donación, en lugar de bloquear el hilo esperando a que otros servicios terminen su lógica, se emite un evento a una cola de mensajes. Esto mejora la resiliencia y escalabilidad del sistema.

### D. Patrón Repository
*   **Componente:** Todas las interfaces que extienden `JpaRepository` (ej. `UsuarioRepository`).
*   **Justificación:** Abstrae la lógica de acceso a datos (JPA/Hibernate) de la lógica de negocio. Permite realizar consultas complejas sin escribir SQL explícito, lo cual es el estándar en arquitecturas basadas en Spring Data.

### E. Inyección de Dependencias (Dependency Injection)
*   **Componente:** Todos los controladores y servicios (`@RestController`, `@Service`).
*   **Justificación:** Promueve el bajo acoplamiento. Permite que el framework de Spring gestione el ciclo de vida de los objetos, inyectando los repositorios o servicios donde sean necesarios mediante constructores.

---

## 2. Arquetipos Maven Utilizados

El proyecto no utiliza un arquetipo descargado de terceros, sino que se ha estructurado utilizando el arquetipo base de **Spring Boot (spring-boot-starter-parent)**, adaptado bajo una arquitectura de **Maven Multi-Módulo (Monorepositorio)**.

*   **Módulo Semilla / Shared Kernel (`ms-common`):** Actúa como el arquetipo o librería base para el resto de los microservicios. Centraliza los modelos, repositorios, configuraciones de JWT y RabbitMQ.
*   **Justificación:** Permite que cualquier microservicio nuevo (ej. `ms-reportes`) simplemente agregue a su `pom.xml` la dependencia a `ms-common` y herede inmediatamente la conexión a la base de datos y la seguridad, estandarizando la creación de nuevos componentes sin duplicar código.
