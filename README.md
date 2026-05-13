# 🎁 Donatón — Plataforma Integral de Donaciones

Plataforma Fullstack para conectar donantes, organizaciones y beneficiarios en un ecosistema de donaciones coordinadas y seguras.

## 📋 Estructura del Proyecto

```
FullStack-Donaton/
├── frontend/                    # React 18 + Vite 5 + React Router 6
│   ├── src/                     # Código fuente del portal web
│   ├── dist/                    # Build de producción
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile.frontend      # Imagen Docker (Nginx + SPA)
│   ├── nginx.conf               # Configuración Nginx
│   └── README.md                # Documentación frontend
│
├── backend/                     # Spring Boot Multi-Module (Maven)
│   ├── donaton-backend/
│   │   ├── ms-gateway/          # API Gateway (Puerto 8080)
│   │   ├── ms-auth/             # Autenticación JWT (Puerto 8081)
│   │   ├── ms-donacion/         # Gestión de donaciones (Puerto 8082)
│   │   ├── ms-logistica/        # Logística y envíos (Puerto 8083)
│   │   ├── ms-necesidad/        # Gestión de necesidades (Puerto 8084)
│   │   ├── ms-usuarios/         # Gestión de usuarios (Puerto 8085)
│   │   ├── ms-matching/         # Algoritmo de matching (Puerto 8086)
│   │   ├── ms-notificaciones/   # Sistema de notificaciones (Puerto 8087)
│   │   ├── ms-common/           # Shared Kernel (Librería)
│   │   ├── docker-compose.yml   # Orquestación de servicios
│   │   ├── pom.xml              # Parent POM (Maven)
│   │   └── README.md            # Documentación backend
│   │
│   └── docs/                    # Documentación técnica del backend
│
├── docs/                        # Documentación general del proyecto
├── .github/                     # GitHub Actions y templates
├── .vscode/                     # Configuración VS Code
├── docker-compose.yml           # Docker Compose principal (opcional)
├── docker-compose.dev.yml       # Configuración desarrollo
├── nginx.conf                   # Config Nginx (raíz)
├── .env                         # Variables de entorno (local)
├── .env.example                 # Plantilla de variables
├── .gitignore
└── README.md                    # Este archivo
```

---

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/Lukkyuu/FullStack-Donaton.git
cd FullStack-Donaton
```

### 2. Variables de entorno

```bash
cp .env.example .env
# Editar .env si es necesario
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev          # Desarrollo en http://localhost:5173
npm run build        # Build producción
npm run test         # Ejecutar tests
```

### 4. Backend

```bash
cd backend/donaton-backend
# Docker Compose (recomendado)
docker-compose up --build

