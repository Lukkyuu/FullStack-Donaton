import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth.js';
import logoUrl from '../../assets/logo.png';

const NAV_ORGANIZACION = [
  { to: '/organizacion',                label: 'Mi panel',           icon: '🏠', end: true },
  { to: '/organizacion/necesidades',    label: 'Mis necesidades',    icon: '📋' },
  { to: '/organizacion/matching',       label: 'Matching recibido',  icon: '🔗' },
  { to: '/organizacion/notificaciones', label: 'Notificaciones',     icon: '🔔' },
  { to: '/organizacion/perfil',         label: 'Mi perfil',          icon: '🏢' },
];

const ROUTE_NAMES = {
  '':               'Panel',
  'necesidades':    'Mis necesidades',
  'matching':       'Matching recibido',
  'notificaciones': 'Notificaciones',
  'perfil':         'Mi perfil',
};

function Breadcrumb() {
  const { pathname } = useLocation();
  const parts = pathname.replace('/organizacion', '').split('/').filter(Boolean);
  if (parts.length === 0) return null;
  return (
    <div className="breadcrumb">
      <span>Panel</span>
      {parts.map((p, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="breadcrumb-sep">›</span>
          <span className={i === parts.length - 1 ? 'breadcrumb-last' : ''}>
            {ROUTE_NAMES[p] ?? p}
          </span>
        </span>
      ))}
    </div>
  );
}

function SidebarContent({ user, role, logout, onClose }) {
  return (
    <>
      {/* Logo */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={logoUrl} alt="Donaton" className="sidebar-logo-img" />
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 15, lineHeight: 1, letterSpacing: '-0.01em' }}>Donaton</div>
            <div style={{
              color: 'rgba(112,248,186,0.65)', fontSize: 10, marginTop: 3,
              fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              Portal Organización
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {NAV_ORGANIZACION.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 13px', borderRadius: 10, fontSize: 14,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
              background: isActive ? 'rgba(30,185,128,0.18)' : 'transparent',
              borderLeft: isActive ? '3px solid #1EB980' : '3px solid transparent',
              transition: 'all 0.18s', textDecoration: 'none',
            })}
          >
            <span style={{ fontSize: 16, width: 20, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, padding: '8px 10px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1EB980, #006c48)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0,
            boxShadow: '0 4px 12px rgba(30,185,128,0.4)',
          }}>
            {user?.nombre?.[0]?.toUpperCase() ?? 'O'}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.nombre ?? 'Organización'}
            </div>
            <div style={{ color: 'rgba(112,248,186,0.55)', fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 1 }}>
              {role}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          style={{
            width: '100%', padding: '9px 12px', borderRadius: 10,
            background: 'rgba(240,98,146,0.1)',
            border: '1px solid rgba(240,98,146,0.2)',
            color: 'rgba(240,98,146,0.9)',
            fontSize: 13, cursor: 'pointer',
            transition: 'all 0.18s', fontWeight: 600,
            fontFamily: 'var(--font-sans)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(240,98,146,0.18)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(240,98,146,0.1)'; }}
        >
          <span>🚪</span> Cerrar sesión
        </button>
      </div>
    </>
  );
}

export default function OrganizacionPage() {
  const { user, role, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="sidebar-overlay"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 19 }}
        />
      )}

      {/* Sidebar desktop */}
      <aside
        className="sidebar-desktop"
        style={{
          width: 'var(--sidebar-w)', position: 'fixed', top: 0, left: 0,
          height: '100vh',
          background: 'linear-gradient(180deg, #003178 0%, #001945 100%)',
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid rgba(30,185,128,0.12)',
          zIndex: 20,
        }}
      >
        <SidebarContent user={user} role={role} logout={logout} onClose={() => {}} />
      </aside>

      {/* Sidebar mobile */}
      <aside
        className="sidebar-mobile"
        style={{
          position: 'fixed', top: 0, left: 0, height: '100vh', width: 265,
          background: 'linear-gradient(180deg, #003178 0%, #001945 100%)',
          display: 'flex', flexDirection: 'column', zIndex: 30,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: sidebarOpen ? '8px 0 32px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <SidebarContent user={user} role={role} logout={logout} onClose={() => setSidebarOpen(false)} />
      </aside>

      <div className="main-content">
        {/* Topbar */}
        <header style={{
          height: 60,
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--outline-variant)',
          display: 'flex', alignItems: 'center',
          padding: '0 24px', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10,
          boxShadow: '0 2px 10px rgba(0,49,120,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="hamburger-btn" onClick={() => setSidebarOpen(v => !v)} aria-label="Abrir menú">☰</button>
            <img src={logoUrl} alt="Donaton" style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: '50%', border: '1px solid rgba(0,49,120,0.1)', backgroundColor: 'var(--surface-container-lowest)' }} />
            <span style={{ fontSize: 13, color: 'var(--on-surface-variant)', fontWeight: 600 }}>Portal Organización</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <NavLink to="/organizacion/notificaciones" className="notif-btn" style={{ textDecoration: 'none' }}>
              🔔
              <span className="notif-dot" />
            </NavLink>
            <span className="topbar-username" style={{ fontSize: 13, color: 'var(--on-surface-variant)', fontWeight: 600 }}>
              {user?.nombre ?? ''}
            </span>
            <span className="tag-role-ORGANIZACION">{role ?? 'ORGANIZACION'}</span>
            <button
              type="button" onClick={logout}
              style={{
                padding: '6px 14px', borderRadius: 'var(--r-md)',
                background: 'rgba(186,26,26,0.08)', border: '1px solid rgba(186,26,26,0.2)',
                color: '#6e0034', fontSize: 12, cursor: 'pointer', fontWeight: 600,
                transition: 'all 0.18s', fontFamily: 'var(--font-sans)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(186,26,26,0.14)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(186,26,26,0.08)'; }}
            >
              Salir
            </button>
          </div>
        </header>

        <div className="page-content">
          <Breadcrumb />
          <div className="page-fade-in">
            <Outlet />
          </div>
        </div>

        <footer className="portal-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={logoUrl} alt="Donaton" style={{ width: 18, height: 18, objectFit: 'cover', borderRadius: '50%', border: '1px solid rgba(0,49,120,0.1)', backgroundColor: 'var(--surface-container-lowest)' }} />
            <span style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>© {new Date().getFullYear()} Donaton</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Términos de uso', 'Privacidad', 'Soporte'].map(link => (
              <a key={link} href="#"
                style={{ fontSize: 12, color: 'var(--on-surface-variant)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--on-surface-variant)'}
              >
                {link}
              </a>
            ))}
          </div>
          <span style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>DSY1106 · DuocUC</span>
        </footer>
      </div>
    </div>
  );
}
