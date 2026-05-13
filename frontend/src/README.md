# donaton-frontend · NPM Component Package

> Portal web del sistema humanitario **Donatón**.  
> Paquete NPM interno — React 18 + Vite 5 + React Router 6 + Axios

**Rama GitHub:** `Frontend` — https://github.com/Lukkyuu/FullStack-Donaton/tree/Frontend

---

## Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 18.x o superior |
| npm | 9.x o superior |
| Git | 2.x o superior |

```bash
node -v   # debe mostrar v18.x o superior
npm -v    # debe mostrar v9.x o superior
```

---

## Instalación

```bash
# 1. Clonar la rama Frontend
git clone -b Frontend https://github.com/Lukkyuu/FullStack-Donaton.git
cd FullStack-Donaton

# 2. Instalar dependencias NPM
npm install
```

---

## Variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto (no se versiona):

```env
VITE_BFF_URL=http://localhost:8080
```

| Variable | Descripción | Default |
|---|---|---|
| `VITE_BFF_URL` | URL del API Gateway / BFF | `https://api.donaton.cl` |

---

## Ejecución

### Desarrollo (hot-reload)
```bash
npm run dev
# Disponible en: http://localhost:5173
```

### Build de producción
```bash
npm run build
# Archivos compilados en: dist/
```

### Previsualizar el build
```bash
npm run preview
```

---

## Pruebas unitarias

```bash
# Ejecutar todas las pruebas
npm test

# Modo watch (re-ejecuta al guardar)
npm run test:watch

# Cobertura de código
npm run test:coverage
```

### Suite de pruebas incluida

| Archivo | Patrón cubierto | Casos |
|---|---|---|
| `src/test/ProtectedRoute.test.jsx` | Proxy / Guard | 6 |
| `src/test/StatusBadge.test.jsx` | Composite | 12 |
| `src/test/endpoints.test.js` | Module | 18 |

---

## Cuentas de prueba

> Contraseña para todas: **`12345678`**

| Email | Rol | Portal |
|---|---|---|
| `admin@donaton.cl` | ADMIN | `/admin` |
| `org@donaton.cl` | ORGANIZACION | `/organizacion` |
| `donante@donaton.cl` | DONANTE | `/donante` |

---

## Estructura del proyecto

```
donaton-frontend/
├── src/
│   ├── api/
│   │   ├── axiosClient.js        # Cliente HTTP centralizado con interceptores JWT
│   │   ├── endpoints.js          # Mapa único de endpoints del BFF
│   │   └── services/             # Servicios por dominio
│   │       ├── authService.js
│   │       ├── donacionesService.js
│   │       ├── logisticaService.js
│   │       ├── matchingService.js
│   │       ├── necesidadesService.js
│   │       ├── notificacionesService.js
│   │       └── usuariosService.js
│   ├── auth/
│   │   ├── AuthContext.jsx       # Contexto global de autenticación (JWT en memoria)
│   │   ├── ProtectedRoute.jsx    # Guard de rutas por rol
│   │   └── useAuth.js            # Hook de acceso al contexto
│   ├── pages/                    # Páginas públicas
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── NotAuthorized.jsx
│   ├── portals/
│   │   ├── admin/                # Portal ADMIN y ORGANIZACION
│   │   │   ├── AdminPage.jsx
│   │   │   └── pages/            # Dashboard, Matching, Logística, etc.
│   │   └── donante/              # Portal DONANTE
│   │       ├── DonantePage.jsx
│   │       └── pages/            # Dashboard, MisDonaciones, Campañas, etc.
│   ├── router/
│   │   └── AppRouter.jsx         # Definición de rutas y roles
│   ├── shared/
│   │   ├── components/
│   │   │   ├── index.jsx         # StatusBadge, Modal, ErrorBox, EmptyState, Topbar
│   │   │   └── LoadingSpinner.jsx
│   │   └── hooks/
│   │       └── useApi.js         # Hook genérico con detección de Circuit Breaker
│   └── test/                     # Suite de pruebas unitarias (Vitest)
├── package.json
├── vite.config.js
└── .env.example
```

---

## Patrones de diseño implementados

| Patrón | Ubicación |
|---|---|
| Context / Provider (Singleton) | `src/auth/AuthContext.jsx` |
| Proxy / Guard | `src/auth/ProtectedRoute.jsx` |
| Observer / Custom Hook | `src/shared/hooks/useApi.js` |
| Module | `src/api/services/` + `endpoints.js` |
| Composite | `src/shared/components/index.jsx` |
| Strategy | `AdminPage.jsx` + `AppRouter.jsx` |

---

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18.3.1 | UI declarativa basada en componentes |
| Vite | 5.3.1 | Bundler y servidor de desarrollo |
| React Router DOM | 6.24.0 | Enrutamiento SPA |
| Axios | 1.7.2 | Cliente HTTP con interceptores JWT |
| Vitest | 4.1.5 | Framework de pruebas unitarias |
| Testing Library | 16.3.2 | Testing de componentes React |