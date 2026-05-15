import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth.js';

const NAV_ORGANIZACION = [
  { to: '/organizacion',               label: 'Mi panel',          icon: '🏠', end: true },
  { to: '/organizacion/necesidades',   label: 'Mis necesidades',   icon: '📋' },
  { to: '/organizacion/matching',      label: 'Matching recibido', icon: '🔗' },
  { to: '/organizacion/notificaciones',label: 'Notificaciones',    icon: '🔔' },
];

export default function OrganizacionPage() {
  const { user, role, logout } = useAuth();

  const sidebarBg = '#0D2B42';
  const accentBg  = '#185FA5';

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside style={{
        width: 'var(--sidebar-w)', position: 'fixed', top: 0, left: 0,
        height: '100vh', background: sidebarBg,
        display: 'flex', flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        zIndex: 20,
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: accentBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>
              🏢
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, lineHeight: 1 }}>Donaton</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 2 }}>
                Panel Organización
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ORGANIZACION.map(({ to, label, icon, end }) => (
            <NavLink
              key={to} to={to} end={end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8, fontSize: 14,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                transition: 'all 0.15s', textDecoration: 'none',
              })}
            >
              <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Role badge + user + logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: accentBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 600, fontSize: 13, flexShrink: 0,
            }}>
              {user?.nombre?.[0]?.toUpperCase() ?? 'O'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.nombre ?? 'Organización'}
              </div>
              <span className={`tag-role-${role}`} style={{
                fontSize: 10, padding: '1px 7px', borderRadius: 99,
                fontWeight: 600, display: 'inline-block',
              }}>
                {role}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            style={{
              width: '100%', padding: '8px', borderRadius: 8,
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        {/* Topbar */}
        <header style={{
          height: 60, background: '#fff',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          padding: '0 32px', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Portal de Organización</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <NavLink
              to="/organizacion/notificaciones"
              style={{ position: 'relative', background: 'none', border: '1px solid var(--border-mid)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, textDecoration: 'none', color: 'inherit' }}
            >
              🔔
              <span style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: '50%', background: '#D85A30', border: '1.5px solid #fff' }} />
            </NavLink>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{user?.nombre ?? ''}</span>
            <span className={`tag-role-${role}`} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>{role}</span>
            <button
              type="button"
              onClick={logout}
              style={{
                padding: '6px 14px', borderRadius: 8,
                background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)',
                color: '#b91c1c', fontSize: 12, cursor: 'pointer', fontWeight: 500,
                transition: 'all 0.15s',
              }}
            >
              Salir
            </button>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
