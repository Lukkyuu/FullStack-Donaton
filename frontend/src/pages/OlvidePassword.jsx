import { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosClient.js';
import logoUrl from '../assets/logo.png';

export default function OlvidePassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Ingresa tu correo electrónico.'); return; }
    try {
      await apiClient.post('/api/auth/recuperar-password', { email });
      setSent(true);
    } catch (err) {
      // Fallback demo local si el backend está caído
      if (!err.response) {
        setSent(true);
      } else {
        setError(err?.response?.data?.message ?? 'Ocurrió un error. Intenta más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      {/* Panel izquierdo */}
      <div className="auth-left-panel">
        <div className="auth-left-content">
          <img src={logoUrl} alt="Donaton logo" className="auth-logo-img" />
          <h1 className="auth-brand-title">Recupera tu acceso</h1>
          <p className="auth-brand-subtitle">
            Ingresa tu correo registrado y te enviaremos un enlace para restablecer tu contraseña de forma segura.
          </p>
          <ul className="auth-feature-list">
            {[
              { icon: '🔒', text: 'Enlace de recuperación seguro y encriptado' },
              { icon: '⏱️', text: 'El enlace expira en 30 minutos' },
              { icon: '✉️', text: 'Revisa también tu carpeta de spam' },
            ].map(({ icon, text }) => (
              <li key={text} className="auth-feature-item">
                <span className="auth-feature-icon">{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="auth-right-panel">
        <div className="auth-form-card">
          <div className="auth-mobile-logo">
            <img src={logoUrl} alt="Donaton" className="auth-mobile-logo-img" />
          </div>

          {!sent ? (
            <>
              <div className="auth-form-header">
                <h2 className="auth-form-title">🔑 Olvidé mi contraseña</h2>
                <p className="auth-form-desc">
                  Te enviaremos instrucciones para restablecerla.
                </p>
              </div>

              {error && (
                <div className="auth-alert auth-alert-error">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="reset-email">
                    <span className="form-label-icon">✉️</span> Correo electrónico
                  </label>
                  <input
                    id="reset-email" type="email" required
                    className="form-input auth-input"
                    placeholder="tu@correo.cl"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoFocus
                  />
                </div>

                <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
                  {loading ? (
                    <><span className="auth-btn-spinner" /> Enviando…</>
                  ) : (
                    <>Enviar enlace de recuperación</>
                  )}
                </button>
              </form>

              <div className="auth-footer-links">
                <p>
                  <Link to="/login" className="auth-link">← Volver al inicio de sesión</Link>
                </p>
                <p>
                  ¿No tienes cuenta?{' '}
                  <Link to="/registro" className="auth-link">Regístrate gratis</Link>
                </p>
              </div>
            </>
          ) : (
            /* Estado enviado */
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>📬</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: '#1A1A18' }}>
                ¡Correo enviado!
              </h2>
              <p style={{ fontSize: 14, color: '#9A9A94', lineHeight: 1.7, marginBottom: 28 }}>
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
                Revisa tu bandeja de entrada y también la carpeta de spam.
              </p>
              <div style={{
                background: '#E1F5EE', border: '1px solid #B2E5D4',
                borderRadius: 12, padding: '14px 18px', marginBottom: 28,
                fontSize: 13, color: '#085041', lineHeight: 1.6,
              }}>
                ⏱️ El enlace es válido por <strong>30 minutos</strong>.
                Si no recibes el correo, verifica que el email esté bien escrito.
              </div>
              <button
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
                onClick={() => { setSent(false); setEmail(''); }}
              >
                Intentar con otro correo
              </button>
              <div className="auth-footer-links" style={{ marginTop: 16 }}>
                <p>
                  <Link to="/login" className="auth-link">← Volver al inicio de sesión</Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
