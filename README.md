ositorios · TXT
Copiar

# REPOSITORIOS DEL PROYECTO — DONATÓN
# DSY1106 Desarrollo Fullstack III — Evaluación Parcial N°2
# ============================================================
 
## REPOSITORIO PRINCIPAL
URL: https://github.com/Lukkyuu/FullStack-Donaton
Descripción: Repositorio monorepo principal del proyecto Donatón. Contiene
             el frontend (React/Vite) y el backend (Spring Boot / Maven Multi-Módulo).
 
---
 
## RAMA FRONTEND
URL: https://github.com/Lukkyuu/FullStack-Donaton/tree/Frontend
Descripción: Componente frontend empaquetado como módulo NPM (donaton-frontend v1.0.0).
             Desarrollado con React 18, Vite 5 y React Router 6. Incluye:
             - Portal Donante (/donante)
             - Portal Administrador (/admin)
             - Portal Organización (/organizacion)
             - Sistema de autenticación JWT con refresh automático (Axios interceptors)
             - Suite de pruebas unitarias (Vitest + Testing Library) — 36 casos
             - Patrones: Context/Provider, Proxy/Guard, Observer, Module, Composite, Strategy
 
---
 
## RAMA BACKEND
URL: https://github.com/Lukkyuu/FullStack-Donaton/tree/Backend
Descripción: Backend completo como proyecto Maven Multi-Módulo con los siguientes componentes:
 
  ms-gateway (BFF / API Gateway) — Puerto 8080
    Descripción: Punto de entrada único del sistema. Implementa el patrón API Gateway
                 con Spring Cloud Gateway. Centraliza CORS y enrutamiento hacia todos
                 los microservicios.
 
  ms-auth — Puerto 8081
    Descripción: Microservicio de autenticación y gestión de usuarios. Implementa
                 login, registro y generación de tokens JWT. Soporta roles
                 DONANTE, ORGANIZACION y ADMIN.
 
  ms-donacion — Puerto 8082
    Descripción: Microservicio de gestión de donaciones. CRUD completo con control
                 de acceso por rol. Emite eventos asíncronos a RabbitMQ usando
                 el patrón Publisher/Subscriber (DonacionPublisher/DonacionConsumer).
 
  ms-logistica — Puerto 8083
    Descripción: Microservicio de logística. Gestiona la asignación de donaciones
                 a centros de acopio y el seguimiento del estado hasta la entrega.
 
  ms-common (Shared Kernel / Arquetipo Maven)
    Descripción: Módulo base compartido por todos los microservicios. Centraliza
                 modelos JPA, repositorios, configuración JWT (JwtUtil, JwtFilter),
                 Spring Security, RabbitMQ y manejo global de excepciones.
                 Actúa como arquetipo interno: cualquier nuevo microservicio lo
                 incluye como dependencia y hereda toda la infraestructura.
 
---
 
## INFRAESTRUCTURA
- Base de datos: PostgreSQL 15 (docker-compose)
- Mensajería: RabbitMQ 3 (docker-compose)
- Orquestación local: Docker Compose (backend/donaton-backend/docker-compose.yml)