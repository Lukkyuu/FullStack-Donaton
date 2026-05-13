import { useState } from 'react';
import { useApi } from '../../../shared/hooks/useApi.js';
import { notificacionesService } from '../../../api/services/notificacionesService.js';
import { LoadingSpinner, ErrorBox } from '../../../shared/components/index.jsx';

const CANALES = [
  { key: 'email',    label: 'Email',     icon: '📧', desc: 'Recibe notificaciones por correo electrónico.' },
  { key: 'push',     label: 'Push',      icon: '🔔', desc: 'Notificaciones en el navegador o app móvil.' },
  { key: 'sms',      label: 'SMS',       icon: '💬', desc: 'Alertas urgentes por mensaje de texto.' },
];

const EVENTOS = [
  { key: 'donacion_registrada',  label: 'Donación registrada',     desc: 'Confirmación al crear una donación.' },
  { key: 'matching_realizado',   label: 'Matching realizado',       desc: 'Cuando tu donación es asignada a una necesidad.' },
  { key: 'donacion_entregada',   label: 'Donación entregada',       desc: 'Confirmación de entrega final.' },
  { key: 'nueva_necesidad',      label: 'Nueva necesidad publicada', desc: 'Cuando se publica una necesidad que podría interesarte.' },
  { key: 'cambio_estado',        label: 'Cambio de estado',         desc: 'Actualizaciones de estado en tus donaciones.' },
];

const DEFAULT_PREFS = {
  canales: { email: true, push: false, sms: false },
  eventos: { donacion_registrada: true, matching_realizado: true, donacion_entregada: true, nueva_necesidad: false, cambio_estado: true },
};

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        position: 'relative', width: 44, height: 24, borderRadius: 99,
        background: checked ? 'var(--brand-primary)' : 'var(--border-mid)',
        border: 'none', cursor: 'pointer', transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3,
        left: checked ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 0.2s',
      }} />
    </button>
  );
}

export default function PreferenciasNotificaciones() {
  const { data, loading, error } = useApi(() => notificacionesService.getPreferencias());
  const [prefs, setPrefs]   = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [saveError, setSaveError] = useState('');

  // Merge server data + defaults once loaded
  const resolved = prefs ?? (data
    ? {
        canales: { ...DEFAULT_PREFS.canales, ...data.canales },
        eventos: { ...DEFAULT_PREFS.eventos, ...data.eventos },
      }
    : DEFAULT_PREFS);

  const setCanal = (key, val) =>
    setPrefs(p => {
      const base = p ?? resolved;
      return { ...base, canales: { ...base.canales, [key]: val } };
    });

  const setEvento = (key, val) =>
    setPrefs(p => {
      const base = p ?? resolved;
      return { ...base, eventos: { ...base.eventos, [key]: val } };
    });

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setSaveError('');
    try {
      await notificacionesService.updatePreferencias(resolved);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err?.response?.data?.message ?? 'No se pudieron guardar las preferencias.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Preferencias de notificaciones</h1>
        <p className="page-subtitle">Controla cómo y cuándo recibes notificaciones de Donaton.</p>
      </div>

      <ErrorBox message={error} />

      {loading ? (
        <LoadingSpinner text="Cargando preferencias..." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 640 }}>

          {/* Canales */}
          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Canales de notificación</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
              Activa los canales por los que deseas recibir alertas.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {CANALES.map(({ key, label, icon, desc }) => (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                  padding: '14px 16px', borderRadius: 'var(--r-md)',
                  background: resolved.canales[key] ? 'var(--brand-light)' : 'var(--bg-page)',
                  border: `1px solid ${resolved.canales[key] ? '#B2E5D4' : 'var(--border)'}`,
                  transition: 'all 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 22 }}>{icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
                    </div>
                  </div>
                  <Toggle checked={!!resolved.canales[key]} onChange={(v) => setCanal(key, v)} />
                </div>
              ))}
            </div>
          </div>

          {/* Eventos */}
          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Eventos que quiero seguir</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
              Elige qué tipo de eventos generarán una notificación para ti.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {EVENTOS.map(({ key, label, desc }) => (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
                  </div>
                  <Toggle checked={!!resolved.eventos[key]} onChange={(v) => setEvento(key, v)} />
                </div>
              ))}
            </div>
          </div>

          {/* Save button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
              style={{ padding: '10px 28px' }}
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
            {saved && (
              <span style={{ fontSize: 13, color: 'var(--brand-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                ✓ Preferencias guardadas
              </span>
            )}
            {saveError && <span style={{ fontSize: 13, color: '#A32D2D' }}>⚠ {saveError}</span>}
          </div>

        </div>
      )}
    </div>
  );
}
