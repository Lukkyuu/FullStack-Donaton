import { useState } from 'react';
import { useAuth } from '../../../auth/useAuth.js';
import { useApi } from '../../../shared/hooks/useApi.js';
import { usuariosService } from '../../../api/services/usuariosService.js';
import { LoadingSpinner, ErrorBox, DegradedBanner } from '../../../shared/components/index.jsx';

export default function Perfil() {
  const { user, role } = useAuth();
  const { data, loading, error, degraded, refetch } = useApi(() => usuariosService.perfil());

  const [editing, setEditing]   = useState(false);
  const [saving,  setSaving]    = useState(false);
  const [saveErr, setSaveErr]   = useState('');
  const [form,    setForm]      = useState(null);

  const perfil = data ?? {};

  const startEdit = () => {
    setForm({ nombre: perfil.nombre ?? '', telefono: perfil.telefono ?? '', zona: perfil.zona ?? '' });
    setEditing(true);
    setSaveErr('');
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setSaveErr('');
    try {
      await usuariosService.actualizar(user.id, form);
      setEditing(false);
      refetch();
    } catch (err) {
      setSaveErr(err?.response?.data?.message ?? 'Error al guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Cargando perfil..." />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Mi perfil</h1>
        <p className="page-subtitle">Gestiona tu información personal</p>
      </div>

      <DegradedBanner show={degraded} />
      <ErrorBox message={error} onRetry={refetch} />

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, maxWidth: 780 }}>
        {/* Avatar card */}
        <div className="card" style={{ padding: 28, textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--brand-primary)', color: '#fff',
            fontSize: 28, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            {(perfil.nombre ?? user?.nombre ?? 'D')[0].toUpperCase()}
          </div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
            {perfil.nombre ?? user?.nombre ?? '—'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
            {perfil.email ?? user?.email ?? '—'}
          </div>
          <span className={`badge tag-role-${role}`} style={{ fontSize: 12 }}>{role}</span>

          <div style={{ marginTop: 24, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
            <div>Miembro desde</div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
              {perfil.fechaCreacion ? new Date(perfil.fechaCreacion).toLocaleDateString('es-CL') : '—'}
            </div>
          </div>
        </div>

        {/* Datos card */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Información personal</h3>
            {!editing && (
              <button className="btn btn-secondary" style={{ fontSize: 13 }} onClick={startEdit}>
                Editar
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Nombre completo</label>
                <input name="nombre" className="form-input" value={form.nombre} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input name="telefono" className="form-input" placeholder="+56 9 XXXX XXXX" value={form.telefono} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Zona / Región</label>
                <input name="zona" className="form-input" placeholder="Ej: Biobío" value={form.zona} onChange={handleChange} />
              </div>
              {saveErr && <ErrorBox message={saveErr} />}
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando…' : 'Guardar cambios'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                { label: 'Nombre',   value: perfil.nombre   ?? user?.nombre ?? '—' },
                { label: 'Email',    value: perfil.email    ?? user?.email  ?? '—' },
                { label: 'Teléfono', value: perfil.telefono ?? '—' },
                { label: 'Zona',     value: perfil.zona     ?? '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>
                    {label}
                  </span>
                  <span style={{ fontSize: 15 }}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
