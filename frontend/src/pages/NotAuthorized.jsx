import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';

export default function NotAuthorized() {
  const navigate = useNavigate();
  const { role, logout } = useAuth();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-page)',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 420, padding: 32 }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🔒</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Acceso no autorizado</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
          Tu rol <strong>{role ?? 'desconocido'}</strong> no tiene permisos para acceder a esta sección.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Volver
          </button>
          <button className="btn btn-secondary" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