# O ejecutar localmente (requiere PostgreSQL + RabbitMQ)
./mvnw clean install -pl ms-common -am -DskipTests
./mvnw -pl ms-gateway spring-boot:run
```

---

## 🏗️ Arquitectura

### Frontend (React SPA)
- **Portales:** Donante, Organización, Administrador
- **Autenticación:** JWT con refresh automático (Axios interceptors)
- **Testing:** Vitest + Testing Library (36+ casos)
- **Patrones:** Context API, Custom Hooks, Module, Observer, Proxy

### Backend (Microservicios)
- **Gateway:** Spring Cloud Gateway (BFF)
- **Autenticación:** JWT centralizado en ms-auth
- **Mensajería:** RabbitMQ (eventos asíncronos)
- **BD:** PostgreSQL 15
- **Patrones:** API Gateway, Shared Kernel, Repository, Dependency Injection

---

## 📚 Documentación

| Componente | Ubicación | Descripción |
|---|---|---|
| **Frontend** | [frontend/README.md](frontend/README.md) | Guía React, Vite, Testing |
| **Backend** | [backend/donaton-backend/README.md](backend/donaton-backend/README.md) | Guía Maven, microservicios, Spring Boot |
| **Despliegue** | [DEPLOY.md](DEPLOY.md) | AWS EC2, Docker, Production |

---

## 🐳 Docker

### Ejecutar todo (recomendado)

```bash
docker-compose up --build
```

Servicios disponibles:
- Frontend: http://localhost:80
- Gateway: http://localhost:8080
- PostgreSQL: localhost:5432
- RabbitMQ UI: http://localhost:15672 (guest/guest)

### Ejecutar solo backend

```bash
cd backend/donaton-backend
docker-compose up --build
```

### Ejecutar solo frontend

```bash
cd frontend
docker build -f Dockerfile.frontend -t donaton-frontend:latest .
docker run -p 80:80 donaton-frontend:latest
```

---

## 🔧 Requisitos

| Herramienta | Versión | Uso |
|---|---|---|
| Node.js | 18+ | Frontend (npm) |
| npm | 9+ | Frontend (dependencias) |
| Java | 21 | Backend (Spring Boot) |
| Maven | 3.9.x | Backend (compilación) |
| Docker | 24.x | Contenedores |
| Docker Compose | 2.x | Orquestación |

---

## 🎯 Microservicios

| Servicio | Puerto | Responsabilidad | Tech Stack |
|---|---:|---|---|
| **Gateway** | 8080 | Routing centralizado, CORS, BFF | Spring Cloud Gateway |
| **Auth** | 8081 | Autenticación, roles, JWT | Spring Boot + JwtUtil |
| **Donación** | 8082 | CRUD donaciones, eventos | Spring Boot + RabbitMQ |
| **Logística** | 8083 | Centros acopio, asignación | Spring Boot + JPA |
| **Necesidad** | 8084 | Gestión de necesidades | Spring Boot |
| **Usuarios** | 8085 | Perfiles y gestión | Spring Boot |
| **Matching** | 8086 | Algoritmo de matching | Spring Boot |
| **Notificaciones** | 8087 | Envío de eventos | Spring Boot + RabbitMQ |
| **Common** | N/A | Librería compartida (Shared Kernel) | JPA, Security, JWT |

---

## 🧪 Testing

### Frontend

```bash
cd frontend
npm run test              # Ejecutar tests una sola vez
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Backend

```bash
cd backend/donaton-backend
./mvnw -pl ms-gateway test              # Testear un MS
./mvnw -pl ms-gateway -am test          # Incluir dependencias
./mvnw -pl ms-common test               # Testear librería
```

---

## 📝 Ramas y Estrategia de versionado

| Rama | Descripción |
|---|---|
| `main` | Producción estable (sincroniza Frontend + Backend) |
| `Frontend` | Código React/Vite actualizado |
| `Backend` | Código Spring Boot/Maven actualizado |

---

## 🔐 Autenticación

- **JWT** con Claims: `sub`, `roles`, `exp`
- **Refresh Token** automático vía Axios interceptors
- **Roles:** `DONANTE`, `ORGANIZACION`, `ADMIN`
- **Expiración:** 24 horas (configurable)

---

## 🚀 Despliegue

Ver detalles de despliegue en [DEPLOY.md](DEPLOY.md) (AWS EC2, RDS, ElastiCache)

---

## 👥 Patrones Utilizados

### Frontend
- **Context API** — Estado global (Auth, User)
- **Custom Hooks** — Lógica reutilizable (`useAuth`, `useApi`)
- **Axios Interceptors** — Proxy para inyectar JWT
- **Module Pattern** — Encapsulación de servicios
- **Composite Pattern** — Componentes anidados

### Backend
- **API Gateway** — Enrutamiento centralizado (Spring Cloud Gateway)
- **Shared Kernel** — ms-common como arquetipo interno
- **Repository Pattern** — Spring Data JPA
- **Dependency Injection** — `@RequiredArgsConstructor` (Lombok)
- **Publisher/Subscriber** — RabbitMQ (DonacionPublisher/Consumer)
- **Service Layer** — Separación de lógica de negocio

---

## 📖 Referencias

- **GitHub:** https://github.com/Lukkyuu/FullStack-Donaton
- **Spring Boot:** https://spring.io/projects/spring-boot
- **React:** https://react.dev
- **Vite:** https://vitejs.dev

---

## 📄 Licencia

MIT (ver LICENSE si aplica)