import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';
import logoUrl from '../assets/logo.png';

function getRoleRedirect(role) {
  if (role === 'ADMIN')        return '/admin';
  if (role === 'ORGANIZACION') return '/organizacion';
  if (role === 'DONANTE')      return '/donante';
  return '/bienvenida';
}

const FEATURES = [
  { icon: '🤝', text: 'Matching inteligente donación ↔ necesidad' },
  { icon: '📦', text: 'Logística y distribución centralizada' },
  { icon: '🔍', text: 'Trazabilidad completa en tiempo real' },
  { icon: '🌱', text: 'Impacto medible para tu comunidad' },
];

const STATS = [
  { value: '1,240+', label: 'Donaciones' },
  { value: '48',     label: 'Organizaciones' },
  { value: '98%',    label: 'Entregas' },
];

export default function Login() {
  const { login, role: ctxRole } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const registered = location.state?.registered;

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const rolFromBackend = await login(form.email, form.password);
      const effectiveRole = rolFromBackend ?? ctxRole;
      navigate(getRoleRedirect(effectiveRole), { replace: true });
    } catch {
      setError('Credenciales inválidas. Verifica tu correo y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Decorative blobs */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      {/* ── Left panel ── */}
      <div className="auth-left-panel">
        <div className="auth-left-content" style={{ animation: 'fadeInUp 0.6s ease both' }}>
          <img src={logoUrl} alt="Donaton logo" className="auth-logo-img" />
          <h1 className="auth-brand-title">Donaton</h1>
          <p className="auth-brand-subtitle">
            Plataforma solidaria que conecta donaciones con quienes más las necesitan, con trazabilidad completa en tiempo real.
          </p>

          <ul className="auth-feature-list">
            {FEATURES.map(({ icon, text }, i) => (
              <li key={text} className="auth-feature-item" style={{ animation: `fadeInUp 0.5s ease ${0.1 + i * 0.08}s both` }}>
                <span className="auth-feature-icon">{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          {/* Stats row */}
          <div className="auth-stats-row" style={{ animation: 'fadeInUp 0.5s ease 0.45s both' }}>
            {STATS.map(s => (
              <div key={s.label} className="auth-stat">
                <span className="auth-stat-value">{s.value}</span>
                <span className="auth-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="auth-right-panel">
        <div className="auth-form-card" style={{ animation: 'slideUp 0.55s cubic-bezier(0.34,1.56,0.64,1) both' }}>

          {/* Mobile logo */}
          <div className="auth-mobile-logo">
            <img src={logoUrl} alt="Donaton" className="auth-mobile-logo-img" />
          </div>

          {/* Header */}
          <div className="auth-form-header">
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'rgba(0,49,120,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, marginBottom: 16,
            }}>
              👋
            </div>
            <h2 className="auth-form-title">Bienvenido de vuelta</h2>
            <p className="auth-form-desc">Ingresa tus credenciales para continuar</p>
          </div>

          {/* Alerts */}
          {registered && (
            <div className="auth-alert auth-alert-success">
              <span>✅</span>
              <span>¡Cuenta creada exitosamente! Inicia sesión para continuar.</span>
            </div>
          )}
          {error && (
            <div className="auth-alert auth-alert-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                <span className="form-label-icon">✉️</span> Correo electrónico
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                required
                className="form-input auth-input"
                placeholder="tu@correo.cl"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                autoComplete="email"
                style={{
                  borderColor: focused === 'email' ? 'var(--primary)' : undefined,
                  boxShadow: focused === 'email' ? '0 0 0 3px rgba(0,49,120,0.1)' : undefined,
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                <span className="form-label-icon">🔒</span> Contraseña
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input auth-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  autoComplete="current-password"
                  style={{
                    borderColor: focused === 'password' ? 'var(--primary)' : undefined,
                    boxShadow: focused === 'password' ? '0 0 0 3px rgba(0,49,120,0.1)' : undefined,
                  }}
                />
                <button
                  type="button"
                  className="auth-toggle-pwd"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label="Mostrar/ocultar contraseña"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Forgot password link */}
            <div style={{ textAlign: 'right', marginTop: -8 }}>
              <Link to="/olvide-password" className="auth-link" style={{ fontSize: 13 }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={loading}
              style={{ marginTop: 4 }}
            >
              {loading ? (
                <><span className="auth-btn-spinner" /> Ingresando…</>
              ) : (
                <>Ingresar →</>
              )}
            </button>
          </form>

          <div className="auth-divider">o</div>

          <Link to="/registro?modo=anonimo" className="auth-anonymous-btn">
            👤 Acceder de forma anónima
          </Link>

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px dashed var(--outline-variant)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12, textAlign: 'center' }}>
              🔑 Acceso rápido local (Demo)
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-ghost magnetic-btn"
                style={{ fontSize: 12, padding: '6px 12px', background: 'rgba(30,185,128,0.1)', color: '#006c48', border: '1px solid rgba(30,185,128,0.2)', borderRadius: 'var(--r-md)' }}
                onClick={async () => {
                  setForm({ email: 'donante@donaton.cl', password: 'Donante123!' });
                  setLoading(true);
                  try {
                    const rol = await login('donante@donaton.cl', 'Donante123!');
                    navigate(getRoleRedirect(rol), { replace: true });
                  } catch {
                    setError('Error en login demo');
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                🤝 Donante
              </button>
              <button
                type="button"
                className="btn btn-ghost magnetic-btn"
                style={{ fontSize: 12, padding: '6px 12px', background: 'rgba(0,49,120,0.08)', color: 'var(--primary)', border: '1px solid rgba(0,49,120,0.15)', borderRadius: 'var(--r-md)' }}
                onClick={async () => {
                  setForm({ email: 'org@donaton.cl', password: 'Org123!' });
                  setLoading(true);
                  try {
                    const rol = await login('org@donaton.cl', 'Org123!');
                    navigate(getRoleRedirect(rol), { replace: true });
                  } catch {
                    setError('Error en login demo');
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                🏢 Organización
              </button>
              <button
                type="button"
                className="btn btn-ghost magnetic-btn"
                style={{ fontSize: 12, padding: '6px 12px', background: 'rgba(110,0,52,0.08)', color: '#6e0034', border: '1px solid rgba(110,0,52,0.15)', borderRadius: 'var(--r-md)' }}
                onClick={async () => {
                  setForm({ email: 'admin@donaton.cl', password: 'Admin123!' });
                  setLoading(true);
                  try {
                    const rol = await login('admin@donaton.cl', 'Admin123!');
                    navigate(getRoleRedirect(rol), { replace: true });
                  } catch {
                    setError('Error en login demo');
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          <div className="auth-footer-links">
            <p>
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="auth-link">Regístrate gratis</Link>
            </p>
            <p className="auth-legal">
              Donaton · Plataforma humanitaria · DuocUC DSY1106
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}