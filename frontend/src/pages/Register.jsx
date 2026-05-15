import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axiosClient.js';
import { EP } from '../api/endpoints.js';

const TIPOS = [
  { value: 'DONANTE',      label: '🤝 Soy donante',     desc: 'Quiero hacer donaciones y apoyar causas.' },
  { value: 'ORGANIZACION', label: '🏢 Soy organización', desc: 'Representamos a una entidad con necesidades.' },
];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep]     = useState(1); // 1: tipo, 2: datos
  const [tipo, setTipo]     = useState('');
  const [form, setForm]     = useState({ nombre: '', email: '', password: '', confirmPassword: '', organizacion: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        nombre:   form.nombre,
        email:    form.email,
        password: form.password,
        rol:      tipo,
        ...(tipo === 'ORGANIZACION' && { organizacion: form.organizacion }),
      };
      await apiClient.post(EP.AUTH.REGISTER, payload);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err?.response?.data?.message ?? 'No se pudo completar el registro. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #0F2D24 0%, #1D6A54 50%, #0B4D3B 100%)',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'fixed', top: -120, right: -120,
        width: 400, height: 400, borderRadius: '50%',
        background: 'rgba(93,202,165,0.12)', filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: -100, left: -100,
        width: 350, height: 350, borderRadius: '50%',
        background: 'rgba(239,159,39,0.08)', filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: 480,
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 24, padding: 40,
        boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'var(--brand-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>🤝</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', lineHeight: 1 }}>Donaton</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Crea tu cuenta</div>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          {[1, 2].map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: step >= s ? 'var(--brand-primary)' : 'var(--bg-page)',
                border: `2px solid ${step >= s ? 'var(--brand-primary)' : 'var(--border-mid)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
                color: step >= s ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}>{s}</div>
              {s < 2 && (
                <div style={{
                  width: 40, height: 2,
                  background: step > 1 ? 'var(--brand-primary)' : 'var(--border)',
                  borderRadius: 2, transition: 'all 0.3s',
                }} />
              )}
            </div>
          ))}
          <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 8 }}>
            {step === 1 ? 'Elige tu tipo de cuenta' : 'Completa tus datos'}
          </span>
        </div>

        {/* Step 1 — Tipo */}
        {step === 1 && (
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>¿Cómo quieres participar?</h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
              Elige el tipo de cuenta que mejor te representa.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {TIPOS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTipo(t.value)}
                  style={{
                    padding: '18px 20px', borderRadius: 12, textAlign: 'left', cursor: 'pointer',
                    border: `2px solid ${tipo === t.value ? 'var(--brand-primary)' : 'var(--border-mid)'}`,
                    background: tipo === t.value ? 'var(--brand-light)' : 'var(--bg-card)',
                    transition: 'all 0.18s',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{t.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t.desc}</div>
                </button>
              ))}
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 24, justifyContent: 'center', padding: '12px 0' }}
              onClick={() => { if (tipo) setStep(2); }}
              disabled={!tipo}
            >
              Continuar →
            </button>
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" style={{ color: 'var(--brand-primary)', fontWeight: 500 }}>Inicia sesión</Link>
            </p>
          </div>
        )}

        {/* Step 2 — Datos */}
        {step === 2 && (
          <form onSubmit={handleRegister}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  background: 'none', border: 'none', fontSize: 18,
                  color: 'var(--text-muted)', cursor: 'pointer', padding: '2px 4px',
                }}
              >←</button>
              <h1 style={{ fontSize: 20, fontWeight: 700 }}>
                {tipo === 'DONANTE' ? '🤝 Cuenta de donante' : '🏢 Cuenta de organización'}
              </h1>
            </div>

            {error && (
              <div className="error-box" style={{ marginBottom: 16, fontSize: 13 }}>
                ⚠ {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">
                  {tipo === 'ORGANIZACION' ? 'Nombre de la organización' : 'Nombre completo'}
                </label>
                <input
                  className="form-input"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder={tipo === 'ORGANIZACION' ? 'Ej: Fundación Ayuda Chile' : 'Ej: Juan Pérez'}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Correo electrónico</label>
                <input
                  className="form-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input
                  className="form-input"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mín. 8 caracteres"
                  required
                  minLength={8}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar contraseña</label>
                <input
                  className="form-input"
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite tu contraseña"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '12px 0', marginTop: 4 }}
              >
                {loading ? 'Creando cuenta…' : 'Crear cuenta'}
              </button>
            </div>

            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 14 }}>
              Al registrarte aceptas los términos de uso de Donaton.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
