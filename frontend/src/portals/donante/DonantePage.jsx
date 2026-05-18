import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth.js';
import logoUrl from '../../assets/logo.png';

const NAV_ITEMS = [
  { to: '/donante',                label: 'Inicio',          icon: '🏠', end: true },
  { to: '/donante/mis-donaciones', label: 'Mis donaciones',  icon: '💝' },
  { to: '/donante/necesidades',    label: 'Necesidades',     icon: '📋' },
  { to: '/donante/campanas',       label: 'Campañas',        icon: '📢' },
  { to: '/donante/nueva-donacion', label: 'Donar ahora',     icon: '➕' },
  { to: '/donante/impacto',        label: 'Mi impacto',      icon: '🌱' },
  { to: '/donante/perfil',         label: 'Mi perfil',       icon: '👤' },
];

// Breadcrumb helper
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
    <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-muted)', marginBottom:16 }}>
      <span>Inicio</span>
      {parts.map((p, i) => (
        <span key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span>›</span>
          <span style={i === parts.length - 1 ? { color:'var(--text-primary)', fontWeight:500 } : {}}>
            {ROUTE_NAMES[p] ?? p}
          </span>
        </span>
      ))}
    </div>
  );
}

export default function DonantePage() {
  const { user, role, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <img src={logoUrl} alt="Donaton" className="sidebar-logo-img" />
          <div>
            <div style={{ color:'#fff', fontWeight:700, fontSize:15, lineHeight:1 }}>Donaton</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:10, marginTop:2 }}>Portal Donante</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'14px 10px', display:'flex', flexDirection:'column', gap:3, overflowY:'auto' }}>
        {NAV_ITEMS.map(({ to, label, icon, end }) => (
          <NavLink
            key={to} to={to} end={end}
            onClick={() => setSidebarOpen(false)}
            style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:10,
              padding:'9px 12px', borderRadius:8, fontSize:14,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
              background: isActive ? 'rgba(93,202,165,0.18)' : 'transparent',
              borderLeft: isActive ? '3px solid #5DCAA5' : '3px solid transparent',
              transition:'all 0.15s', textDecoration:'none',
            })}
          >
            <span style={{ fontSize:16, width:20, textAlign:'center' }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ padding:'14px 10px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
          <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#5DCAA5,#1D6A54)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:13, flexShrink:0 }}>
            {user?.nombre?.[0]?.toUpperCase() ?? 'D'}
          </div>
          <div style={{ overflow:'hidden' }}>
            <div style={{ color:'#fff', fontSize:13, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {user?.nombre ?? 'Donante'}
            </div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>{role}</div>
          </div>
        </div>
        <button
          type="button" onClick={logout}
          style={{ width:'100%', padding:'8px', borderRadius:8, background:'rgba(216,90,48,0.12)', border:'1px solid rgba(216,90,48,0.25)', color:'#F87171', fontSize:12, cursor:'pointer', transition:'all 0.15s', fontWeight:500 }}
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="app-layout">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:19, display:'none' }}
          className="sidebar-overlay"
        />
      )}

      {/* Sidebar desktop */}
      <aside style={{ width:'var(--sidebar-w)', position:'fixed', top:0, left:0, height:'100vh', background:'var(--bg-sidebar)', display:'flex', flexDirection:'column', borderRight:'1px solid rgba(255,255,255,0.06)', zIndex:20 }} className="sidebar-desktop">
        <SidebarContent />
      </aside>

      {/* Sidebar mobile drawer */}
      <aside
        style={{ position:'fixed', top:0, left:0, height:'100vh', width:260, background:'var(--bg-sidebar)', display:'flex', flexDirection:'column', zIndex:30, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', transition:'transform 0.28s ease', boxShadow: sidebarOpen ? '4px 0 24px rgba(0,0,0,0.3)' : 'none' }}
        className="sidebar-mobile"
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="main-content">
        {/* Topbar */}
        <header style={{ height:60, background:'#fff', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', padding:'0 24px', justifyContent:'space-between', position:'sticky', top:0, zIndex:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {/* Hamburger */}
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen(v => !v)}
              aria-label="Abrir menú"
            >
              ☰
            </button>
            <img src={logoUrl} alt="Donaton" style={{ width:28, height:28, objectFit:'contain' }} />
            <span style={{ fontSize:13, color:'var(--text-muted)', fontWeight:500 }}>Portal Donante</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <NavLink to="/donante/notificaciones" style={{ position:'relative', background:'none', border:'1px solid var(--border-mid)', borderRadius:8, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, textDecoration:'none', color:'inherit' }}>
              🔔
              <span style={{ position:'absolute', top:5, right:5, width:7, height:7, borderRadius:'50%', background:'#D85A30', border:'1.5px solid #fff' }} />
            </NavLink>
            <NavLink to="/donante/perfil" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none' }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#5DCAA5,#1D6A54)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:12 }}>
                {user?.nombre?.[0]?.toUpperCase() ?? 'D'}
              </div>
              <span style={{ fontSize:13, color:'var(--text-secondary)', fontWeight:500 }} className="topbar-username">{user?.nombre ?? ''}</span>
            </NavLink>
            <span className="tag-role-DONANTE" style={{ fontSize:11, padding:'2px 8px', borderRadius:99, fontWeight:600 }}>DONANTE</span>
          </div>
        </header>

        <div className="page-content">
          <Breadcrumb />
          <div className="page-fade-in">
            <Outlet />
          </div>
        </div>

        {/* Footer del portal */}
        <footer style={{ borderTop:'1px solid var(--border)', padding:'16px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <img src={logoUrl} alt="Donaton" style={{ width:20, height:20, objectFit:'contain' }} />
            <span style={{ fontSize:12, color:'var(--text-muted)' }}>© {new Date().getFullYear()} Donaton</span>
          </div>
          <div style={{ display:'flex', gap:16 }}>
            {['Términos de uso', 'Privacidad', 'Soporte'].map(link => (
              <a key={link} href="#" style={{ fontSize:12, color:'var(--text-muted)', textDecoration:'none' }}
                onMouseEnter={e => e.target.style.color='var(--brand-primary)'}
                onMouseLeave={e => e.target.style.color='var(--text-muted)'}
              >{link}</a>
            ))}
          </div>
          <span style={{ fontSize:11, color:'var(--text-muted)' }}>DSY1106 · DuocUC</span>
        </footer>
      </div>
    </div>
  );
}
