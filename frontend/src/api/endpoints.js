/**
 * endpoints.js
 * Fuente única de rutas relativas al BFF (Nginx API Gateway).
 * El frontend NUNCA conoce los puertos o dominios de los microservicios.
 * Nginx enruta internamente: /donaciones → ms-donaciones:8082, etc.
 */

export const EP = {
  // ms-auth
  AUTH: {
    LOGIN:   '/auth/login',
    REGISTER:'/api/auth/register',
    LOGOUT:  '/auth/logout',
    REFRESH: '/auth/refresh',
    ME:      '/auth/me',
  },

  // ms-donaciones
  DONACIONES: {
    LIST:         '/donaciones',
    BY_ID:        (id)  => `/donaciones/${id}`,
    CREATE:       '/donaciones',
    UPDATE:       (id)  => `/donaciones/${id}`,
    CANCEL:       (id)  => `/donaciones/${id}/cancelar`,
    CAMPANAS:     '/donaciones/campanas',
    CAMPANA_BY_ID:(id)  => `/donaciones/campanas/${id}`,
  },

  // ms-necesidades
  NECESIDADES: {
    LIST:     '/necesidades',
    BY_ID:    (id) => `/necesidades/${id}`,
    CREATE:   '/necesidades',
    UPDATE:   (id) => `/necesidades/${id}`,
    CLOSE:    (id) => `/necesidades/${id}/cerrar`,
    PUBLICAS: '/necesidades/publicas',
  },

  // ms-logistica
  LOGISTICA: {
    RECURSOS:        '/logistica/recursos',
    RECURSO_BY_ID:   (id) => `/logistica/recursos/${id}`,
    CREAR_RECURSO:   '/logistica/recursos',
    DISTRIBUCIONES:  '/logistica/distribuciones',
    CREAR_DIST:      '/logistica/distribuciones',
    DIST_BY_ID:      (id) => `/logistica/distribuciones/${id}`,
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
    RESULTADOS:  '/matching/resultados',
    BY_ID:       (id) => `/matching/resultados/${id}`,
  },

  // ms-notificaciones (solo preferencias desde el frontend)
  NOTIFICACIONES: {
    PREFS:        '/notificaciones/preferencias',
    UPDATE_PREFS: '/notificaciones/preferencias',
  },
};
