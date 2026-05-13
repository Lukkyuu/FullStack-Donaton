import { useAuth } from '../../../auth/useAuth.js';
import { useApi } from '../../../shared/hooks/useApi.js';
import { donacionesService }  from '../../../api/services/donacionesService.js';
import { necesidadesService } from '../../../api/services/necesidadesService.js';
import { logisticaService }   from '../../../api/services/logisticaService.js';
import { matchingService }    from '../../../api/services/matchingService.js';
import { useNavigate } from 'react-router-dom';
import {
  LoadingSpinner, DegradedBanner, ErrorBox, StatusBadge,
} from '../../../shared/components/index.jsx';

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${accent ?? 'var(--brand-primary)'}` }}>
      <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ fontSize: 24 }}>{value ?? '—'}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function AdminHome() {
  const { role } = useAuth();
  const navigate = useNavigate();

  const { data: donData,  loading: l1, error: e1, degraded: d1 } = useApi(() => donacionesService.listar({ limit: 5 }));
  const { data: necData,  loading: l2, error: e2, degraded: d2 } = useApi(() => necesidadesService.listar({ limit: 5 }));
  const { data: logData,  loading: l3, error: e3, degraded: d3 } = useApi(() => logisticaService.listarRecursos({ limit: 3 }));
  const { data: matData,  loading: l4, error: e4, degraded: d4 } = useApi(() => matchingService.listarResultados({ limit: 5 }));

  const donaciones  = donData?.content  ?? donData  ?? [];
  const necesidades = necData?.content  ?? necData  ?? [];
  const recursos    = logData?.content  ?? logData  ?? [];
  const matchings   = matData?.content  ?? matData  ?? [];
  const degraded = d1 || d2 || d3 || d4;

  const anyError = e1 || e2 || e3 || e4;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          {role === 'ADMIN' ? '🛡 Panel de Administración' : '🏢 Panel de Organización'}
        </h1>
        <p className="page-subtitle">Visión general de la plataforma Donaton</p>
      </div>

      <DegradedBanner show={degraded} />
      {anyError && <ErrorBox message="Algunos módulos no pudieron cargarse. Mostrando datos disponibles." />}

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        <StatCard icon="💝" label="Donaciones"          value={donaciones.length}  sub="últimas registradas"  accent="var(--brand-primary)" />
        <StatCard icon="📋" label="Necesidades activas" value={necesidades.length} sub="en terreno"            accent="var(--accent-amber)" />
        <StatCard icon="📦" label="Recursos logísticos" value={recursos.length}    sub="en inventario"         accent="var(--accent-blue)" />
        <StatCard icon="🔗" label="Matchings realizados" value={matchings.length}  sub="cruces completados"    accent="#5DCAA5" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Últimas donaciones */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Últimas donaciones</h3>
            <button className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 10px' }}
              onClick={() => navigate('/admin/matching')}>Ver matching</button>
          </div>
          {l1 ? <LoadingSpinner text="Cargando..." /> : donaciones.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '16px 0' }}>Sin datos disponibles.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {donaciones.slice(0, 5).map((d) => (
                <div key={d.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '9px 12px', background: 'var(--bg-page)', borderRadius: 'var(--r-md)', fontSize: 13,
                }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{d.tipoDonacion ?? 'Donación'}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>#{d.id} · {d.donante ?? '—'}</div>
                  </div>
                  <StatusBadge status={d.estado} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Necesidades recientes */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Necesidades recientes</h3>
            <button className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 10px' }}
              onClick={() => navigate('/admin/necesidades')}>Ver todas</button>
          </div>
          {l2 ? <LoadingSpinner text="Cargando..." /> : necesidades.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '16px 0' }}>Sin datos disponibles.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {necesidades.slice(0, 5).map((n) => (
                <div key={n.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '9px 12px', background: 'var(--bg-page)', borderRadius: 'var(--r-md)', fontSize: 13,
                  borderLeft: `3px solid ${n.urgencia === 'ALTA' ? '#A32D2D' : n.urgencia === 'MEDIA' ? '#EF9F27' : '#5DCAA5'}`,
                }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{n.descripcion?.slice(0, 36) ?? '—'}{n.descripcion?.length > 36 ? '…' : ''}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{n.organizacion ?? '—'}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: n.urgencia === 'ALTA' ? '#A32D2D' : 'var(--text-secondary)' }}>
                    {n.urgencia}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Matchings recientes */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Matchings recientes</h3>
            <button className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 10px' }}
              onClick={() => navigate('/admin/matching')}>Ver panel</button>
          </div>
          {l4 ? <LoadingSpinner text="Cargando..." /> : matchings.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '16px 0' }}>Sin matchings aún.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Donación</th><th>Necesidad</th><th>Estrategia</th><th>Score</th></tr></thead>
                <tbody>
                  {matchings.slice(0, 5).map((m) => (
                    <tr key={m.id}>
                      <td>#{m.donacionId}</td>
                      <td>#{m.necesidadId}</td>
                      <td><span className="badge badge-blue" style={{ fontSize: 11 }}>{m.estrategia ?? '—'}</span></td>
                      <td style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>{m.score ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recursos logísticos */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Inventario logístico</h3>
            <button className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 10px' }}
              onClick={() => navigate('/admin/logistica')}>Gestionar</button>
          </div>
          {l3 ? <LoadingSpinner text="Cargando..." /> : recursos.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '16px 0' }}>Sin recursos registrados.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recursos.slice(0, 4).map((r) => (
                <div key={r.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '9px 12px', background: 'var(--bg-page)', borderRadius: 'var(--r-md)', fontSize: 13,
                }}>
                  <span style={{ fontWeight: 500 }}>{r.nombre ?? r.tipo ?? 'Recurso'}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{r.cantidad} {r.unidad ?? ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
