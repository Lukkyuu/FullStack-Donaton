import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import apiClient, { bindAuthHelpers } from '../api/axiosClient.js';
import { EP } from '../api/endpoints.js';
import logoUrl from '../assets/logo.png';
import { demoLogin } from './demoUsers.js';

export const AuthContext = createContext(null);

function SplashScreen() {
  return (
    <div className="splash-screen">
      <img src={logoUrl} alt="Donaton" className="splash-logo" />
      <div className="splash-text">Donaton</div>
      <div className="splash-sub">Cargando tu sesión…</div>
      <div className="splash-bar-wrap">
        <div className="splash-bar" />
      </div>
    </div>
  );
}

export function AuthProvider({ children }) {
  const accessTokenRef = useRef(null);
  const [role, setRole]       = useState(null);
  const [user, setUser]       = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getToken = useCallback(() => accessTokenRef.current, []);

  const applyToken = useCallback((token) => {
    accessTokenRef.current = token;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRole(payload.role ?? null);
        setUser({ id: payload.sub, nombre: payload.nombre, email: payload.email });
      } catch {
        setRole(null);
        setUser(null);
      }
    } else {
      setRole(null);
      setUser(null);
    }
  }, []);

  const doLogout = useCallback(async () => {
    try { await apiClient.post(EP.AUTH.LOGOUT); } catch (_) {}
    applyToken(null);
    window.location.replace('/login');
  }, [applyToken]);

  useEffect(() => {
    bindAuthHelpers(getToken, applyToken, doLogout);
  }, [getToken, applyToken, doLogout]);

  useEffect(() => {
    // Mínimo 1.2s de splash para que se vea bien
    const minDelay = new Promise(r => setTimeout(r, 1200));
    const refreshCall = apiClient.post(EP.AUTH.REFRESH)
      .then(({ data }) => applyToken(data.token))
      .catch(() => applyToken(null));
    Promise.all([minDelay, refreshCall]).finally(() => setIsLoading(false));
  }, [applyToken]);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await apiClient.post(EP.AUTH.LOGIN, { email, password });
      applyToken(data.token);
      return data.rol;
    } catch (err) {
      // Fallback demo: si el backend no está disponible, usa credenciales de prueba
      const demo = demoLogin(email, password);
      if (demo) {
        applyToken(demo.token);
        return demo.rol;
      }
      throw err;
    }
  }, [applyToken]);

  if (isLoading) return <SplashScreen />;

  return (
    <AuthContext.Provider value={{ role, user, isLoading, login, logout: doLogout, applyToken }}>
      {children}
    </AuthContext.Provider>
  );
}