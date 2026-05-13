import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../../shared/hooks/useApi.js';
import { donacionesService } from '../../../api/services/donacionesService.js';
import { LoadingSpinner, ErrorBox, StatusBadge } from '../../../shared/components/index.jsx';

const TIPO_LABELS = {
  ALIMENTO: '🥫 Alimento',
  ROPA:     '👕 Ropa',
  MEDICINA: '💊 Medicina',
  DINERO:   '💵 Dinero',
  OTRO:     '📦 Otro',
};

function InfoRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '12px 0', borderBottom: '1px solid var(--border)', gap: 16,
    }}>
      <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 14, color: 'var(--text-primary)', textAlign: 'right' }}>{value ?? '—'}</span>
    </div>
  );
}

export default function DetalleDonacion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: donacion, loading, error } = useApi(
    () => donacionesService.obtener(id),
    [id]
  );

  const d = donacion;

  const TIMELINE = [
    { estado: 'PENDIENTE',   label: 'Registrada',   icon: '📝', done: true },
    { estado: 'ACTIVO',      label: 'En proceso',   icon: '⚙️', done: ['ACTIVO','COMPLETADO','ENTREGADO'].includes(d?.estado) },
    { estado: 'EN_TRANSITO', label: 'En tránsito',  icon: '🚚', done: ['EN_TRANSITO','COMPLETADO','ENTREGADO'].includes(d?.estado) },
    { estado: 'ENTREGADO',   label: 'Entregada',    icon: '✅', done: ['ENTREGADO','COMPLETADO'].includes(d?.estado) },
  ];

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
          <h1 className="page-title">Detalle de donación</h1>
          {d && <p className="page-subtitle">ID #{d.id}</p>}
        </div>
      </div>

      <ErrorBox message={error} />

      {loading ? (
        <LoadingSpinner text="Cargando donación..." />
      ) : !d ? null : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

          {/* Left: main info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Estado + tipo */}
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>
                  {TIPO_LABELS[d.tipoDonacion] ?? d.tipoDonacion ?? 'Donación'}
                </h2>
                <StatusBadge status={d.estado} />
              </div>
              <InfoRow label="ID" value={`#${d.id}`} />
              <InfoRow label="Tipo" value={TIPO_LABELS[d.tipoDonacion] ?? d.tipoDonacion} />
              <InfoRow label="Descripción" value={d.descripcion} />
              <InfoRow label="Cantidad" value={d.cantidad} />
              <InfoRow label="Estado" value={d.estado} />
              <InfoRow label="Fecha de registro" value={d.fechaCreacion ? new Date(d.fechaCreacion).toLocaleString('es-CL') : null} />
              {d.necesidadId && <InfoRow label="Necesidad asignada" value={`#${d.necesidadId}`} />}
              {d.organizacionId && <InfoRow label="Organización destino" value={`#${d.organizacionId}`} />}
              {d.observaciones && <InfoRow label="Observaciones" value={d.observaciones} />}
            </div>

            {/* Matching info si existe */}
            {d.matching && (
              <div className="card" style={{ padding: 28 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>🔗 Información de matching</h3>
                <InfoRow label="ID Matching" value={`#${d.matching.id}`} />
                <InfoRow label="Estrategia" value={d.matching.estrategia} />
                <InfoRow label="Score" value={d.matching.score != null ? `${(d.matching.score * 100).toFixed(0)}%` : null} />
                <InfoRow label="Fecha matching" value={d.matching.fechaMatching ? new Date(d.matching.fechaMatching).toLocaleString('es-CL') : null} />
              </div>
            )}
          </div>

          {/* Right: timeline */}
          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 24 }}>🗺 Trazabilidad</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {TIMELINE.map(({ estado, label, icon, done }, i) => (
                <div key={estado} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  {/* Dot + line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: done ? 'var(--brand-primary)' : 'var(--bg-page)',
                      border: `2px solid ${done ? 'var(--brand-primary)' : 'var(--border-mid)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, transition: 'all 0.3s',
                      color: done ? '#fff' : 'var(--text-muted)',
                    }}>
                      {done ? '✓' : icon}
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div style={{
                        width: 2, height: 32, marginTop: 4,
                        background: done ? 'var(--brand-primary)' : 'var(--border)',
                        transition: 'background 0.3s',
                      }} />
                    )}
                  </div>
                  {/* Label */}
                  <div style={{ paddingTop: 6, paddingBottom: i < TIMELINE.length - 1 ? 32 : 0 }}>
                    <div style={{
                      fontWeight: done ? 600 : 400,
                      color: done ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontSize: 14,
                    }}>
                      {label}
                    </div>
                    {done && d.estado === estado && (
                      <div style={{ fontSize: 12, color: 'var(--brand-primary)', marginTop: 2 }}>
                        Estado actual
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
