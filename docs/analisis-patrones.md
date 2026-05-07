# Análisis de Patrones de Diseño — Donaton Frontend

**Proyecto:** Donaton — Sistema de gestión humanitaria  
**Asignatura:** DSY1106 Desarrollo Fullstack III · DuocUC  
**Componente:** Frontend (React + Vite)

---

## 1. Introducción

El frontend de Donaton implementa múltiples patrones de diseño de software reconocidos por la industria (GoF y patrones modernos de React). Cada patrón fue seleccionado con base en el problema concreto que resuelve dentro de la arquitectura del sistema.

---

## 2. Patrones de Diseño Implementados

### 2.1 Patrón Module (Módulo)

**Categoría:** Estructural  
**Ubicación:** `src/api/services/`

**Descripción:**  
Cada servicio de API encapsula la lógica de acceso a un recurso específico del BFF, exponiendo solo las funciones necesarias. Ningún componente conoce la URL base ni los headers de autenticación; todo está abstraído detrás del módulo.

**Archivos involucrados:**
- `donacionesService.js`
- `matchingService.js`
- `necesidadesService.js`
- `notificacionesService.js`
- `usuariosService.js`
- `logisticaService.js`

**Ejemplo de implementación:**

```js
// src/api/services/donacionesService.js
export const donacionesService = {
  listar:         (params) => apiClient.get(EP.DONACIONES.LIST, { params }),
  obtener:        (id)     => apiClient.get(EP.DONACIONES.BY_ID(id)),
  crear:          (data)   => apiClient.post(EP.DONACIONES.CREATE, data),
  listarCampanas: (params) => apiClient.get(EP.DONACIONES.CAMPANAS, { params }),
};
```

**Problema que resuelve:**  
Evita que los componentes de UI dependan directamente de URLs o configuraciones HTTP. Si el BFF cambia un endpoint, solo se modifica `endpoints.js`, sin tocar ningún componente.

---

### 2.2 Patrón Observer (a través de Custom Hooks)

**Categoría:** Comportamental  
**Ubicación:** `src/shared/hooks/useApi.js`

**Descripción:**  
`useApi` es un Custom Hook que encapsula el estado de una llamada HTTP (`data`, `loading`, `error`, `degraded`). Los componentes que lo usan se "suscriben" al resultado y se re-renderizan automáticamente cuando el estado cambia — implementando el patrón Observer a través del sistema reactivo de React.

**Ejemplo de implementación:**

```js
export function useApi(serviceFn, deps = [], immediate = true) {
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(immediate);
  const [error,    setError]    = useState(null);
  const [degraded, setDegraded] = useState(false);
  // ... lógica de suscripción y ejecución
  return { data, loading, error, degraded, refetch: execute };
}
```

**Problema que resuelve:**  
Centraliza el ciclo de vida de las peticiones HTTP. Evita duplicar `useState`/`useEffect` en cada componente y maneja estados degradados por Circuit Breaker.

---

### 2.3 Patrón Strategy (Estrategia de Navegación por Rol)

**Categoría:** Comportamental  
**Ubicación:** `src/portals/admin/AdminPage.jsx`

**Descripción:**  
La navegación del portal se adapta dinámicamente según el rol del usuario autenticado. Se definen dos "estrategias" de navegación intercambiables sin modificar la estructura del componente.

**Ejemplo de implementación:**

```js
const NAV_ADMIN = [
  { to: '/admin',                label: 'Dashboard',      icon: '📊' },
  { to: '/admin/organizaciones', label: 'Organizaciones', icon: '🏢' },
  // ... acceso total
];

const NAV_ORGANIZACION = [
  { to: '/admin',             label: 'Mi panel',        icon: '🏠' },
  { to: '/admin/necesidades', label: 'Mis necesidades', icon: '📋' },
  // ... acceso restringido
];

// Selección de estrategia en tiempo de ejecución
const navItems = role === 'ORGANIZACION' ? NAV_ORGANIZACION : NAV_ADMIN;
```

**Problema que resuelve:**  
Permite que ADMIN y ORGANIZACION compartan el mismo layout pero con acceso diferenciado, sin condicionales dispersos por toda la aplicación.

---

### 2.4 Patrón Proxy / Guard (Ruta Protegida)

**Categoría:** Estructural  
**Ubicación:** `src/auth/ProtectedRoute.jsx`

