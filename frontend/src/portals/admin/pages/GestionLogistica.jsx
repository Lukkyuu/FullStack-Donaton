import { useState } from 'react';
import { useApi } from '../../../shared/hooks/useApi.js';
import { logisticaService } from '../../../api/services/logisticaService.js';
import {
  LoadingSpinner, DegradedBanner, ErrorBox,
  EmptyState, StatusBadge, Modal,
} from '../../../shared/components/index.jsx';

const INIT_RECURSO = { nombre: '', tipo: '', cantidad: '', unidad: '', zona: '' };
const INIT_DIST    = { recursoId: '', necesidadId: '', cantidad: '', destinatario: '', zona: '' };

export default function GestionLogistica() {
  const [tab, setTab] = useState('recursos');

  const {
    data: recData, loading: loadRec, error: errRec, degraded: degRec, refetch: refetchRec,
  } = useApi(() => logisticaService.listarRecursos());

  const {
    data: distData, loading: loadDist, error: errDist, degraded: degDist, refetch: refetchDist,
  } = useApi(() => logisticaService.listarDistribuciones());

  const recursos      = recData?.content  ?? recData  ?? [];
  const distribuciones= distData?.content ?? distData ?? [];

  // Modal Recurso
  const [showRec, setShowRec]   = useState(false);
  const [formRec, setFormRec]   = useState(INIT_RECURSO);
  const [savingRec, setSavingRec] = useState(false);
  const [errFormRec, setErrFormRec] = useState('');

  // Modal Distribución
  const [showDist, setShowDist]   = useState(false);
  const [formDist, setFormDist]   = useState(INIT_DIST);
  const [savingDist, setSavingDist] = useState(false);
  const [errFormDist, setErrFormDist] = useState('');

  const handleRecurso = async (e) => {
    e.preventDefault();
    setSavingRec(true); setErrFormRec('');
    try {
      await logisticaService.crearRecurso({ ...formRec, cantidad: Number(formRec.cantidad) });
      setShowRec(false); setFormRec(INIT_RECURSO); refetchRec();
    } catch (err) {
      setErrFormRec(err?.response?.data?.message ?? 'Error al crear recurso.');
    } finally { setSavingRec(false); }
  };

  const handleDist = async (e) => {
    e.preventDefault();
    setSavingDist(true); setErrFormDist('');
    try {
      await logisticaService.crearDistribucion({
        ...formDist,
        recursoId:   Number(formDist.recursoId),
        necesidadId: formDist.necesidadId ? Number(formDist.necesidadId) : undefined,
        cantidad:    Number(formDist.cantidad),
      });
      setShowDist(false); setFormDist(INIT_DIST); refetchDist();
    } catch (err) {
      setErrFormDist(err?.response?.data?.message ?? 'Error al registrar distribución.');
    } finally { setSavingDist(false); }
  };

  const tabStyle = (t) => ({
    padding: '8px 18px', cursor: 'pointer', fontSize: 14,
    fontWeight: tab === t ? 500 : 400,
    color: tab === t ? 'var(--brand-primary)' : 'var(--text-secondary)',
    background: 'none', border: 'none',
    borderBottom: tab === t ? '2px solid var(--brand-primary)' : '2px solid transparent',
    transition: 'all 0.15s',
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Gestión de logística</h1>
          <p className="page-subtitle">Inventario de recursos y registro de distribuciones</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => { setShowDist(true); setErrFormDist(''); }}>
            + Distribución
          </button>
          <button className="btn btn-primary" onClick={() => { setShowRec(true); setErrFormRec(''); }}>
            + Recurso
          </button>
        </div>
      </div>

      <DegradedBanner show={degRec || degDist} />

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
        <button style={tabStyle('recursos')}   onClick={() => setTab('recursos')}>
          📦 Recursos ({recursos.length})
        </button>
        <button style={tabStyle('distribuciones')} onClick={() => setTab('distribuciones')}>
          🚚 Distribuciones ({distribuciones.length})
        </button>
      </div>

      {/* Recursos */}
      {tab === 'recursos' && (
        <div className="card">
          <ErrorBox message={errRec} onRetry={refetchRec} />
          {loadRec ? <LoadingSpinner text="Cargando recursos..." /> :
           recursos.length === 0 ? (
             <EmptyState icon="📦" title="Sin recursos" description="Registra el primer recurso disponible." />
           ) : (
             <div className="table-wrap">
               <table>
                 <thead>
                   <tr>
                     <th>ID</th><th>Nombre</th><th>Tipo</th>
                     <th>Cantidad</th><th>Unidad</th><th>Zona</th>
                   </tr>
                 </thead>
                 <tbody>
                   {recursos.map((r) => (
                     <tr key={r.id}>
                       <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>#{r.id}</td>
                       <td style={{ fontWeight: 500 }}>{r.nombre ?? '—'}</td>
                       <td><span className="badge badge-blue" style={{ fontSize: 11 }}>{r.tipo ?? '—'}</span></td>
                       <td style={{ fontWeight: 600, color: Number(r.cantidad) === 0 ? '#A32D2D' : 'inherit' }}>
                         {r.cantidad ?? '—'}
                       </td>
                       <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.unidad ?? '—'}</td>
                       <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.zona ?? '—'}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
        </div>
      )}

      {/* Distribuciones */}
      {tab === 'distribuciones' && (
        <div className="card">
          <ErrorBox message={errDist} onRetry={refetchDist} />
          {loadDist ? <LoadingSpinner text="Cargando distribuciones..." /> :
           distribuciones.length === 0 ? (
             <EmptyState icon="🚚" title="Sin distribuciones" description="Registra la primera distribución." />
           ) : (
             <div className="table-wrap">
               <table>
                 <thead>
                   <tr>
                     <th>ID</th><th>Recurso</th><th>Necesidad</th>
                     <th>Cantidad</th><th>Destinatario</th><th>Zona</th><th>Estado</th>
                   </tr>
                 </thead>
                 <tbody>
                   {distribuciones.map((d) => (
                     <tr key={d.id}>
                       <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>#{d.id}</td>
                       <td>#{d.recursoId}</td>
                       <td>{d.necesidadId ? `#${d.necesidadId}` : '—'}</td>
                       <td>{d.cantidad} {d.unidad ?? ''}</td>
                       <td style={{ fontSize: 13 }}>{d.destinatario ?? '—'}</td>
                       <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{d.zona ?? '—'}</td>
                       <td><StatusBadge status={d.estado ?? 'EN_TRANSITO'} /></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
        </div>
      )}

      {/* Modal Recurso */}
      <Modal open={showRec} title="Nuevo recurso" onClose={() => setShowRec(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowRec(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleRecurso} disabled={savingRec}>
              {savingRec ? 'Creando…' : 'Crear recurso'}
            </button>
          </>
        }
      >
        {[
          { name: 'nombre', label: 'Nombre *', placeholder: 'Ej: Frazadas térmicas', type: 'text' },
          { name: 'tipo',   label: 'Tipo *',   placeholder: 'Ej: ROPA, ALIMENTO',   type: 'text' },
        ].map((f) => (
          <div className="form-group" key={f.name}>
            <label className="form-label">{f.label}</label>
            <input name={f.name} type={f.type} className="form-input" placeholder={f.placeholder}
              value={formRec[f.name]} onChange={(e) => setFormRec({ ...formRec, [e.target.name]: e.target.value })} />
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Cantidad *</label>
            <input name="cantidad" type="number" min="0" className="form-input" placeholder="Ej: 100"
              value={formRec.cantidad} onChange={(e) => setFormRec({ ...formRec, cantidad: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Unidad</label>
            <input name="unidad" className="form-input" placeholder="Ej: kg, unidades"
              value={formRec.unidad} onChange={(e) => setFormRec({ ...formRec, unidad: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Zona</label>
          <input name="zona" className="form-input" placeholder="Ej: Centro de acopio Concepción"
            value={formRec.zona} onChange={(e) => setFormRec({ ...formRec, zona: e.target.value })} />
        </div>
        {errFormRec && <ErrorBox message={errFormRec} />}
      </Modal>

      {/* Modal Distribución */}
      <Modal open={showDist} title="Nueva distribución" onClose={() => setShowDist(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowDist(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleDist} disabled={savingDist}>
              {savingDist ? 'Registrando…' : 'Registrar distribución'}
            </button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">ID Recurso *</label>
            <input name="recursoId" type="number" className="form-input" placeholder="Ej: 3"
              value={formDist.recursoId} onChange={(e) => setFormDist({ ...formDist, recursoId: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">ID Necesidad</label>
            <input name="necesidadId" type="number" className="form-input" placeholder="Ej: 12"
              value={formDist.necesidadId} onChange={(e) => setFormDist({ ...formDist, necesidadId: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Cantidad *</label>
            <input name="cantidad" type="number" min="1" className="form-input" placeholder="Ej: 20"
              value={formDist.cantidad} onChange={(e) => setFormDist({ ...formDist, cantidad: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Zona destino</label>
            <input name="zona" className="form-input" placeholder="Ej: Biobío"
              value={formDist.zona} onChange={(e) => setFormDist({ ...formDist, zona: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Destinatario</label>
          <input name="destinatario" className="form-input" placeholder="Nombre organización o persona"
            value={formDist.destinatario} onChange={(e) => setFormDist({ ...formDist, destinatario: e.target.value })} />
        </div>
        {errFormDist && <ErrorBox message={errFormDist} />}
      </Modal>
    </div>
  );
}
