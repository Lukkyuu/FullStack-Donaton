/**
 * MODO DEMO — Usuarios de prueba para desarrollo local sin backend
 * Eliminar este archivo antes de producción.
 *
 * Credenciales disponibles:
 *   admin@donaton.cl     / Admin123!    → Panel Admin
 *   donante@donaton.cl   / Donante123!  → Portal Donante
 *   org@donaton.cl       / Org123!      → Portal Organización
 */

export const DEMO_USERS = [
  {
    email: 'admin@donaton.cl',
    password: 'Admin123!',
    token: buildFakeJWT({ sub: '1', nombre: 'Admin Demo', email: 'admin@donaton.cl', role: 'ADMIN' }),
    rol: 'ADMIN',
  },
  {
    email: 'donante@donaton.cl',
    password: 'Donante123!',
    token: buildFakeJWT({ sub: '2', nombre: 'Juan Donante', email: 'donante@donaton.cl', role: 'DONANTE' }),
    rol: 'DONANTE',
  },
  {
    email: 'org@donaton.cl',
    password: 'Org123!',
    token: buildFakeJWT({ sub: '3', nombre: 'Fundación Demo', email: 'org@donaton.cl', role: 'ORGANIZACION' }),
    rol: 'ORGANIZACION',
  },
];

/** Construye un JWT falso (solo para demo, sin firma real) */
function buildFakeJWT(payload) {
  const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const claims  = btoa(JSON.stringify({ ...payload, iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000) + 86400 }));
  return `${header}.${claims}.DEMO_SIGNATURE`;
}

export function demoLogin(email, password) {
  const user = DEMO_USERS.find(u => u.email === email && u.password === password);
  if (!user) return null;
  return { token: user.token, rol: user.rol };
}
