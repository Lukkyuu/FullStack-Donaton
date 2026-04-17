# Módulo Común (Shared Kernel)

Este no es un microservicio ejecutable, sino un **Módulo Maven (Librería Compartida)** que contiene:
*   Modelos JPA (Entidades).
*   Repositorios (Spring Data JPA).
*   Filtros de Seguridad (JwtFilter).
*   Configuraciones Globales.

## Instalación
Este módulo debe ser compilado antes que los microservicios:
\\ash
mvn clean install
\