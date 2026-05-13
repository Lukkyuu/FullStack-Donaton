# Donaton Frontend

Portal web de donaciones construido con React 18, Vite 5 y React Router 6.

## 🎯 Características

- **React 18** — Interfaz moderna y reactiva
- **Vite 5** — Build tool ultrarrápido
- **React Router 6** — Navegación tipo SPA
- **Axios** — Cliente HTTP con interceptores JWT
- **Vitest + Testing Library** — Suite de pruebas unitarias

## 📋 Portales

- **Donante** — Crear y gestionar donaciones
- **Organización** — Gestionar necesidades y receptores  
- **Administrador** — Visibilidad total del sistema

## 🚀 Instalación y ejecución

### Requisitos

- Node.js 18+
- npm 9+

### Pasos

```bash
cd frontend

# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Ejecutar tests
npm run test
npm run test:watch
npm run test:coverage
```

## 🐳 Docker

```bash
# Desde raíz del proyecto
docker-compose up frontend --build

# O construir manualmente
docker build -f frontend/Dockerfile.frontend -t donaton-frontend:latest .
```

## 🧪 Testing

```bash
cd frontend

# Correr una sola vez
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## 📚 Estructura

```
frontend/
├── src/
│   ├── pages/          # Componentes de página (Donante, Admin, Org)
│   ├── components/     # Componentes reutilizables
│   ├── hooks/          # Custom React hooks
│   ├── services/       # Servicios HTTP (Axios)
│   ├── utils/          # Utilitarios (JWT, helpers)
│   ├── App.jsx         # Routing principal
│   └── main.jsx        # Entry point
├── dist/               # Build output
├── index.html          # Template HTML
├── package.json
├── vite.config.js
├── Dockerfile.frontend # Config Docker
└── README.md
```

## 🔐 Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `VITE_BFF_URL` | URL del API Gateway (ms-gateway) | `http://localhost:8080` |

## 🎨 Patrones implementados

| Patrón | Ubicación | Descripción |
|---|---|---|
| **Context/Provider** | `AuthContext`, `UserContext` | Estado global de autenticación |
| **Custom Hooks** | `useAuth()`, `useApi()` | Lógica reutilizable |
| **Proxy** | `Axios Interceptors` | Inyección automática de JWT |
| **Module** | `src/services/` | Encapsulación de API calls |

## 📝 Notas

- El frontend se conecta al gateway en puerto 8080 (ms-gateway)
- Los tokens JWT se guardan en localStorage
- Se implementa refresh automático de tokens vía interceptores

---

**Rama GitHub:** `Frontend` — https://github.com/Lukkyuu/FullStack-Donaton/tree/Frontend  
**Version:** 1.0.0
