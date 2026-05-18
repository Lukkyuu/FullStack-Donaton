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

export default function Login() {
  const { login, role: ctxRole } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const registered = location.state?.registered;
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const rolFromBackend = await login(form.email, form.password);
      // Usa el rol devuelto por el backend; si es undefined cae al rol del contexto (JWT)
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
      {/* Blobs decorativos */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      {/* Panel izquierdo informativo */}
      <div className="auth-left-panel">
        <div className="auth-left-content">
          <img src={logoUrl} alt="Donaton logo" className="auth-logo-img" />
          <h1 className="auth-brand-title">Donaton</h1>
          <p className="auth-brand-subtitle">
            Plataforma solidaria que conecta donaciones con quienes más las necesitan, con trazabilidad completa en tiempo real.
          </p>
          <ul className="auth-feature-list">
            {[
              { icon: '🤝', text: 'Matching inteligente donación ↔ necesidad' },
              { icon: '📦', text: 'Logística y distribución centralizada' },
              { icon: '🔍', text: 'Trazabilidad completa en tiempo real' },
              { icon: '🌱', text: 'Impacto medible para tu comunidad' },
            ].map(({ icon, text }) => (
              <li key={text} className="auth-feature-item">
                <span className="auth-feature-icon">{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="auth-right-panel">
        <div className="auth-form-card">
          {/* Logo mobile */}
          <div className="auth-mobile-logo">
            <img src={logoUrl} alt="Donaton" className="auth-mobile-logo-img" />
          </div>

          <div className="auth-form-header">
            <h2 className="auth-form-title">Bienvenido de vuelta</h2>
            <p className="auth-form-desc">Ingresa tus credenciales para continuar</p>
          </div>

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

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                <span className="form-label-icon">✉️</span> Correo electrónico
              </label>
              <input
                id="login-email" name="email" type="email" required
                className="form-input auth-input"
                placeholder="tu@correo.cl"
                value={form.email} onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                <span className="form-label-icon">🔒</span> Contraseña
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="login-password" name="password"
                  type={showPassword ? 'text' : 'password'} required
                  className="form-input auth-input"
                  placeholder="••••••••"
                  value={form.password} onChange={handleChange}
                  autoComplete="current-password"
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

            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <><span className="auth-btn-spinner" /> Ingresando…</>
              ) : (
                <><span>Ingresar</span> <span>→</span></>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>o</span>
          </div>

          <Link to="/registro?modo=anonimo" className="auth-anonymous-btn">
            👤 Acceder de forma anónima
          </Link>

          <div className="auth-footer-links">
            <p>
              <Link to="/olvide-password" className="auth-link">¿Olvidaste tu contraseña?</Link>
            </p>
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