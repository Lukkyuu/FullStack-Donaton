import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/useAuth.js';
import { useApi } from '../../../shared/hooks/useApi.js';
import { necesidadesService } from '../../../api/services/necesidadesService.js';
import { donacionesService } from '../../../api/services/donacionesService.js';
import { LoadingSpinner, ErrorBox, StatusBadge } from '../../../shared/components/index.jsx';

export default function DashboardOrganizacion() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: necesidades, loading: loadNec, error: errNec } = useApi(
    () => necesidadesService.listarMias({ limit: 5 })
  );
  const { data: donaciones, loading: loadDon, error: errDon } = useApi(
    () => donacionesService.listar({ limit: 5 })
  );

  const necs = necesidades?.content ?? necesidades ?? [];
  const dons = donaciones?.content  ?? donaciones  ?? [];

  const urgencyColor = { ALTA: '#A32D2D', MEDIA: '#854F0B', BAJA: '#0F6E56' };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Bienvenida, {user?.nombre ?? 'Organización'} 🏢</h1>
        <p className="page-subtitle">Gestiona las necesidades y el seguimiento de donaciones de tu organización.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { label: 'Necesidades activas', value: necs.filter(n => n.estado === 'ACTIVA' || n.estado === 'ACTIVO').length, icon: '📋' },
          { label: 'Donaciones recibidas', value: dons.length, icon: '💝' },
          { label: 'Pendientes de matching', value: dons.filter(d => d.estado === 'PENDIENTE').length, icon: '🔗' },
          { label: 'Entregadas', value: dons.filter(d => ['COMPLETADO','ENTREGADO'].includes(d.estado)).length, icon: '✅' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Necesidades */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Mis necesidades</h3>
            <button className="btn btn-primary" style={{ fontSize: 12, padding: '5px 12px' }}
              onClick={() => navigate('/organizacion/necesidades')}>
              + Nueva
            </button>
          </div>
          {loadNec ? <LoadingSpinner text="Cargando..." /> :
           errNec  ? <ErrorBox message={errNec} /> :
           necs.length === 0 ? (
             <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>
               Aún no has publicado necesidades.
             </p>
           ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
               {necs.slice(0, 5).map(n => (
                 <div key={n.id} style={{
                   padding: '10px 14px', background: 'var(--bg-page)',
                   borderRadius: 'var(--r-md)', fontSize: 13,
                   borderLeft: `3px solid ${urgencyColor[n.urgencia] ?? 'var(--border-mid)'}`,
                   display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                 }}>
                   <div>
                     <div style={{ fontWeight: 500 }}>{n.descripcion ?? 'Necesidad'}</div>
                     {n.urgencia && (
                       <span style={{ fontSize: 11, color: urgencyColor[n.urgencia], fontWeight: 600 }}>
                         ● {n.urgencia}
                       </span>
                     )}
                   </div>
                   <StatusBadge status={n.estado} />
                 </div>
               ))}
             </div>
           )}
        </div>

        {/* Donaciones recibidas */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Donaciones recibidas</h3>
          </div>
          {loadDon ? <LoadingSpinner text="Cargando..." /> :
           errDon  ? <ErrorBox message={errDon} /> :
           dons.length === 0 ? (
             <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>
               Aún no hay donaciones asignadas.
             </p>
           ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
               {dons.slice(0, 5).map(d => (
                 <div key={d.id} style={{
                   display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                   padding: '10px 14px', background: 'var(--bg-page)',
                   borderRadius: 'var(--r-md)', fontSize: 13,
                 }}>
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
      </div>
    </div>
  );
}
