import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/useAuth.js';
import { useApi } from '../../../shared/hooks/useApi.js';
import { donacionesService } from '../../../api/services/donacionesService.js';
import { necesidadesService } from '../../../api/services/necesidadesService.js';
import { LoadingSpinner, DegradedBanner, ErrorBox, StatusBadge } from '../../../shared/components/index.jsx';

const URGENCY_COLOR = { ALTA: '#ba1a1a', MEDIA: '#F59E0B', BAJA: '#1EB980' };
const URGENCY_BG    = { ALTA: 'rgba(186,26,26,0.08)', MEDIA: '#fef3c7', BAJA: 'rgba(30,185,128,0.08)' };

/* Animated number counter */
function AnimatedNumber({ value, duration = 1000 }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);
  useEffect(() => {
    const start = prevRef.current;
    const end   = Number(value) || 0;
    if (start === end) return;
    const startTime = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (t < 1) requestAnimationFrame(tick);
      else prevRef.current = end;
    };
    requestAnimationFrame(tick);
  }, [value, duration]);
  return <span>{display}</span>;
}

/* Skeleton placeholder */
function SkeletonCard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[1,2,3].map(i => (
        <div key={i} className="skeleton skeleton-card" style={{ height: 52, borderRadius: 10 }} />
      ))}
    </div>
  );
}

