import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../../shared/hooks/useApi.js';
import { matchingService } from '../../../api/services/matchingService.js';
import { LoadingSpinner, ErrorBox, StatusBadge } from '../../../shared/components/index.jsx';

const ESTRATEGIA_INFO = {
  CercaniaStrategy:       { label: 'Cercanía',          color: '#185FA5', bg: '#E6F1FB', icon: '📍' },
  UrgenciaStrategy:       { label: 'Urgencia',           color: '#A32D2D', bg: '#FCEBEB', icon: '🚨' },
  TipoNecesidadStrategy:  { label: 'Tipo de necesidad',  color: '#0F6E56', bg: '#E1F5EE', icon: '🏷' },
};

function ScoreBar({ score }) {
  const pct = Math.min(100, Math.max(0, (score ?? 0) * 100));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
      <div style={{ flex: 1, height: 8, borderRadius: 99, background: 'var(--bg-page)', overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: 99,
          background: pct > 70 ? 'var(--brand-primary)' : pct > 40 ? 'var(--accent-amber)' : '#D85A30',
          transition: 'width 0.5s ease',
        }} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', minWidth: 42 }}>
        {score != null ? (score * 100).toFixed(0) + '%' : '—'}
      </span>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '11px 0', borderBottom: '1px solid var(--border)', gap: 16,
    }}>
      <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 14, color: 'var(--text-primary)', textAlign: 'right' }}>{value ?? '—'}</span>
    </div>
  );
}

export default function DetalleMatching() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: matching, loading, error } = useApi(
    () => matchingService.obtenerResultado(id),
    [id]
  );

  const m = matching;
  const info = m ? ESTRATEGIA_INFO[m.estrategia] : null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          className="btn btn-secondary"
          style={{ padding: '7px 14px', fontSize: 13 }}
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>
        <div>
          <h1 className="page-title">Detalle de matching</h1>
          {m && <p className="page-subtitle">ID #{m.id}</p>}
        </div>
      </div>

      <ErrorBox message={error} />

      {loading ? (
        <LoadingSpinner text="Cargando matching..." />
      ) : !m ? null : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>

          {/* Main */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                {info && (
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, fontSize: 24,
                    background: info.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {info.icon}
                  </div>
                )}
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 700 }}>
                    {info?.label ?? m.estrategia ?? 'Matching automático'}
                  </h2>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {m.fechaMatching ? new Date(m.fechaMatching).toLocaleString('es-CL') : '—'}
                  </div>
                </div>
              </div>

              <InfoRow label="ID" value={`#${m.id}`} />
              <InfoRow label="Donación" value={`#${m.donacionId}`} />
              <InfoRow label="Necesidad" value={`#${m.necesidadId}`} />
              <InfoRow label="Estrategia" value={info?.label ?? m.estrategia} />
              <InfoRow label="Fecha" value={m.fechaMatching ? new Date(m.fechaMatching).toLocaleString('es-CL') : null} />
              {m.estado && <InfoRow label="Estado" value={<StatusBadge status={m.estado} />} />}
              {m.observaciones && <InfoRow label="Observaciones" value={m.observaciones} />}
            </div>

            {/* Arquitectura note */}
            <div style={{
              padding: '16px 20px',
              background: 'var(--brand-light)', border: '1px solid #B2E5D4',
              borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--brand-dark)', lineHeight: 1.6,
            }}>
              <strong>¿Cómo se generó este matching?</strong><br />
              El motor ms-matching suscribió un evento del Service Bus y ejecutó la estrategia <strong>{info?.label ?? m.estrategia}</strong> mediante el patrón <em>Strategy + Factory Method</em>, generando este resultado con trazabilidad completa en <code>db_donaton_matching</code>.
            </div>
          </div>

          {/* Score card */}
          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Score de compatibilidad</h3>
            <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--brand-primary)', marginBottom: 4 }}>
              {m.score != null ? (m.score * 100).toFixed(0) + '%' : '—'}
            </div>
            <ScoreBar score={m.score} />
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 14, lineHeight: 1.6 }}>
              Nivel de compatibilidad entre la donación y la necesidad según la estrategia <strong>{info?.label ?? m.estrategia}</strong>.
            </p>

            {info && (
              <div style={{
                marginTop: 20, padding: '14px 16px',
                background: info.bg, borderRadius: 'var(--r-md)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 22 }}>{info.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: info.color }}>{info.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Estrategia aplicada</div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
