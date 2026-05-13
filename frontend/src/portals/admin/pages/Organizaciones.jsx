import { useState } from 'react';
import { useApi } from '../../../shared/hooks/useApi.js';
import { usuariosService } from '../../../api/services/usuariosService.js';
import { useAuth } from '../../../auth/useAuth.js';
import {
  LoadingSpinner, DegradedBanner, ErrorBox,
  EmptyState, Modal,
} from '../../../shared/components/index.jsx';

const ROLES_DISPONIBLES = ['ADMIN', 'ORGANIZACION', 'DONANTE'];
const INIT_FORM = { nombre: '', email: '', password: '', role: 'ORGANIZACION', zona: '', telefono: '' };

export default function Organizaciones() {
  const { role: myRole } = useAuth();
  const { data, loading, error, degraded, refetch } = useApi(() => usuariosService.listar());

  const [showModal, setShowModal]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form,    setForm]    = useState(INIT_FORM);
  const [saving,  setSaving]  = useState(false);
  const [saveErr, setSaveErr] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [search,     setSearch]     = useState('');

  const usuarios = data?.content ?? data ?? [];
  const filtered = usuarios.filter((u) => {
    const okRole   = filterRole ? u.role === filterRole : true;
    const okSearch = search
      ? (u.nombre?.toLowerCase().includes(search.toLowerCase()) ||
         u.email?.toLowerCase().includes(search.toLowerCase()))
      : true;
    return okRole && okSearch;
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true); setSaveErr('');
    try {
      await usuariosService.crear(form);
      setShowModal(false); setForm(INIT_FORM); refetch();
    } catch (err) {
      setSaveErr(err?.response?.data?.message ?? 'Error al crear usuario.');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true); setSaveErr('');
    try {
      await usuariosService.eliminar(deleteTarget.id);
      setDeleteTarget(null); refetch();
    } catch (err) {
      setSaveErr(err?.response?.data?.message ?? 'Error al eliminar usuario.');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Organizaciones y usuarios</h1>
          <p className="page-subtitle">Gestión de cuentas registradas en la plataforma</p>
        </div>
        {myRole === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => { setShowModal(true); setSaveErr(''); }}>
            + Nuevo usuario
          </button>
        )}
      </div>

      <DegradedBanner show={degraded} />
      <ErrorBox message={error} onRetry={refetch} />

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          className="form-input"
          style={{ width: 220 }}
          placeholder="Buscar por nombre o email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-input form-select" style={{ width: 160 }} value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}>
          <option value="">Todos los roles</option>
          {ROLES_DISPONIBLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', alignSelf: 'center' }}>
          {filtered.length} usuario{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="card">
        {loading ? <LoadingSpinner text="Cargando usuarios..." /> :
         filtered.length === 0 ? (
           <EmptyState icon="🏢" title="Sin usuarios" description="No se encontraron usuarios con estos filtros." />
         ) : (
           <div className="table-wrap">
             <table>
               <thead>
                 <tr>
                   <th>ID</th><th>Nombre</th><th>Email</th>
                   <th>Rol</th><th>Zona</th><th>Fecha registro</th>
                   {myRole === 'ADMIN' && <th>Acciones</th>}
                 </tr>
               </thead>
               <tbody>
                 {filtered.map((u) => (
                   <tr key={u.id}>
                     <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                       #{u.id}
                     </td>
                     <td style={{ fontWeight: 500 }}>{u.nombre ?? '—'}</td>
                     <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{u.email ?? '—'}</td>
                     <td>
                       <span className={`badge tag-role-${u.role}`} style={{ fontSize: 11 }}>
                         {u.role}
                       </span>
                     </td>
                     <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{u.zona ?? '—'}</td>
                     <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                       {u.fechaCreacion ? new Date(u.fechaCreacion).toLocaleDateString('es-CL') : '—'}
                     </td>
                     {myRole === 'ADMIN' && (
                       <td>
                         <button
                           className="btn btn-danger"
                           style={{ fontSize: 12, padding: '4px 10px' }}
                           onClick={() => { setDeleteTarget(u); setSaveErr(''); }}
                         >
                           Eliminar
                         </button>
                       </td>
                     )}
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         )}
      </div>

      {/* Modal crear usuario */}
      <Modal open={showModal} title="Nuevo usuario" onClose={() => setShowModal(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleCreate} disabled={saving}>
              {saving ? 'Creando…' : 'Crear usuario'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Nombre completo *</label>
          <input name="nombre" className="form-input" required placeholder="Ej: Cruz Roja Biobío"
            value={form.nombre} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Email *</label>
          <input name="email" type="email" className="form-input" required placeholder="org@ejemplo.cl"
            value={form.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Contraseña *</label>
          <input name="password" type="password" className="form-input" required placeholder="Mínimo 8 caracteres"
            value={form.password} onChange={handleChange} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Rol *</label>
            <select name="role" className="form-input form-select" value={form.role} onChange={handleChange}>
              {ROLES_DISPONIBLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Zona</label>
            <input name="zona" className="form-input" placeholder="Ej: Biobío"
              value={form.zona} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Teléfono</label>
          <input name="telefono" className="form-input" placeholder="+56 9 XXXX XXXX"
            value={form.telefono} onChange={handleChange} />
        </div>
        {saveErr && <ErrorBox message={saveErr} />}
      </Modal>

      {/* Modal confirmar eliminación */}
      <Modal open={!!deleteTarget} title="Eliminar usuario" onClose={() => setDeleteTarget(null)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancelar</button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>
              {saving ? 'Eliminando…' : 'Confirmar eliminación'}
            </button>
          </>
        }
      >
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          ¿Eliminar la cuenta de <strong>{deleteTarget?.nombre}</strong> ({deleteTarget?.email})?<br />
          Esta acción es irreversible y eliminará todos sus datos asociados.
        </p>
        {saveErr && <ErrorBox message={saveErr} />}
      </Modal>
    </div>
  );
}
