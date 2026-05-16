import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import apiClient, { bindAuthHelpers } from '../api/axiosClient.js';
import { EP } from '../api/endpoints.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const accessTokenRef = useRef(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
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
    try { await apiClient.post(EP.AUTH.LOGOUT); } catch (_) { }
    applyToken(null);
    window.location.replace('/login');
  }, [applyToken]);

  useEffect(() => {
    bindAuthHelpers(getToken, applyToken, doLogout);
  }, [getToken, applyToken, doLogout]);

  useEffect(() => {
    apiClient.post(EP.AUTH.REFRESH)
      .then(({ data }) => applyToken(data.token))
      .catch(() => applyToken(null))
      .finally(() => setIsLoading(false));
  }, [applyToken]);

  const login = useCallback(async (email, password) => {
    const { data } = await apiClient.post(EP.AUTH.LOGIN, { email, password });
    applyToken(data.token);
    return data.rol;
  }, [applyToken]);

  return (
    <AuthContext.Provider value={{ role, user, isLoading, login, logout: doLogout, applyToken }}>
      {children}
    </AuthContext.Provider>
  );
}