export default function DonanteHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [greetAnim, setGreetAnim] = useState(false);

  const { data: donaciones, loading: loadDon, error: errDon, degraded: degDon } =
    useApi(() => donacionesService.listarMias({ limit: 5 }));
  const { data: necesidades, loading: loadNec, error: errNec, degraded: degNec } =
    useApi(() => necesidadesService.publicas({ limit: 4 }));
  const { data: campanas } =
    useApi(() => donacionesService.listarCampanas({ limit: 10 }));

  const items = donaciones?.content ?? donaciones ?? [];
  const necs  = necesidades?.content ?? necesidades ?? [];
  const camps = campanas?.content    ?? campanas    ?? [];

  useEffect(() => { setTimeout(() => setGreetAnim(true), 100); }, []);

  const statsData = [
    { label: 'Mis donaciones',    value: items.length, icon: '💝', color: 'rgba(0,49,120,0.08)',   accent: 'var(--primary)' },
    { label: 'Necesidades activas', value: necs.length, icon: '📋', color: 'rgba(30,185,128,0.08)', accent: '#1EB980' },
    { label: 'Campañas en curso', value: camps.filter(c => c.estado === 'ACTIVA' || c.estado === 'ACTIVO').length || 0, icon: '📢', color: 'rgba(240,98,146,0.08)', accent: 'var(--soft-red)' },
    { label: 'Entregas completadas', value: items.filter(d => d.estado === 'COMPLETADO' || d.estado === 'ENTREGADO').length, icon: '🌱', color: 'rgba(30,185,128,0.08)', accent: '#006c48' },
  ];

  return (
    <div>
      {/* ── Page header ── */}
      <div className="page-header" style={{ animation: 'fadeInUp 0.4s ease both' }}>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          Bienvenido, {user?.nombre ?? 'Donante'}
          <span style={{
            display: 'inline-block',
            animation: greetAnim ? 'none' : 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.4s both',
            transformOrigin: 'center',
            fontSize: 26,
          }}>
            👋
          </span>
        </h1>
        <p className="page-subtitle">Resumen de tu actividad en Donaton</p>
      </div>

      <DegradedBanner show={degDon || degNec} />

      {/* ── Stats cards ── */}
      <div className="stats-grid">
        {statsData.map((s, i) => (
          <div
            key={s.label}
            className="stat-card hover-lift"
            style={{
              animation: `fadeInUp 0.45s ease ${0.06 + i * 0.07}s both`,
              borderTop: `3px solid ${s.accent}`,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Icon bg */}
            <div style={{
              position: 'absolute', top: -10, right: -10,
              width: 60, height: 60, borderRadius: '50%',
              background: s.color, pointerEvents: 'none',
            }} />
            <div style={{ fontSize: 24, marginBottom: 8, position: 'relative' }}>{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.accent, position: 'relative' }}>
              <AnimatedNumber value={s.value} duration={800} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Main 2-col grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, animation: 'fadeInUp 0.5s ease 0.3s both' }}>

        {/* Mis últimas donaciones */}
        <div className="card" style={{ padding: 26 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--on-surface)' }}>
              💝 Mis últimas donaciones
            </h3>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12, padding: '5px 12px' }}
              onClick={() => navigate('/donante/mis-donaciones')}
            >
              Ver todas →
            </button>
          </div>

          {loadDon ? (
            <SkeletonCard />
          ) : errDon ? (
            <ErrorBox message={errDon} />
          ) : items.length === 0 ? (
            <div className="empty-state" style={{ padding: '28px 0' }}>
              <div className="empty-state-icon">💝</div>
              <div className="empty-state-title">Sin donaciones aún</div>
              <div className="empty-state-desc" style={{ marginBottom: 16 }}>Haz tu primera donación hoy.</div>
              <button
                className="btn btn-teal"
                style={{ borderRadius: 'var(--r-lg)' }}
                onClick={() => navigate('/donante/nueva-donacion')}
              >
                Donar ahora →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} className="card-stagger">
              {items.slice(0, 5).map((d) => (
                <div
                  key={d.id}
                  onClick={() => navigate(`/donante/mis-donaciones/${d.id}`)}
                  className="hover-lift"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '11px 14px',
                    background: 'var(--surface-container-low)',
                    borderRadius: 'var(--r-md)',
                    fontSize: 13, cursor: 'pointer',
                    border: '1px solid transparent',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(0,49,120,0.04)';
                    e.currentTarget.style.borderColor = 'var(--outline-variant)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--surface-container-low)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--on-surface)' }}>{d.tipoDonacion ?? 'Donación'}</div>
                    <div style={{ color: 'var(--on-surface-variant)', fontSize: 12, marginTop: 2 }}>
                      {d.fechaCreacion ? new Date(d.fechaCreacion).toLocaleDateString('es-CL') : '—'}
                    </div>
                  </div>
                  <StatusBadge status={d.estado} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Necesidades urgentes */}
        <div className="card" style={{ padding: 26 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--on-surface)' }}>
              📋 Necesidades urgentes
            </h3>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12, padding: '5px 12px' }}
              onClick={() => navigate('/donante/necesidades')}
            >
              Ver todas →
            </button>
          </div>

          {loadNec ? (
            <SkeletonCard />
          ) : errNec ? (
            <ErrorBox message={errNec} />
          ) : necs.length === 0 ? (
            <div className="empty-state" style={{ padding: '28px 0' }}>
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-title">Sin necesidades activas</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} className="card-stagger">
              {necs.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '12px 14px',
                    background: URGENCY_BG[n.urgencia] ?? 'var(--surface-container-low)',
                    borderRadius: 'var(--r-md)', fontSize: 13,
                    borderLeft: `3px solid ${URGENCY_COLOR[n.urgencia] ?? 'var(--outline-variant)'}`,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--on-surface)', marginBottom: 4 }}>
                    {n.descripcion ?? 'Necesidad reportada'}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: 'var(--on-surface-variant)', fontSize: 12 }}>{n.organizacion ?? '—'}</span>
                    {n.urgencia && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 99,
                        background: URGENCY_COLOR[n.urgencia] + '20', color: URGENCY_COLOR[n.urgencia],
                      }}>
                        {n.urgencia}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div
        style={{
          marginTop: 24, padding: '28px 32px',
          background: 'linear-gradient(135deg, #001945 0%, #003178 60%, #0d47a1 100%)',
          borderRadius: 'var(--r-xl)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden',
          animation: 'fadeInUp 0.5s ease 0.5s both',
          boxShadow: '0 8px 30px rgba(0,49,120,0.3)',
        }}
      >
        {/* Decorative blob */}
        <div style={{
          position: 'absolute', top: -40, right: 60,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(30,185,128,0.12)', filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 5, letterSpacing: '-0.01em' }}>
            ¿Listo para hacer una diferencia? 🌍
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', lineHeight: 1.5 }}>
            Tu donación llega a quien más la necesita, con trazabilidad completa.
          </div>
        </div>
        <button
          className="btn btn-teal btn-teal-glow ripple-btn"
          style={{ fontWeight: 700, whiteSpace: 'nowrap', position: 'relative', zIndex: 1, borderRadius: 'var(--r-lg)' }}
          onClick={() => navigate('/donante/nueva-donacion')}
        >
          Donar ahora →
        </button>
      </div>
    </div>
  );
}
