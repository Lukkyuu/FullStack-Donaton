# Microservicio: Donaciones (ms-donacion)

Gestión de donaciones, registro y emisión de eventos de donación.

## Patrones Utilizados
*   **Builder:** Se usa Lombok @Builder para la instanciación inmutable de Donacion.
*   **Publisher/Subscriber:** Integración con RabbitMQ (DonacionPublisher).

## Instalación y Ejecución
1. Asegurarse de tener la BD y RabbitMQ arriba (vía Docker Compose).
2. Ejecutar: mvn spring-boot:run
*Puerto de ejecución: 8082*
