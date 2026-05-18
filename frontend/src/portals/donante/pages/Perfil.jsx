import { useState } from 'react';
import { useAuth } from '../../../auth/useAuth.js';
import { useApi } from '../../../shared/hooks/useApi.js';
import { usuariosService } from '../../../api/services/usuariosService.js';
import { LoadingSpinner, ErrorBox, DegradedBanner } from '../../../shared/components/index.jsx';
import { useToast } from '../../../shared/components/Toast.jsx';

const COLORES_AVATAR = [
  { id: 'verde',    bg: 'linear-gradient(135deg,#5DCAA5,#1D6A54)', label: 'Verde' },
  { id: 'azul',     bg: 'linear-gradient(135deg,#60A5FA,#185FA5)', label: 'Azul' },
  { id: 'morado',   bg: 'linear-gradient(135deg,#A78BFA,#5B21B6)', label: 'Morado' },
  { id: 'coral',    bg: 'linear-gradient(135deg,#F87171,#D85A30)', label: 'Coral' },
  { id: 'dorado',   bg: 'linear-gradient(135deg,#FCD34D,#EF9F27)', label: 'Dorado' },
  { id: 'marino',   bg: 'linear-gradient(135deg,#6EE7B7,#065F46)', label: 'Marino' },
];

const ANIMOS = [
  { value: 'motivado',     label: 'Motivado',     icon: '💪' },
  { value: 'generoso',     label: 'Generoso',     icon: '💚' },
  { value: 'comprometido', label: 'Comprometido', icon: '🤝' },
  { value: 'esperanzador', label: 'Esperanzador', icon: '🌱' },
  { value: 'tranquilo',    label: 'Tranquilo',    icon: '😌' },
  { value: 'entusiasta',   label: 'Entusiasta',   icon: '🎉' },
];

const REGIONES_CHILE = [
  'Arica y Parinacota','Tarapacá','Antofagasta','Atacama','Coquimbo',
  'Valparaíso','Metropolitana de Santiago',"O'Higgins",'Maule','Ñuble',
  'Biobío','La Araucanía','Los Ríos','Los Lagos','Aysén','Magallanes',
];

