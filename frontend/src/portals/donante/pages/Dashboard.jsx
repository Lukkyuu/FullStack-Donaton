import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/useAuth.js';
import { useApi } from '../../../shared/hooks/useApi.js';
import { donacionesService } from '../../../api/services/donacionesService.js';
import { necesidadesService } from '../../../api/services/necesidadesService.js';
import { LoadingSpinner, DegradedBanner, ErrorBox, StatusBadge } from '../../../shared/components/index.jsx';

export default function DonanteHome() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const { data: donaciones, loading: loadDon, error: errDon, degraded: degDon } =
    useApi(() => donacionesService.listarMias({ limit: 5 }));

  const { data: necesidades, loading: loadNec, error: errNec, degraded: degNec } =
    useApi(() => necesidadesService.publicas({ limit: 4 }));

  const { data: campanas } =
    useApi(() => donacionesService.listarCampanas({ limit: 10 }));

  const items   = donaciones?.content ?? donaciones ?? [];
  const necs    = necesidades?.content ?? necesidades ?? [];
  const camps   = campanas?.content   ?? campanas   ?? [];

  const urgencyColor = { ALTA: '#A32D2D', MEDIA: '#854F0B', BAJA: '#0F6E56' };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Bienvenido, {user?.nombre ?? 'Donante'} 👋</h1>
        <p className="page-subtitle">Resumen de tu actividad en Donaton</p>
      </div>

      <DegradedBanner show={degDon || degNec} />

      {/* Stats rápidas */}
      <div className="stats-grid">
        {[
          { label: 'Mis donaciones', value: items.length, delta: null, icon: '💝' },
          { label: 'Necesidades activas', value: necs.length, delta: null, icon: '📋' },
          { label: 'Campañas en curso', value: camps.filter(c => c.estado === 'ACTIVA' || c.estado === 'ACTIVO').length || (campanas == null ? '—' : 0), delta: null, icon: '📢' },
          { label: 'Impacto estimado', value: items.filter(d => d.estado === 'COMPLETADO' || d.estado === 'ENTREGADO').length, delta: null, icon: '🌱' },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Mis últimas donaciones */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Mis últimas donaciones</h3>
            <button className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 10px' }}
              onClick={() => navigate('/donante/mis-donaciones')}>
              Ver todas
            </button>
          </div>
          {loadDon ? <LoadingSpinner text="Cargando donaciones..." /> :
           errDon  ? <ErrorBox message={errDon} /> :
           items.length === 0 ? (
             <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 14 }}>
               Aún no has realizado donaciones.
               <br />
               <button className="btn btn-primary" style={{ marginTop: 12 }}
                 onClick={() => navigate('/donante/nueva-donacion')}>
                 Hacer mi primera donación
               </button>
             </div>
           ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
               {items.slice(0, 5).map((d) => (
                <div
                  key={d.id}
                  onClick={() => navigate(`/donante/mis-donaciones/${d.id}`)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', background: 'var(--bg-page)',
                    borderRadius: 'var(--r-md)', fontSize: 13,
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#ECEAE3'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-page)'}
                >
                   <div>
                     <div style={{ fontWeight: 500 }}>{d.tipoDonacion ?? 'Donación'}</div>
                     <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>
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
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Necesidades urgentes</h3>
            <button className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 10px' }}
              onClick={() => navigate('/donante/necesidades')}>
              Ver todas
            </button>
          </div>
          {loadNec ? <LoadingSpinner text="Cargando necesidades..." /> :
           errNec  ? <ErrorBox message={errNec} /> :
           necs.length === 0 ? (
             <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: '24px 0' }}>
               No hay necesidades activas en este momento.
             </p>
           ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
               {necs.slice(0, 4).map((n) => (
                 <div key={n.id} style={{
                   padding: '10px 14px', background: 'var(--bg-page)',
                   borderRadius: 'var(--r-md)', fontSize: 13,
                   borderLeft: `3px solid ${urgencyColor[n.urgencia] ?? 'var(--border-mid)'}`,
                 }}>
                   <div style={{ fontWeight: 500 }}>{n.descripcion ?? 'Necesidad reportada'}</div>
                   <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                     <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{n.organizacion ?? '—'}</span>
                     {n.urgencia && (
                       <span style={{ fontSize: 11, color: urgencyColor[n.urgencia], fontWeight: 600 }}>
                         ● {n.urgencia}
                       </span>
                     )}
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        marginTop: 24, padding: '24px 28px',
        background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-dark))',
        borderRadius: 'var(--r-xl)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>
            ¿Listo para hacer una diferencia?
          </div>
          <div style={{ fontSize: 14, opacity: 0.82 }}>
            Tu donación llega a quien más la necesita, con trazabilidad completa.
          </div>
        </div>
        <button
          className="btn"
          style={{ background: '#fff', color: 'var(--brand-dark)', fontWeight: 600, whiteSpace: 'nowrap' }}
          onClick={() => navigate('/donante/nueva-donacion')}
        >
          Donar ahora →
        </button>
      </div>
    </div>
  );
}
