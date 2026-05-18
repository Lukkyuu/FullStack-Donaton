import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth.js';
import logoUrl from '../../assets/logo.png';

const NAV_ADMIN = [
  { to: '/admin',               label: 'Dashboard',      icon: '📊', end: true },
  { to: '/admin/donaciones',    label: 'Donaciones',     icon: '💝' },
  { to: '/admin/necesidades',   label: 'Necesidades',    icon: '📋' },
  { to: '/admin/logistica',     label: 'Logística',      icon: '🚚' },
  { to: '/admin/matching',      label: 'Matching',       icon: '🔗' },
  { to: '/admin/organizaciones',label: 'Organizaciones', icon: '🏢' },
  { to: '/admin/notificaciones',label: 'Notificaciones', icon: '🔔' },
];

const ROUTE_NAMES = {
  '':              'Dashboard',
  'donaciones':    'Donaciones',
  'necesidades':   'Necesidades',
  'logistica':     'Logística',
  'matching':      'Matching',
  'organizaciones':'Organizaciones',
  'notificaciones':'Notificaciones',
};

function Breadcrumb() {
  const { pathname } = useLocation();
  const parts = pathname.replace('/admin', '').split('/').filter(Boolean);
  if (parts.length === 0) return null;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-muted)', marginBottom:16 }}>
      <span>Admin</span>
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

export default function AdminPage() {
  const { user, role, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <img src={logoUrl} alt="Donaton" className="sidebar-logo-img" />
          <div>
            <div style={{ color:'#fff', fontWeight:700, fontSize:15, lineHeight:1 }}>Donaton</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:10, marginTop:2 }}>Panel Admin</div>
          </div>
        </div>
      </div>

      <nav style={{ flex:1, padding:'14px 10px', display:'flex', flexDirection:'column', gap:3 }}>
        {NAV_ADMIN.map(({ to, label, icon, end }) => (
          <NavLink
            key={to} to={to} end={end}
            onClick={() => setSidebarOpen(false)}
            style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:10,
              padding:'9px 12px', borderRadius:8, fontSize:14,
              fontWeight: isActive ? 500 : 400,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
              background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderLeft: isActive ? '3px solid #A78BFA' : '3px solid transparent',
              transition:'all 0.15s', textDecoration:'none',
            })}
          >
            <span style={{ fontSize:16, width:20, textAlign:'center' }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding:'14px 10px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
          <div style={{ width:34, height:34, borderRadius:'50%', background:'#3C3489', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:600, fontSize:13, flexShrink:0 }}>
            {user?.nombre?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div style={{ overflow:'hidden' }}>
            <div style={{ color:'#fff', fontSize:13, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {user?.nombre ?? 'Administrador'}
            </div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>{role}</div>
          </div>
        </div>
        <button type="button" onClick={logout} style={{ width:'100%', padding:'8px', borderRadius:8, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.7)', fontSize:13, cursor:'pointer', transition:'all 0.15s', fontWeight:500 }}>
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:19 }} className="sidebar-overlay" />
      )}

      {/* Sidebar desktop */}
      <aside style={{ width:'var(--sidebar-w)', position:'fixed', top:0, left:0, height:'100vh', background:'#1A1040', display:'flex', flexDirection:'column', borderRight:'1px solid rgba(255,255,255,0.06)', zIndex:20 }} className="sidebar-desktop">
        <SidebarContent />
      </aside>

      {/* Sidebar mobile */}
      <aside style={{ position:'fixed', top:0, left:0, height:'100vh', width:260, background:'#1A1040', display:'flex', flexDirection:'column', zIndex:30, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', transition:'transform 0.28s ease', boxShadow: sidebarOpen ? '4px 0 24px rgba(0,0,0,0.3)' : 'none' }} className="sidebar-mobile">
        <SidebarContent />
      </aside>

      <div className="main-content">
        <header style={{ height:60, background:'#fff', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', padding:'0 24px', justifyContent:'space-between', position:'sticky', top:0, zIndex:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button className="hamburger-btn" onClick={() => setSidebarOpen(v => !v)}>☰</button>
            <img src={logoUrl} alt="Donaton" style={{ width:28, height:28, objectFit:'contain' }} />
            <span style={{ fontSize:13, color:'var(--text-muted)', fontWeight:500 }}>Panel Admin</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <NavLink to="/admin/notificaciones" style={{ position:'relative', background:'none', border:'1px solid var(--border-mid)', borderRadius:8, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, textDecoration:'none', color:'inherit' }}>
              🔔
              <span style={{ position:'absolute', top:5, right:5, width:7, height:7, borderRadius:'50%', background:'#D85A30', border:'1.5px solid #fff' }} />
            </NavLink>
            <span style={{ fontSize:13, color:'var(--text-secondary)', fontWeight:500 }} className="topbar-username">{user?.nombre ?? ''}</span>
            <span className={`tag-role-${role}`} style={{ fontSize:11, padding:'2px 8px', borderRadius:99, fontWeight:600 }}>{role}</span>
            <button type="button" onClick={logout} style={{ padding:'6px 14px', borderRadius:8, background:'rgba(220,38,38,0.08)', border:'1px solid rgba(220,38,38,0.2)', color:'#b91c1c', fontSize:12, cursor:'pointer', fontWeight:500, transition:'all 0.15s' }}>
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

        <footer style={{ borderTop:'1px solid var(--border)', padding:'16px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <img src={logoUrl} alt="Donaton" style={{ width:20, height:20, objectFit:'contain' }} />
            <span style={{ fontSize:12, color:'var(--text-muted)' }}>© {new Date().getFullYear()} Donaton</span>
          </div>
          <div style={{ display:'flex', gap:16 }}>
            {['Soporte técnico', 'Documentación', 'Reportar bug'].map(link => (
              <a key={link} href="#" style={{ fontSize:12, color:'var(--text-muted)', textDecoration:'none' }}>{link}</a>
            ))}
          </div>
          <span style={{ fontSize:11, color:'var(--text-muted)' }}>DSY1106 · DuocUC</span>
        </footer>
      </div>
    </div>
  );
}
