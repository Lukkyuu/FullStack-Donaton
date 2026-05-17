import { useState } from 'react';
import { useApi } from '../../../shared/hooks/useApi.js';
import { donacionesService } from '../../../api/services/donacionesService.js';
import { useAuth } from '../../../auth/useAuth.js';
import {
  LoadingSpinner, DegradedBanner, ErrorBox,
  EmptyState, StatusBadge, Modal,
} from '../../../shared/components/index.jsx';

const TIPOS = [
  { value: 'ALIMENTO', label: '🥫 Alimento' },
  { value: 'ROPA',     label: '👕 Ropa' },
  { value: 'MEDICINA', label: '💊 Medicina' },
  { value: 'DINERO',   label: '💵 Dinero' },
  { value: 'OTRO',     label: '📦 Otro' },
];

const ESTADOS = ['PENDIENTE', 'EN_PROCESO', 'ENTREGADA', 'CANCELADA'];

const INITIAL_FORM = {
  tipoDonacion: '',
  descripcion: '',
  cantidad: '',
  unidad: '',
  zona: '',
  necesidadId: '',
};

export default function DonacionesAdmin() {
  const { user } = useAuth();
  const { data, loading, error, degraded, refetch } = useApi(() => donacionesService.listar());

  const [showModal, setShowModal] = useState(false);
  const [updateTarget, setUpdateTarget] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [newEstado, setNewEstado] = useState('');

  const items = data?.content ?? data ?? [];
  const filtered = filterEstado ? items.filter((d) => d.estado === filterEstado) : items;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveErr('');
    try {
      const payload = {
        tipoDonacion: form.tipoDonacion,
        descripcion: form.descripcion,
        cantidad: form.cantidad ? Number(form.cantidad) : undefined,
        unidad: form.unidad || undefined,
        zona: form.zona || undefined,
        necesidadId: form.necesidadId ? Number(form.necesidadId) : undefined,
      };
      await donacionesService.crear(payload);
      setShowModal(false);
      setForm(INITIAL_FORM);
      refetch();
    } catch (err) {
      setSaveErr(err?.response?.data?.message ?? 'Error al registrar la donación.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateEstado = async () => {
    setSaving(true);
    setSaveErr('');
    try {
      await donacionesService.actualizar(updateTarget.id, {
        ...updateTarget,
        estado: newEstado
      });
      setUpdateTarget(null);
      refetch();
    } catch (err) {
      setSaveErr(err?.response?.data?.message ?? 'Error al actualizar el estado.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta donación?')) return;
    try {
      await donacionesService.cancelar(id);
      refetch();
    } catch (err) {
      alert(err?.response?.data?.message ?? 'Error al cancelar la donación.');
    }
  };

  const stateColor = {
    PENDIENTE: '#EF9F27',
    EN_PROCESO: '#378ADD',
    ENTREGADA: '#0F6E56',
    CANCELADA: '#A32D2D',
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Registro de Donaciones</h1>
          <p className="page-subtitle">Historial de aportes recibidos, en tránsito y distribuidos</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setSaveErr(''); setForm(INITIAL_FORM); }}>
          + Registrar Donación
        </button>
      </div>

      <DegradedBanner show={degraded} />
      <ErrorBox message={error} onRetry={refetch} />

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <select className="form-input form-select" style={{ width: 180 }} value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {ESTADOS.map((est) => <option key={est} value={est}>{est}</option>)}
        </select>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', alignSelf: 'center' }}>
          {filtered.length} registro{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="card">
        {loading ? <LoadingSpinner text="Cargando donaciones..." /> :
         filtered.length === 0 ? (
           <EmptyState icon="💝" title="Sin donaciones" description="No se encontraron donaciones registradas." />
         ) : (
           <div className="table-wrap">
             <table>
               <thead>
                 <tr>
                   <th>ID</th>
                   <th>Tipo</th>
                   <th>Descripción</th>
                   <th>Donante</th>
                   <th>Cantidad</th>
                   <th>Ubicación / Zona</th>
                   <th>Estado</th>
                   <th>Acciones</th>
                 </tr>
               </thead>
               <tbody>
                 {filtered.map((d) => (
                   <tr key={d.id}>
                     <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>#{d.id}</td>
                     <td><span className="badge badge-green" style={{ fontSize: 11 }}>{d.tipoDonacion ?? '—'}</span></td>
                     <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={d.descripcion}>
                       {d.descripcion ?? '—'}
                     </td>
                     <td style={{ fontSize: 13, fontWeight: 500 }}>{d.donante ?? 'Anónimo'}</td>
                     <td style={{ fontSize: 13 }}>
                       {d.cantidad ?? '—'} {d.unidad ?? ''}
                     </td>
                     <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{d.zona ?? '—'}</td>
                     <td>
                       <span style={{ fontSize: 12, fontWeight: 600, color: stateColor[d.estado] ?? 'inherit' }}>
                         ● {d.estado ?? 'PENDIENTE'}
                       </span>
                     </td>
                     <td>
                       <div style={{ display: 'flex', gap: 6 }}>
                         <button
                           className="btn btn-secondary"
                           style={{ fontSize: 11, padding: '4px 8px' }}
                           onClick={() => {
                             setUpdateTarget(d);
                             setNewEstado(d.estado ?? 'PENDIENTE');
                             setSaveErr('');
                           }}
                         >
                           Estado
                         </button>
                         {d.estado !== 'CANCELADA' && (
                           <button
                             className="btn btn-danger"
                             style={{ fontSize: 11, padding: '4px 8px', background: '#FAECE7', border: '1px solid #F0997B' }}
                             onClick={() => handleCancelar(d.id)}
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

      {/* Modal crear donación */}
      <Modal open={showModal} title="Registrar Donación Manual" onClose={() => setShowModal(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleCreate} disabled={saving}>
              {saving ? 'Registrando…' : 'Registrar Donación'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Tipo de Donación *</label>
          <select name="tipoDonacion" className="form-input form-select" required value={form.tipoDonacion} onChange={handleChange}>
            <option value="">Selecciona un tipo</option>
            {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Descripción *</label>
          <textarea name="descripcion" className="form-input" rows={3} required
            placeholder="Detalla la donación recibida (ej. Alimentos no perecibles, frazadas, etc.)"
            value={form.descripcion} onChange={handleChange} style={{ resize: 'vertical' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Cantidad</label>
            <input name="cantidad" type="number" className="form-input" placeholder="Ej: 20"
              value={form.cantidad} onChange={handleChange} min="1" />
          </div>
          <div className="form-group">
            <label className="form-label">Unidad</label>
            <input name="unidad" className="form-input" placeholder="Ej: cajas, unidades, kg"
              value={form.unidad} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Zona o Dirección de Acopio</label>
          <input name="zona" className="form-input" placeholder="Ej: Santiago Centro, Bodega 4"
            value={form.zona} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">ID de Necesidad Vinculada (Opcional)</label>
          <input name="necesidadId" type="number" className="form-input" placeholder="Ej: 12"
            value={form.necesidadId} onChange={handleChange} />
        </div>

        {saveErr && <ErrorBox message={saveErr} />}
      </Modal>

      {/* Modal actualizar estado */}
      <Modal open={!!updateTarget} title={`Actualizar Estado - Donación #${updateTarget?.id}`} onClose={() => setUpdateTarget(null)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setUpdateTarget(null)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleUpdateEstado} disabled={saving}>
              {saving ? 'Guardando…' : 'Actualizar'}
            </button>
          </>
        }
      >
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>
          Selecciona el nuevo estado para esta donación. Esto afectará la logística y distribución.
        </p>

        <div className="form-group">
          <label className="form-label">Estado de Donación</label>
          <select className="form-input form-select" value={newEstado} onChange={(e) => setNewEstado(e.target.value)}>
            {ESTADOS.map((est) => <option key={est} value={est}>{est}</option>)}
          </select>
        </div>

        {saveErr && <ErrorBox message={saveErr} />}
      </Modal>
    </div>
  );
}
