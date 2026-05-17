import { useState } from 'react';
import { useApi } from '../../../shared/hooks/useApi.js';
import { necesidadesService } from '../../../api/services/necesidadesService.js';
import { useNavigate } from 'react-router-dom';
import {
  LoadingSpinner, DegradedBanner, ErrorBox, EmptyState,
} from '../../../shared/components/index.jsx';

const URGENCIA_STYLE = {
  ALTA:  { bg: '#FCEBEB', color: '#A32D2D', border: '#F7C1C1' },
  MEDIA: { bg: '#FAEEDA', color: '#854F0B', border: '#FAC775' },
  BAJA:  { bg: '#EAF3DE', color: '#3B6D11', border: '#C0DD97' },
};

export default function NecesidadesPublicas() {
  const navigate = useNavigate();
  const [filtroUrgencia, setFiltroUrgencia] = useState('');
  const [filtroTipo,     setFiltroTipo]     = useState('');

  const { data, loading, error, degraded, refetch } = useApi(
    () => necesidadesService.publicas()
  );

  const items = data?.content ?? data ?? [];
  const filtered = items.filter((n) => {
    const okUrgencia = filtroUrgencia ? n.urgencia === filtroUrgencia : true;
    const okTipo     = filtroTipo     ? n.tipoNecesidad === filtroTipo : true;
    return okUrgencia && okTipo;
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Necesidades activas</h1>
        <p className="page-subtitle">
          Necesidades reportadas por organizaciones humanitarias. Tu donación hace la diferencia.
        </p>
      </div>

      <DegradedBanner show={degraded} />
      <ErrorBox message={error} onRetry={refetch} />

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <select
          className="form-input form-select"
          style={{ width: 160 }}
          value={filtroUrgencia}
          onChange={(e) => setFiltroUrgencia(e.target.value)}
        >
          <option value="">Todas las urgencias</option>
          <option value="ALTA">Alta</option>
          <option value="MEDIA">Media</option>
          <option value="BAJA">Baja</option>
        </select>
        <select
          className="form-input form-select"
          style={{ width: 180 }}
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          <option value="ALIMENTO">Alimento</option>
          <option value="ROPA">Ropa</option>
          <option value="MEDICINA">Medicina</option>
          <option value="DINERO">Dinero</option>
          <option value="OTRO">Otro</option>
        </select>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', alignSelf: 'center' }}>
          {filtered.length} necesidad{filtered.length !== 1 ? 'es' : ''}
        </span>
      </div>

      {loading ? (
        <LoadingSpinner text="Cargando necesidades..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No hay necesidades con estos filtros"
          description="Intenta cambiar los filtros o revisa más tarde."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map((n) => {
            const style = URGENCIA_STYLE[n.urgencia] ?? URGENCIA_STYLE.BAJA;
            return (
              <div key={n.id} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {n.organizacion ?? 'Organización'}
                  </span>
                  {n.urgencia && (
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '3px 8px',
                      borderRadius: 99, background: style.bg, color: style.color,
                      border: `1px solid ${style.border}`,
                    }}>
                      {n.urgencia}
                    </span>
                  )}
                </div>

                {/* Descripción */}
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)' }}>
                  {n.descripcion ?? 'Sin descripción.'}
                </p>

                {/* Metadata */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {n.tipoNecesidad && (
                    <span className="badge badge-blue">{n.tipoNecesidad}</span>
                  )}
                  {n.zona && (
                    <span className="badge badge-gray">📍 {n.zona}</span>
                  )}
                  {n.cantidadRequerida && (
                    <span className="badge badge-amber">
                      Cantidad: {n.cantidadRequerida}
                    </span>
                  )}
                </div>

                {/* Acción */}
                <button
                  className="btn btn-primary"
                  style={{ marginTop: 'auto', justifyContent: 'center', width: '100%' }}
                  onClick={() => navigate('/donante/nueva-donacion', { state: { necesidad: n } })}
                >
                  Donar para esta necesidad
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
