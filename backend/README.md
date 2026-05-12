# Donaton — Frontend

> Portal web del sistema de gestión humanitaria Donaton.  

---

## Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 18.x o superior |
| npm | 9.x o superior |
| Git | 2.x o superior |

Verificar instalación:
```bash
node -v
npm -v
```

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/<DeinTekk>/donaton-frontend.git
cd donaton-frontend

# 2. Instalar dependencias
npm install
```

---

## Ejecución en desarrollo

```bash
npm run dev
```

La aplicación quedará disponible en: **http://localhost:5173**

> El frontend incluye un sistema de **mock tokens** que permite navegar sin backend activo.

---

## Build de producción

```bash
npm run build
```

Los archivos compilados quedan en la carpeta `dist/`. Para previsualizar el build:

```bash
npm run preview
```

---

## Cuentas de prueba (modo mock)

> Contraseña para todas las cuentas: **`12345678`**

| Email | Rol | Portal |
|---|---|---|
| `admin@donaton.cl` | ADMIN | `/admin` |
| `org@donaton.cl` | ORGANIZACION | `/organizacion` |
| `donante@donaton.cl` | DONANTE | `/donante` |

---

## Conexión al backend

La URL base de la API se configura en:

```
src/api/axiosClient.js
```

Por defecto apunta a `http://localhost:8080` (API Gateway / Nginx BFF).  
Para cambiarla sin tocar el código, crear un archivo `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## Estructura del proyecto

```
donaton-frontend/
├── public/                  # Archivos estáticos
├── src/
│   ├── api/
│   │   ├── axiosClient.js   # Cliente HTTP centralizado (BFF proxy)
│   │   ├── endpoints.js     # Mapa único de endpoints del BFF
│   │   └── services/        # Servicios por módulo (donaciones, auth, etc.)
│   ├── auth/
│   │   ├── AuthContext.jsx  # Contexto global de autenticación (JWT)
│   │   ├── ProtectedRoute.jsx
│   │   └── useAuth.js
│   ├── pages/               # Páginas públicas (Login, Register, Landing, NotAuthorized)
│   ├── portals/
│   │   ├── admin/           # Portal ADMIN y ORGANIZACION
│   │   │   ├── AdminPage.jsx
│   │   │   └── pages/       # Dashboard, Matching, Logística, Organizaciones, etc.
│   │   └── donante/         # Portal DONANTE
│   │       ├── DonantePage.jsx
│   │       └── pages/       # Dashboard, MisDonaciones, Campañas, Perfil, etc.
│   ├── router/
│   │   └── AppRouter.jsx    # Definición de rutas y roles
│   └── shared/
│       ├── components/      # Componentes reutilizables (Modal, StatusBadge, etc.)
│       └── hooks/
│           └── useApi.js    # Hook genérico de llamadas HTTP con estado degradado
├── package.json
└── vite.config.js
```

---

## Ejecución de pruebas

```bash
# Pruebas unitarias
npm test

# Pruebas con cobertura
npm run test:coverage
```

---

## Roles del sistema

| Rol | Descripción | Portal |
|---|---|---|
| `ANONIMO` | Usuario no autenticado | `/bienvenida` (Landing pública) |
| `DONANTE` | Realiza donaciones | `/donante` |
| `ORGANIZACION` | Gestiona necesidades propias | `/organizacion` |
| `ADMIN` | Acceso total al sistema | `/admin` |

---

## Patrones de diseño implementados

Ver documento **`docs/analisis-patrones.md`** para el análisis detallado.

| Patrón | Ubicación |
|---|---|
| Module | `src/api/services/` |
| Observer | `src/shared/hooks/useApi.js` |
| Strategy | `AdminPage.jsx` (NAV por rol) |
| Proxy / Guard | `src/auth/ProtectedRoute.jsx` |
| Context / Singleton | `src/auth/AuthContext.jsx` |
| Composite | `src/shared/components/index.jsx` |

---

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `VITE_API_BASE_URL` | URL base del BFF (Nginx) | `http://localhost:8080` |

---

## Tecnologías utilizadas

- **React 18** — UI declarativa basada en componentes
- **Vite 5** — Bundler y servidor de desarrollo
- **React Router 6** — Enrutamiento del lado del cliente (SPA)
- **Axios** — Cliente HTTP con interceptores JWT
- **CSS Variables** — Design system sin dependencias de CSS-in-JS
