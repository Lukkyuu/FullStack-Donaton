import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../../shared/hooks/useApi.js';
import { donacionesService } from '../../../api/services/donacionesService.js';
import {
  LoadingSpinner, DegradedBanner, ErrorBox,
  EmptyState, StatusBadge, Modal,
} from '../../../shared/components/index.jsx';

const TIPO_LABELS = {
  ALIMENTO: '🥫 Alimento',
  ROPA:     '👕 Ropa',
  MEDICINA: '💊 Medicina',
  DINERO:   '💵 Dinero',
  OTRO:     '📦 Otro',
};

export default function MisDonaciones() {
  const navigate = useNavigate();
  const { data, loading, error, degraded, refetch } = useApi(
    () => donacionesService.listar()
  );
  const [cancelTarget, setCancelTarget] = useState(null);
  const [canceling, setCanceling]       = useState(false);
  const [cancelError, setCancelError]   = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const items = data?.content ?? data ?? [];
  const filtered = filterEstado
    ? items.filter((d) => d.estado === filterEstado)
    : items;

  const handleCancel = async () => {
    setCanceling(true);
    setCancelError('');
    try {
      await donacionesService.cancelar(cancelTarget.id);
      setCancelTarget(null);
      refetch();
    } catch (err) {
      setCancelError(err?.response?.data?.message ?? 'No se pudo cancelar la donación.');
    } finally {
      setCanceling(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Mis donaciones</h1>
        <p className="page-subtitle">Historial completo de tus donaciones</p>
      </div>

      <DegradedBanner show={degraded} />
      <ErrorBox message={error} onRetry={refetch} />

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
        <select
          className="form-input form-select"
          style={{ width: 180 }}
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="ACTIVO">Activo</option>
          <option value="COMPLETADO">Completado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="card">
        {loading ? (
          <LoadingSpinner text="Cargando donaciones..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="💝"
            title="Sin donaciones"
            description="Aún no has registrado donaciones con estos filtros."
          />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                      #{d.id}
                    </td>
                    <td>{TIPO_LABELS[d.tipoDonacion] ?? d.tipoDonacion ?? '—'}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {d.descripcion ?? '—'}
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {d.fechaCreacion ? new Date(d.fechaCreacion).toLocaleDateString('es-CL') : '—'}
                    </td>
                    <td><StatusBadge status={d.estado} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ fontSize: 12, padding: '4px 10px' }}
                          onClick={() => navigate(`/donante/mis-donaciones/${d.id}`)}
                        >
                          Ver detalle
                        </button>
                        {d.estado === 'PENDIENTE' && (
                          <button
                            className="btn btn-danger"
                            style={{ fontSize: 12, padding: '4px 10px' }}
                            onClick={() => setCancelTarget(d)}
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal confirmar cancelación */}
      <Modal
        open={!!cancelTarget}
        title="Cancelar donación"
        onClose={() => { setCancelTarget(null); setCancelError(''); }}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setCancelTarget(null)}>
              Volver
            </button>
            <button className="btn btn-danger" onClick={handleCancel} disabled={canceling}>
              {canceling ? 'Cancelando…' : 'Confirmar cancelación'}
            </button>
          </>
        }
      >
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          ¿Estás seguro que deseas cancelar la donación{' '}
          <strong>#{cancelTarget?.id}</strong>?
          Esta acción no se puede deshacer.
        </p>
        {cancelError && <ErrorBox message={cancelError} />}
      </Modal>
    </div>
  );
}
