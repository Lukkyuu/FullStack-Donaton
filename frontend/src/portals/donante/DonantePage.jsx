import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth.js';
import logoUrl from '../../assets/logo.png';

const NAV_ITEMS = [
  { to: '/donante',                label: 'Inicio',          icon: '🏠', end: true },
  { to: '/donante/mis-donaciones', label: 'Mis donaciones',  icon: '💝' },
  { to: '/donante/necesidades',    label: 'Necesidades',     icon: '📋' },
  { to: '/donante/campanas',       label: 'Campañas',        icon: '📢' },
  { to: '/donante/nueva-donacion', label: 'Donar ahora',     icon: '➕', highlight: true },
  { to: '/donante/impacto',        label: 'Mi impacto',      icon: '🌱' },
  { to: '/donante/perfil',         label: 'Mi perfil',       icon: '👤' },
];

const ROUTE_NAMES = {
  '':               'Inicio',
  'mis-donaciones': 'Mis donaciones',
  'necesidades':    'Necesidades',
  'campanas':       'Campañas',
  'nueva-donacion': 'Nueva donación',
  'impacto':        'Mi impacto',
  'perfil':         'Mi perfil',
  'notificaciones': 'Notificaciones',
};

function Breadcrumb() {
  const { pathname } = useLocation();
  const parts = pathname.replace('/donante', '').split('/').filter(Boolean);
  if (parts.length === 0) return null;
  return (
    <div className="breadcrumb">
      <span>Inicio</span>
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
      <div style={{
        padding: '20px 18px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={logoUrl} alt="Donaton" className="sidebar-logo-img" />
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 15, lineHeight: 1, letterSpacing: '-0.01em' }}>Donaton</div>
            <div style={{ color: 'rgba(161,187,255,0.6)', fontSize: 10, marginTop: 3, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Portal Donante
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {NAV_ITEMS.map(({ to, label, icon, end, highlight }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 13px', borderRadius: 10, fontSize: 14,
              fontWeight: isActive ? 700 : 500,
              color: isActive
                ? '#fff'
                : highlight
                ? '#1EB980'
                : 'rgba(255,255,255,0.6)',
              background: isActive
                ? 'rgba(30,185,128,0.18)'
                : highlight
                ? 'rgba(30,185,128,0.08)'
                : 'transparent',
              borderLeft: isActive
                ? '3px solid #1EB980'
                : '3px solid transparent',
              transition: 'all 0.18s',
              textDecoration: 'none',
            })}
          >
            <span style={{ fontSize: 16, width: 20, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
            {label}
            {highlight && (
              <span style={{
                marginLeft: 'auto', fontSize: 10, fontWeight: 700,
                background: 'rgba(30,185,128,0.2)', color: '#1EB980',
                borderRadius: 99, padding: '2px 7px', letterSpacing: '0.03em',
              }}>
                NEW
              </span>
            )}
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
            {user?.nombre?.[0]?.toUpperCase() ?? 'D'}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.nombre ?? 'Donante'}
            </div>
            <div style={{ color: 'rgba(161,187,255,0.5)', fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 1 }}>
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

export default function DonantePage() {
  const { user, role, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Overlay mobile */}
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
          background: 'linear-gradient(180deg, #001945 0%, #003178 100%)',
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid rgba(255,255,255,0.06)',
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
          background: 'linear-gradient(180deg, #001945 0%, #003178 100%)',
          display: 'flex', flexDirection: 'column', zIndex: 30,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: sidebarOpen ? '8px 0 32px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <SidebarContent user={user} role={role} logout={logout} onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main */}
      <div className="main-content">
        {/* Topbar */}
        <header style={{
          height: 60,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--outline-variant)',
          display: 'flex', alignItems: 'center',
          padding: '0 24px', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10,
          boxShadow: '0 2px 10px rgba(0,49,120,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen(v => !v)}
              aria-label="Abrir menú"
            >
              ☰
            </button>
            <img src={logoUrl} alt="Donaton" style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: '50%', border: '1px solid rgba(0,49,120,0.1)', backgroundColor: 'var(--surface-container-lowest)' }} />
            <span style={{ fontSize: 13, color: 'var(--on-surface-variant)', fontWeight: 600 }}>Portal Donante</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <NavLink
              to="/donante/notificaciones"
              className="notif-btn"
              style={{ textDecoration: 'none' }}
            >
              🔔
              <span className="notif-dot" />
            </NavLink>

            <NavLink to="/donante/perfil" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #1EB980, #006c48)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: 12,
                boxShadow: '0 3px 10px rgba(30,185,128,0.4)',
              }}>
                {user?.nombre?.[0]?.toUpperCase() ?? 'D'}
              </div>
              <span className="topbar-username" style={{ fontSize: 13, color: 'var(--on-surface-variant)', fontWeight: 600 }}>
                {user?.nombre ?? ''}
              </span>
            </NavLink>

            <span className="tag-role-DONANTE">DONANTE</span>
          </div>
        </header>

        {/* Page content */}
        <div className="page-content">
          <Breadcrumb />
          <div className="page-fade-in">
            <Outlet />
          </div>
        </div>

        {/* Footer */}
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
