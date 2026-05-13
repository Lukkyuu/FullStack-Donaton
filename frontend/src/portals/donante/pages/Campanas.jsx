import { useApi } from '../../../shared/hooks/useApi.js';
import { useNavigate } from 'react-router-dom';
import { donacionesService } from '../../../api/services/donacionesService.js';
import { LoadingSpinner, ErrorBox, EmptyState, StatusBadge } from '../../../shared/components/index.jsx';

export default function Campanas() {
  const navigate = useNavigate();
  const { data, loading, error, degraded, refetch } = useApi(
    () => donacionesService.listarCampanas()
  );

  const items = data?.content ?? data ?? [];

  const now = Date.now();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Campañas de donación 📢</h1>
        <p className="page-subtitle">Campañas activas donde puedes contribuir directamente.</p>
      </div>

      <ErrorBox message={error} onRetry={refetch} />

      {degraded && (
        <div className="degraded-banner" style={{ marginBottom: 20 }}>
          ⚠ Mostrando datos en caché — el sistema se está recuperando.
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Cargando campañas..." />
      ) : items.length === 0 ? (
        <EmptyState
          icon="📢"
          title="Sin campañas activas"
          description="En este momento no hay campañas de donación abiertas. Vuelve pronto."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {items.map((c) => {
            const meta    = c.fechaFin ? new Date(c.fechaFin) : null;
            const elapsed = meta ? Math.max(0, meta - now) : null;
            const days    = elapsed != null ? Math.ceil(elapsed / 86400000) : null;
            const pct     = c.meta && c.recaudado != null
              ? Math.min(100, Math.round((c.recaudado / c.meta) * 100))
              : null;

            return (
              <div key={c.id} className="card" style={{ overflow: 'hidden' }}>
                {/* Header color strip */}
                <div style={{
                  height: 6,
                  background: `linear-gradient(90deg, var(--brand-primary) ${pct ?? 50}%, var(--border) ${pct ?? 50}%)`,
                }} />

                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <StatusBadge status={c.estado ?? 'ACTIVA'} />
                    {days != null && (
                      <span style={{ fontSize: 12, color: days < 7 ? '#A32D2D' : 'var(--text-muted)' }}>
                        {days > 0 ? `${days}d restantes` : 'Finalizada'}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, lineHeight: 1.4 }}>
                    {c.titulo ?? c.nombre ?? `Campaña #${c.id}`}
                  </h3>

                  {c.descripcion && (
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
                      {c.descripcion.length > 120 ? c.descripcion.slice(0, 120) + '…' : c.descripcion}
                    </p>
                  )}

                  {/* Progress */}
                  {pct != null && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                        <span>{c.recaudado ?? 0} donaciones</span>
                        <span>Meta: {c.meta}</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 99, background: 'var(--bg-page)', overflow: 'hidden' }}>
                        <div style={{
                          width: `${pct}%`, height: '100%', borderRadius: 99,
                          background: pct >= 80 ? 'var(--brand-primary)' : pct >= 50 ? 'var(--accent-amber)' : 'var(--accent-coral)',
                          transition: 'width 0.5s ease',
                        }} />
                      </div>
                      <div style={{ textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--brand-primary)', marginTop: 4 }}>
                        {pct}% completado
                      </div>
                    </div>
                  )}

                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: 14 }}
                    onClick={() => navigate('/donante/nueva-donacion', { state: { campanaId: c.id } })}
                  >
                    Contribuir a esta campaña
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
