import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';
import logoUrl from '../assets/logo.png';

const ROLE_INFO = {
  ADMIN:        { icon: '🛡️', label: 'Administrador', home: '/admin',        color: '#3C3489', bg: '#EEEDFE' },
  ORGANIZACION: { icon: '🏢', label: 'Organización',  home: '/organizacion', color: '#185FA5', bg: '#E6F1FB' },
  DONANTE:      { icon: '🤝', label: 'Donante',        home: '/donante',      color: '#0F6E56', bg: '#E1F5EE' },
};

export default function NotAuthorized() {
  const navigate = useNavigate();
  const { role, logout } = useAuth();
  const info = ROLE_INFO[role] ?? { icon: '👤', label: role ?? 'desconocido', home: '/bienvenida', color: '#5F5E5A', bg: '#F1EFE8' };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#071d16 0%,#0f2d24 50%,#1a5240 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position:'fixed',top:-80,right:-60,width:350,height:350,borderRadius:'50%',background:'rgba(93,202,165,0.1)',filter:'blur(60px)',pointerEvents:'none' }} />
      <div style={{ position:'fixed',bottom:-60,left:-40,width:280,height:280,borderRadius:'50%',background:'rgba(216,90,48,0.08)',filter:'blur(50px)',pointerEvents:'none' }} />

      <div style={{ textAlign: 'center', maxWidth: 460, position: 'relative', zIndex: 1 }}>
        <img src={logoUrl} alt="Donaton" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: '50%', border: '3px solid rgba(255, 255, 255, 0.2)', backgroundColor: 'var(--surface-container-lowest)', marginBottom: 20, filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))' }} />

        <div style={{ fontSize: 72, marginBottom: 8 }}>🔒</div>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
          Acceso no autorizado
        </h1>

        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 24 }}>
          Tu cuenta no tiene permisos para ver esta sección.
        </p>

        {/* Role chip */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 99, padding: '8px 18px', marginBottom: 32,
          fontSize: 14, color: '#fff', fontWeight: 500,
        }}>
          <span>{info.icon}</span>
          <span>Rol actual: <strong>{info.label}</strong></span>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            style={{ padding: '12px 24px', fontSize: 14, borderRadius: 12 }}
            onClick={() => navigate(info.home, { replace: true })}
          >
            {info.icon} Ir a mi portal
          </button>
          <button
            className="btn"
            style={{ padding: '12px 24px', fontSize: 14, borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.25)', color: '#fff' }}
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>
          <button
            className="btn"
            style={{ padding: '12px 24px', fontSize: 14, borderRadius: 12, background: 'rgba(216,90,48,0.15)', border: '1px solid rgba(216,90,48,0.3)', color: '#F87171' }}
            onClick={logout}
          >
            Cerrar sesión
          </button>
        </div>

        <p style={{ marginTop: 36, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          Donaton · Si crees que esto es un error, contacta al administrador
        </p>
      </div>
    </div>
  );
}