export default function Perfil() {
  const { user, role } = useAuth();
  const toast = useToast();
  const { data, loading, error, degraded, refetch } = useApi(() => usuariosService.perfil());

  const [tab, setTab]         = useState('info');   // 'info' | 'personalizar' | 'seguridad'
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [saveErr, setSaveErr] = useState('');
  const [form,    setForm]    = useState(null);

  // Preferencias locales (persisten en localStorage)
  const [colorAvatar, setColorAvatar] = useState(
    () => localStorage.getItem('donaton_color') ?? 'verde'
  );
  const [animo, setAnimo] = useState(
    () => localStorage.getItem('donaton_animo') ?? ''
  );
  const [bio, setBio] = useState(
    () => localStorage.getItem('donaton_bio') ?? ''
  );

  const perfil = data ?? {};
  const colorGrad = COLORES_AVATAR.find(c => c.id === colorAvatar)?.bg
    ?? COLORES_AVATAR[0].bg;

  const startEdit = () => {
    setForm({
      nombre:   perfil.nombre   ?? '',
      telefono: perfil.telefono ?? '',
      ciudad:   perfil.ciudad   ?? '',
      region:   perfil.region   ?? '',
      domicilio:perfil.domicilio?? '',
      rut:      perfil.rut      ?? '',
    });
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
      toast('Perfil actualizado correctamente', { type: 'success' });
    } catch (err) {
      toast(err?.response?.data?.message ?? 'Error al guardar los cambios.', { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const savePersonalizacion = () => {
    localStorage.setItem('donaton_color', colorAvatar);
    localStorage.setItem('donaton_animo', animo);
    localStorage.setItem('donaton_bio', bio);
    toast('¡Personalización guardada correctamente!', { type: 'success' });
  };

  const animoObj = ANIMOS.find(a => a.value === animo);

  if (loading) return <LoadingSpinner text="Cargando perfil..." />;

  return (
    <div>
      {/* Hero del perfil */}
      <div className="profile-hero">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar-initial" style={{ background: colorGrad }}>
            {(perfil.nombre ?? user?.nombre ?? 'D')[0].toUpperCase()}
          </div>
        </div>
        <div className="profile-hero-info">
          <div className="profile-hero-name">
            {perfil.nombre ?? user?.nombre ?? '—'}
            {animoObj && <span style={{ marginLeft: 8, fontSize: 20 }}>{animoObj.icon}</span>}
          </div>
          <div className="profile-hero-email">{perfil.email ?? user?.email ?? '—'}</div>
          {bio && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 10, fontStyle: 'italic' }}>"{bio}"</div>}
          <div className="profile-hero-badges">
            <span className="profile-hero-badge">
              {role === 'DONANTE' ? '🤝' : role === 'ORGANIZACION' ? '🏢' : '👤'} {role}
            </span>
            {perfil.fechaCreacion && (
              <span className="profile-hero-badge">
                📅 Desde {new Date(perfil.fechaCreacion).toLocaleDateString('es-CL')}
              </span>
            )}
            {perfil.ciudad && (
              <span className="profile-hero-badge">📍 {perfil.ciudad}</span>
            )}
          </div>
        </div>
      </div>

      <DegradedBanner show={degraded} />
      <ErrorBox message={error} onRetry={refetch} />

      {/* Tabs */}
      <div className="profile-tabs">
        {[
          { id: 'info',         label: '📋 Información' },
          { id: 'personalizar', label: '🎨 Personalizar' },
          { id: 'seguridad',    label: '🔒 Seguridad' },
        ].map(t => (
          <button
            key={t.id}
            className={`profile-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => { setTab(t.id); setEditing(false); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB: Información personal */}
      {tab === 'info' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 820 }}>
          <div className="card" style={{ padding: 24, gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Información personal</h3>
            {!editing && (
              <button className="btn btn-secondary" style={{ fontSize: 13 }} onClick={startEdit}>
                ✏️ Editar datos
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {saveErr && <ErrorBox message={saveErr} />}

              <div className="form-group">
                <label className="form-label">Nombre completo</label>
                <input name="nombre" className="form-input" value={form.nombre} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">RUT</label>
                <input name="rut" className="form-input" placeholder="12.345.678-9" value={form.rut} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input name="telefono" className="form-input" placeholder="+56 9 XXXX XXXX" value={form.telefono} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Ciudad</label>
                <input name="ciudad" className="form-input" placeholder="Ej: Concepción" value={form.ciudad} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Región</label>
                <select name="region" className="form-input form-select" value={form.region} onChange={handleChange}>
                  <option value="">Selecciona tu región</option>
                  {REGIONES_CHILE.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Domicilio</label>
                <input name="domicilio" className="form-input" placeholder="Av. Principal 1234" value={form.domicilio} onChange={handleChange} />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando…' : '💾 Guardar cambios'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
              {[
                { label: '👤 Nombre',     value: perfil.nombre    ?? user?.nombre ?? '—' },
                { label: '✉️ Email',      value: perfil.email     ?? user?.email  ?? '—' },
                { label: '🪪 RUT',        value: perfil.rut       ?? '—' },
                { label: '📱 Teléfono',   value: perfil.telefono  ?? '—' },
                { label: '🏙️ Ciudad',     value: perfil.ciudad    ?? '—' },
                { label: '🗺️ Región',     value: perfil.region    ?? '—' },
                { label: '🏠 Domicilio',  value: perfil.domicilio ?? '—' },
              ].map(({ label, value }) => (
                <div key={label} className="card" style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500, marginBottom: 4 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* TAB: Personalizar */}
      {tab === 'personalizar' && (
        <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Color del avatar */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>🎨 Color de tu avatar</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
              Elige el gradiente que represente tu personalidad.
            </p>
            <div className="profile-color-options">
              {COLORES_AVATAR.map(c => (
                <button
                  key={c.id}
                  type="button"
                  title={c.label}
                  className={`profile-color-swatch ${colorAvatar === c.id ? 'selected' : ''}`}
                  style={{ background: c.bg }}
                  onClick={() => setColorAvatar(c.id)}
                />
              ))}
            </div>
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: colorGrad, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 28, fontWeight: 700 }}>
                {(perfil.nombre ?? user?.nombre ?? 'D')[0].toUpperCase()}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Vista previa de tu avatar</p>
            </div>
          </div>

          {/* Ánimo / estado */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>😊 Tu estado de ánimo donante</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
              ¿Cómo te sientes hoy al donar? Esto aparecerá en tu perfil.
            </p>
            <div className="profile-mood-grid">
              {ANIMOS.map(a => (
                <button
                  key={a.value}
                  type="button"
                  className={`profile-mood-btn ${animo === a.value ? 'selected' : ''}`}
                  onClick={() => setAnimo(a.value)}
                >
                  <span className="profile-mood-icon">{a.icon}</span>
                  <span>{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bio / Frase */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>💬 Tu frase donante</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
              Una frase corta que te defina como donante (máx. 100 caracteres).
            </p>
            <textarea
              className="form-input"
              style={{ resize: 'none', height: 70, fontSize: 14 }}
              maxLength={100}
              placeholder="Ej: Cada pequeña acción suma para un gran cambio..."
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right', marginTop: 4 }}>
              {bio.length}/100
            </div>
          </div>

          <button className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 24px' }} onClick={savePersonalizacion}>
            💾 Guardar personalización
          </button>
        </div>
      )}

      {/* TAB: Seguridad */}
      {tab === 'seguridad' && (
        <div style={{ maxWidth: 500 }}>
          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>🔒 Seguridad de la cuenta</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: '14px 18px', borderRadius: 10, background: 'var(--bg-page)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Correo electrónico</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{perfil.email ?? user?.email ?? '—'}</div>
              </div>
              <div style={{ padding: '14px 18px', borderRadius: 10, background: 'var(--bg-page)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Contraseña</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>••••••••••</div>
              </div>
              <button className="btn btn-secondary" style={{ alignSelf: 'flex-start', fontSize: 13 }}>
                🔑 Cambiar contraseña
              </button>
              <div style={{ marginTop: 8, padding: '12px 16px', borderRadius: 10, background: '#FAEEDA', border: '1px solid #FAC775' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#854F0B', marginBottom: 4 }}>ℹ️ Sesión activa</div>
                <div style={{ fontSize: 13, color: '#854F0B' }}>
                  Tu sesión está activa desde este dispositivo. Si detectas actividad sospechosa, cierra sesión inmediatamente.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
