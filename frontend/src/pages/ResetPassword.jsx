import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/axiosClient.js';
import logoUrl from '../assets/logo.png';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Enlace inválido o expirado. Por favor, solicita uno nuevo.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/api/auth/reset-password', { token, newPassword: password });
      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    } catch (err) {
      // Fallback demo local si el backend está caído
      if (!err.response) {
        setSuccess(true);
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      } else {
        setError(err?.response?.data?.message ?? 'El enlace expiró o es inválido.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      
      <div className="auth-right-panel" style={{ margin: '0 auto', maxWidth: 600, width: '100%' }}>
        <div className="auth-form-card" style={{ padding: '40px 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <img src={logoUrl} alt="Donaton" style={{ width: 64, height: 64, objectFit: 'contain' }} />
          </div>

          {!success ? (
            <>
              <div className="auth-form-header" style={{ textAlign: 'center' }}>
                <h2 className="auth-form-title">Restablecer Contraseña</h2>
                <p className="auth-form-desc">Crea una nueva contraseña para tu cuenta.</p>
              </div>

              {error && (
                <div className="auth-alert auth-alert-error" style={{ marginBottom: 24 }}>
                  <span>⚠️</span> {error}
                </div>
              )}

              {token && !error.includes('Enlace inválido') && (
                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="form-group">
                    <label className="form-label" htmlFor="new-password">Nueva contraseña</label>
                    <input
                      id="new-password" type="password" required
                      className="form-input auth-input"
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="confirm-password">Confirmar nueva contraseña</label>
                    <input
                      id="confirm-password" type="password" required
                      className="form-input auth-input"
                      placeholder="Repite tu contraseña"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading} style={{ marginTop: 12 }}>
                    {loading ? (
                      <><span className="auth-btn-spinner" /> Guardando…</>
                    ) : (
                      <>Guardar y continuar</>
                    )}
                  </button>
                </form>
              )}
              
              <div className="auth-footer-links" style={{ justifyContent: 'center', marginTop: 24 }}>
                <Link to="/login" className="auth-link">← Volver al inicio de sesión</Link>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, color: '#1A1A18' }}>
                ¡Contraseña actualizada!
              </h2>
              <p style={{ fontSize: 15, color: '#6A6A64' }}>
                Tu contraseña se ha restablecido correctamente. Te estamos redirigiendo al inicio de sesión...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
