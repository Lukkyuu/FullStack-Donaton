import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './useAuth.js';
import LoadingSpinner from '../shared/components/LoadingSpinner.jsx';

/**
 * ProtectedRoute
 * @param {string[]} allowedRoles - roles con acceso permitido
 * @param {string}   redirectTo   - ruta si no autorizado (default: /no-autorizado)
 */
export default function ProtectedRoute({ allowedRoles = [], redirectTo = '/no-autorizado' }) {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
