# Backend For Frontend (BFF) / API Gateway (ms-gateway)

Este componente actúa como el **Backend For Frontend (BFF)** y API Gateway del sistema Donatón. Actúa como el punto de entrada único para el frontend, enrutando las peticiones a los microservicios subyacentes y manejando problemas transversales como CORS.

## Patrones Utilizados
*   **API Gateway Pattern:** Oculta la complejidad de la arquitectura de microservicios al cliente.
*   **BFF (Backend for Frontend):** Permite adaptar y agregar respuestas si es necesario para el cliente web/móvil.

## Requisitos y Ejecución
1. Asegúrese de que los microservicios (ms-auth, ms-donacion, etc.) estén corriendo.
2. Ejecutar desde el directorio del gateway:
   \\ash
   mvn spring-boot:run
   \El BFF estará escuchando en el puerto **8080**.