**Descripción:**  
`ProtectedRoute` actúa como un Proxy entre el router y los componentes protegidos. Intercepta el acceso a las rutas, verifica que el rol del usuario esté autorizado, y redirige si no lo está.

**Ejemplo de implementación:**

```jsx
export default function ProtectedRoute({ allowedRoles, redirectTo }) {
  const { role, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!role || !allowedRoles.includes(role))
    return <Navigate to={redirectTo} replace />;

  return <Outlet />; // Acceso concedido
}
```

**Problema que resuelve:**  
Centraliza el control de acceso. Ningún componente de página necesita verificar si el usuario tiene permiso.

---

### 2.5 Patrón Context / Singleton (Estado de Autenticación)

**Categoría:** Creacional + Estructural  
**Ubicación:** `src/auth/AuthContext.jsx`

**Descripción:**  
`AuthContext` implementa una instancia única del estado de autenticación accesible desde cualquier componente del árbol. Gestiona el token JWT en memoria (no en localStorage por seguridad).

**Ejemplo de implementación:**

```jsx
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const accessTokenRef = useRef(null); // Token en memoria
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  const applyToken = useCallback((token) => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    setRole(payload.role);
    setUser({ id: payload.sub, nombre: payload.nombre });
  }, []);

  return (
    <AuthContext.Provider value={{ role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Problema que resuelve:**  
Evita el prop drilling. Cualquier componente puede consumir `useAuth()` y acceder al estado de sesión directamente.

---

### 2.6 Patrón Composite (Componentes Reutilizables)

**Categoría:** Estructural  
**Ubicación:** `src/shared/components/index.jsx`

**Descripción:**  
Los componentes compartidos (`Modal`, `StatusBadge`, `EmptyState`, `ErrorBox`, `LoadingSpinner`) son bloques independientes que se componen libremente para construir interfaces complejas.

**Ejemplo de implementación:**

```jsx
<Modal open={!!cancelTarget} title="Cancelar donación" onClose={...}
  footer={
    <>
      <button className="btn btn-secondary">Volver</button>
      <button className="btn btn-danger">Confirmar</button>
    </>
  }
>
  <ErrorBox message={cancelError} />   {/* Composite anidado */}
</Modal>
```

**Problema que resuelve:**  
Elimina la duplicación de UI. `StatusBadge` se usa en 6+ páginas con consistencia visual garantizada.

---

## 3. Patrones Arquitectónicos

### 3.1 BFF — Backend For Frontend

El `axiosClient.js` actúa como capa de abstracción hacia el Nginx API Gateway (BFF). El frontend **nunca conoce los puertos ni dominios de los microservicios**.

```
React App → axiosClient.js → Nginx BFF → ms-donaciones:8082
                                        → ms-auth:8081
                                        → ms-matching:8084
                                        → ms-notificaciones:8085
```

### 3.2 Portals Pattern (Micro-Frontends por Rol)

```
src/portals/
├── admin/    → Portal ADMIN (acceso total)
│             → Portal ORGANIZACION (acceso restringido)
└── donante/  → Portal DONANTE
```

Cada portal tiene su propio layout, navegación y páginas. El router dirige según el rol extraído del JWT.

---

## 4. Resumen de Patrones

| # | Patrón | Tipo | Archivo principal | Problema resuelto |
|---|---|---|---|---|
| 1 | Module | Estructural | `api/services/*.js` | Encapsulación de acceso al BFF |
| 2 | Observer | Comportamental | `hooks/useApi.js` | Estado reactivo de llamadas HTTP |
| 3 | Strategy | Comportamental | `AdminPage.jsx` | Navegación diferenciada por rol |
| 4 | Proxy/Guard | Estructural | `auth/ProtectedRoute.jsx` | Control de acceso a rutas |
| 5 | Context/Singleton | Creacional | `auth/AuthContext.jsx` | Estado global de autenticación |
| 6 | Composite | Estructural | `shared/components/index.jsx` | Componentes UI reutilizables |

---

## 5. Conclusión

La selección de estos patrones garantiza que el frontend de Donaton sea:

- **Mantenible**: cada cambio está localizado en un único lugar (Module, Singleton)
- **Escalable**: nuevos roles o módulos se agregan sin modificar código existente (Strategy, Guard)
- **Consistente**: la UI compartida evita divergencias visuales entre páginas (Composite)
- **Seguro**: el control de acceso es centralizado e irrompible (Proxy/Guard)
