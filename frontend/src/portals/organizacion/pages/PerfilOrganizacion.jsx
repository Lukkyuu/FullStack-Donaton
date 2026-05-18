import { useState } from 'react';
import { useAuth } from '../../../auth/useAuth.js';
import { useApi } from '../../../shared/hooks/useApi.js';
import { usuariosService } from '../../../api/services/usuariosService.js';
import { LoadingSpinner, ErrorBox } from '../../../shared/components/index.jsx';
import { useToast } from '../../../shared/components/Toast.jsx';

const REGIONES_CHILE = [
  'Arica y Parinacota','Tarapacá','Antofagasta','Atacama','Coquimbo',
  'Valparaíso','Metropolitana de Santiago',"O'Higgins",'Maule','Ñuble',
  'Biobío','La Araucanía','Los Ríos','Los Lagos','Aysén','Magallanes',
];

export default function PerfilOrganizacion() {
  const { user, role } = useAuth();
  const toast = useToast();
  const { data, loading, error, refetch } = useApi(() => usuariosService.perfil());

  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form,    setForm]    = useState(null);

  const perfil = data ?? {};

  const startEdit = () => {
    setForm({
      nombre:       perfil.nombre       ?? '',
      organizacion: perfil.organizacion ?? '',
      rut:          perfil.rut          ?? '',
      telefono:     perfil.telefono     ?? '',
      ciudad:       perfil.ciudad       ?? '',
      region:       perfil.region       ?? '',
      domicilio:    perfil.domicilio    ?? '',
      sitioWeb:     perfil.sitioWeb     ?? '',
    });
    setEditing(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await usuariosService.actualizar(user.id, form);
      setEditing(false);
      refetch();
      toast('Perfil actualizado correctamente', { type: 'success' });
    } catch (err) {
      toast(err?.response?.data?.message ?? 'Error al guardar los cambios.', { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Cargando perfil..." />;

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg,#0D2B42,#185FA5)',
        borderRadius: 20, padding: '28px 32px', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 20, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute',top:-30,right:-30,width:150,height:150,borderRadius:'50%',background:'rgba(255,255,255,0.05)' }} />
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize: 28, flexShrink: 0,
        }}>🏢</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:20, fontWeight:700, color:'#fff', marginBottom:4 }}>
            {perfil.organizacion ?? perfil.nombre ?? 'Organización'}
          </div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)', marginBottom:10 }}>
            {perfil.email ?? user?.email ?? '—'}
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <span style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:99, padding:'4px 12px', fontSize:12, color:'#fff', fontWeight:600 }}>
              🏢 ORGANIZACIÓN
            </span>
            {perfil.ciudad && (
              <span style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:99, padding:'4px 12px', fontSize:12, color:'rgba(255,255,255,0.85)' }}>
                📍 {perfil.ciudad}
              </span>
            )}
          </div>
        </div>
        {!editing && (
          <button className="btn" style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)', color:'#fff', fontSize:13 }} onClick={startEdit}>
            ✏️ Editar
          </button>
        )}
      </div>

      <ErrorBox message={error} onRetry={refetch} />

      {editing ? (
        <form onSubmit={handleSave} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, maxWidth:720 }}>
          <div className="form-group auth-full-width">
            <label className="form-label">🏢 Nombre de la organización</label>
            <input name="organizacion" className="form-input" value={form.organizacion} onChange={handleChange} placeholder="Nombre legal" />
          </div>
          <div className="form-group auth-full-width">
            <label className="form-label">👤 Nombre del representante</label>
            <input name="nombre" className="form-input" value={form.nombre} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">🪪 RUT organización</label>
            <input name="rut" className="form-input" placeholder="76.543.210-K" value={form.rut} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">📱 Teléfono</label>
            <input name="telefono" className="form-input" placeholder="+56 2 XXXX XXXX" value={form.telefono} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">🏙️ Ciudad</label>
            <input name="ciudad" className="form-input" value={form.ciudad} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">🗺️ Región</label>
            <select name="region" className="form-input form-select" value={form.region} onChange={handleChange}>
              <option value="">Selecciona región</option>
              {REGIONES_CHILE.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group auth-full-width">
            <label className="form-label">🏠 Domicilio</label>
            <input name="domicilio" className="form-input" value={form.domicilio} onChange={handleChange} />
          </div>
          <div className="form-group auth-full-width">
            <label className="form-label">🌐 Sitio web</label>
            <input name="sitioWeb" type="url" className="form-input" placeholder="https://..." value={form.sitioWeb} onChange={handleChange} />
          </div>
          <div style={{ gridColumn:'1/-1', display:'flex', gap:10 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : '💾 Guardar cambios'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancelar</button>
          </div>
        </form>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, maxWidth:720 }}>
          {[
            { label:'🏢 Organización',  value: perfil.organizacion ?? '—' },
            { label:'👤 Representante', value: perfil.nombre       ?? user?.nombre ?? '—' },
            { label:'✉️ Email',         value: perfil.email        ?? user?.email  ?? '—' },
            { label:'🪪 RUT',           value: perfil.rut          ?? '—' },
            { label:'📱 Teléfono',      value: perfil.telefono     ?? '—' },
            { label:'🏙️ Ciudad',        value: perfil.ciudad       ?? '—' },
            { label:'🗺️ Región',        value: perfil.region       ?? '—' },
            { label:'🏠 Domicilio',     value: perfil.domicilio    ?? '—' },
            { label:'🌐 Sitio web',     value: perfil.sitioWeb     ?? '—' },
            { label:'📅 Miembro desde', value: perfil.fechaCreacion ? new Date(perfil.fechaCreacion).toLocaleDateString('es-CL') : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="card" style={{ padding:'14px 18px' }}>
              <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:500, marginBottom:4 }}>{label}</div>
              <div style={{ fontSize:14, fontWeight:500 }}>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
