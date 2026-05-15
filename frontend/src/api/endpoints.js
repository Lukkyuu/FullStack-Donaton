/**
 * endpoints.js
 * Fuente única de rutas relativas al BFF (Nginx API Gateway).
 * El frontend NUNCA conoce los puertos o dominios de los microservicios.
 * Nginx enruta internamente: /donaciones → ms-donaciones:8082, etc.
 */

export const EP = {
  // ms-auth
  AUTH: {
    LOGIN:   '/api/auth/login',
    REGISTER:'/api/auth/register',
    LOGOUT:  '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    ME:      '/api/auth/me',
  },

  // ms-donaciones
  DONACIONES: {
    LIST:         '/api/donaciones',
    BY_ID:        (id)  => `/api/donaciones/${id}`,
    CREATE:       '/api/donaciones',
    UPDATE:       (id)  => `/api/donaciones/${id}`,
    CANCEL:       (id)  => `/api/donaciones/${id}/cancelar`,
    CAMPANAS:     '/api/donaciones/campanas',
    CAMPANA_BY_ID:(id)  => `/api/donaciones/campanas/${id}`,
  },

  // ms-necesidades
  NECESIDADES: {
    LIST:     '/api/necesidades',
    BY_ID:    (id) => `/api/necesidades/${id}`,
    CREATE:   '/api/necesidades',
    UPDATE:   (id) => `/api/necesidades/${id}`,
    CLOSE:    (id) => `/api/necesidades/${id}/cerrar`,
    PUBLICAS: '/api/necesidades/publicas',
  },

  // ms-logistica
  LOGISTICA: {
    RECURSOS:        '/api/logistica/recursos',
    RECURSO_BY_ID:   (id) => `/api/logistica/recursos/${id}`,
    CREAR_RECURSO:   '/api/logistica/recursos',
    DISTRIBUCIONES:  '/api/logistica/distribuciones',
    CREAR_DIST:      '/api/logistica/distribuciones',
    DIST_BY_ID:      (id) => `/api/logistica/distribuciones/${id}`,
  },

  // ms-usuarios
  USUARIOS: {
    LIST:       '/usuarios',
    BY_ID:      (id) => `/usuarios/${id}`,
    CREATE:     '/usuarios',
    UPDATE:     (id) => `/usuarios/${id}`,
    DELETE:     (id) => `/usuarios/${id}`,
    PERFIL:     '/usuarios/perfil',
  },

  // ms-matching (solo lectura para el frontend)
  MATCHING: {
    RESULTADOS:  '/api/matching/resultados',
    BY_ID:       (id) => `/api/matching/resultados/${id}`,
  },

  // ms-notificaciones (solo preferencias desde el frontend)
  NOTIFICACIONES: {
    PREFS:        '/api/notificaciones/preferencias',
    UPDATE_PREFS: '/api/notificaciones/preferencias',
  },
};
