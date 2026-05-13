import axios from 'axios';

const BFF_URL = import.meta.env.VITE_BFF_URL ?? 'https://api.donaton.cl';

const apiClient = axios.create({
  baseURL: BFF_URL,
  timeout: 12_000,
  headers: { 'Content-Type': 'application/json' },
  // Requerido: envía la cookie HttpOnly del refresh token automáticamente
  withCredentials: true,
});

/* ─── Helpers de sesión (inyectados por AuthContext) ─── */
export let getAccessToken = () => null;
export let setAccessToken = (_t) => {};
export let clearSession   = () => {};

export const bindAuthHelpers = (get, set, clear) => {
  getAccessToken = get;
  setAccessToken = set;
  clearSession   = clear;
};

/* ─── Request interceptor: inyecta Access Token en cada petición ─── */
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ─── Response interceptor ─── */
let isRefreshing = false;
let failQueue    = [];

function processQueue(err, token = null) {
  failQueue.forEach((p) => (err ? p.reject(err) : p.resolve(token)));
  failQueue = [];
}

apiClient.interceptors.response.use(
  (response) => {
    /**
     * El Circuit Breaker (Resilience4j) puede devolver HTTP 200
     * con _degraded:true cuando los datos vienen de la caché Redis.
     * Normalizamos la respuesta para que los componentes lo detecten.
     */
    if (response.data?._degraded) {
      response.data._meta = { degraded: true, source: 'cache' };
    }
    return response;
  },
  async (error) => {
    const original = error.config;

    /* 401 → intento silencioso de renovar el Access Token con refresh cookie */
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return apiClient(original);
        });
      }

      isRefreshing = true;
      try {
        const { data } = await apiClient.post('/auth/refresh');
        setAccessToken(data.accessToken);
        processQueue(null, data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearSession();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    /* 503 / respuesta degradada como error → propaga flag para UI */
    if (error.response?.status === 503) {
      return Promise.reject({ ...error, _degraded: true });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
