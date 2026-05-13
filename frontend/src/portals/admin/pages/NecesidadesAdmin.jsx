import { useState } from 'react';
import { useApi } from '../../../shared/hooks/useApi.js';
import { necesidadesService } from '../../../api/services/necesidadesService.js';
import {
  LoadingSpinner, DegradedBanner, ErrorBox,
  EmptyState, StatusBadge, Modal,
} from '../../../shared/components/index.jsx';

const URGENCIAS = ['ALTA', 'MEDIA', 'BAJA'];
const TIPOS     = ['ALIMENTO', 'ROPA', 'MEDICINA', 'DINERO', 'OTRO'];

const INIT_FORM = {
  descripcion: '', tipoNecesidad: '', urgencia: '',
  cantidadRequerida: '', unidad: '', zona: '', organizacion: '',
};

export default function NecesidadesAdmin() {
  const { data, loading, error, degraded, refetch } = useApi(() => necesidadesService.listar());

  const [showModal, setShowModal] = useState(false);
  const [closeTarget, setCloseTarget] = useState(null);
  const [form,    setForm]    = useState(INIT_FORM);
  const [saving,  setSaving]  = useState(false);
  const [saveErr, setSaveErr] = useState('');
  const [filterUrgencia, setFilterUrgencia] = useState('');

  const items    = data?.content ?? data ?? [];
  const filtered = filterUrgencia ? items.filter((n) => n.urgencia === filterUrgencia) : items;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true); setSaveErr('');
    try {
      await necesidadesService.crear({
        ...form,
        cantidadRequerida: form.cantidadRequerida ? Number(form.cantidadRequerida) : undefined,
      });
      setShowModal(false);
      setForm(INIT_FORM);
      refetch();
    } catch (err) {
      setSaveErr(err?.response?.data?.message ?? 'Error al crear la necesidad.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = async () => {
    setSaving(true); setSaveErr('');
    try {
      await necesidadesService.cerrar(closeTarget.id);
      setCloseTarget(null);
      refetch();
    } catch (err) {
      setSaveErr(err?.response?.data?.message ?? 'Error al cerrar la necesidad.');
    } finally {
      setSaving(false);
    }
  };

  const urgColor = { ALTA: '#A32D2D', MEDIA: '#854F0B', BAJA: '#0F6E56' };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Gestión de necesidades</h1>
          <p className="page-subtitle">Necesidades humanitarias reportadas por organizaciones</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setSaveErr(''); }}>
          + Nueva necesidad
        </button>
      </div>

      <DegradedBanner show={degraded} />
      <ErrorBox message={error} onRetry={refetch} />

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <select className="form-input form-select" style={{ width: 160 }} value={filterUrgencia}
          onChange={(e) => setFilterUrgencia(e.target.value)}>
          <option value="">Todas las urgencias</option>
          {URGENCIAS.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', alignSelf: 'center' }}>
          {filtered.length} registro{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="card">
        {loading ? <LoadingSpinner text="Cargando necesidades..." /> :
         filtered.length === 0 ? (
           <EmptyState icon="📋" title="Sin necesidades" description="No hay necesidades con estos filtros." />
         ) : (
           <div className="table-wrap">
             <table>
               <thead>
                 <tr>
                   <th>ID</th>
                   <th>Descripción</th>
                   <th>Tipo</th>
                   <th>Urgencia</th>
                   <th>Organización</th>
                   <th>Zona</th>
                   <th>Estado</th>
                   <th>Acciones</th>
                 </tr>
               </thead>
               <tbody>
                 {filtered.map((n) => (
                   <tr key={n.id}>
                     <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>#{n.id}</td>
                     <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                       {n.descripcion ?? '—'}
                     </td>
                     <td><span className="badge badge-blue" style={{ fontSize: 11 }}>{n.tipoNecesidad ?? '—'}</span></td>
                     <td>
                       <span style={{ fontSize: 12, fontWeight: 600, color: urgColor[n.urgencia] ?? 'inherit' }}>
                         ● {n.urgencia ?? '—'}
                       </span>
                     </td>
                     <td style={{ fontSize: 13 }}>{n.organizacion ?? '—'}</td>
                     <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{n.zona ?? '—'}</td>
                     <td><StatusBadge status={n.estado ?? 'ACTIVA'} /></td>
                     <td>
                       {n.estado !== 'CERRADA' && (
                         <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }}
                           onClick={() => { setCloseTarget(n); setSaveErr(''); }}>
                           Cerrar
                         </button>
                       )}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         )}
      </div>

      {/* Modal crear */}
      <Modal open={showModal} title="Nueva necesidad" onClose={() => setShowModal(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleCreate} disabled={saving}>
              {saving ? 'Creando…' : 'Crear necesidad'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Descripción *</label>
          <textarea name="descripcion" className="form-input" rows={3} required
            placeholder="Describe la necesidad…"
            value={form.descripcion} onChange={handleChange} style={{ resize: 'vertical' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Tipo *</label>
            <select name="tipoNecesidad" className="form-input form-select" required value={form.tipoNecesidad} onChange={handleChange}>
              <option value="">Seleccionar</option>
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Urgencia *</label>
            <select name="urgencia" className="form-input form-select" required value={form.urgencia} onChange={handleChange}>
              <option value="">Seleccionar</option>
              {URGENCIAS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Cantidad requerida</label>
            <input name="cantidadRequerida" type="number" className="form-input" placeholder="Ej: 50"
              value={form.cantidadRequerida} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Unidad</label>
            <input name="unidad" className="form-input" placeholder="Ej: kg, cajas"
              value={form.unidad} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Organización</label>
          <input name="organizacion" className="form-input" placeholder="Nombre de la org."
            value={form.organizacion} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Zona</label>
          <input name="zona" className="form-input" placeholder="Ej: Biobío, Concepción"
            value={form.zona} onChange={handleChange} />
        </div>
        {saveErr && <ErrorBox message={saveErr} />}
      </Modal>

      {/* Modal cerrar necesidad */}
      <Modal open={!!closeTarget} title="Cerrar necesidad" onClose={() => setCloseTarget(null)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setCloseTarget(null)}>Cancelar</button>
            <button className="btn btn-danger" onClick={handleClose} disabled={saving}>
              {saving ? 'Cerrando…' : 'Confirmar cierre'}
            </button>
          </>
        }
      >
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          ¿Cerrar la necesidad <strong>#{closeTarget?.id}</strong>?<br />
          Se marcará como atendida y dejará de recibir nuevos matchings.
        </p>
        {saveErr && <ErrorBox message={saveErr} />}
      </Modal>
    </div>
  );
}
