import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.js';

// Cuentas de prueba (solo para desarrollo cuando backend no está disponible)
const MOCK_USERS = {
  'admin@donaton.cl':   { role: 'ADMIN',        nombre: 'Diego Admin' },
  'org@donaton.cl':     { role: 'ORGANIZACION',  nombre: 'Cruz Roja Biobío' },
  'donante@donaton.cl': { role: 'DONANTE',       nombre: 'Diego Otárola' },
};
const MOCK_PASSWORD = '12345678';

function makeFakeToken(user, email) {
  const payload = btoa(JSON.stringify({
    sub: String(Math.floor(Math.random() * 1000)),
    role: user.role,
    nombre: user.nombre,
    email,
    exp: Math.floor(Date.now() / 1000) + 900,
  }));
  return `eyJhbGciOiJIUzI1NiJ9.${payload}.mock_signature`;
}

function getRoleRedirect(role) {
  if (role === 'ADMIN')        return '/admin';
  if (role === 'ORGANIZACION') return '/organizacion';
  if (role === 'DONANTE')      return '/donante';
  return '/bienvenida';
}

export default function Login() {
  const { login, applyToken } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const registered = location.state?.registered;
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 500));

    const mockUser = MOCK_USERS[form.email];

    if (!mockUser || form.password !== MOCK_PASSWORD) {
      setError('Credenciales inválidas. Verifica tu correo y contraseña.');
      setLoading(false);
      return;
    }

    try {
      const role = await login(form.email, form.password);
      navigate(getRoleRedirect(role), { replace: true });
    } catch {
      // Backend no disponible — aplicar token mock directamente
      const fakeToken = makeFakeToken(mockUser, form.email);
      applyToken(fakeToken);
      navigate(getRoleRedirect(mockUser.role), { replace: true });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #0F2D24 0%, #1D6A54 60%, #3aa882 100%)',
    }}>
      {/* Panel izquierdo */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px', color: '#fff',
      }}>
        <div style={{ maxWidth: 400 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, marginBottom: 24,
          }}>🤝</div>
          <h1 style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>Donaton</h1>
          <p style={{ fontSize: 17, opacity: 0.82, lineHeight: 1.6 }}>
            Plataforma de gestión humanitaria. Conectamos donaciones con las necesidades reales de las comunidades.
          </p>

          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              'Matching inteligente donación ↔ necesidad',
              'Logística y distribución centralizada',
              'Trazabilidad completa en tiempo real',
            ].map((text) => (
              <div key={text} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, flexShrink: 0, marginTop: 1,
                }}>✓</span>
                <span style={{ fontSize: 14, opacity: 0.9 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div style={{
        width: 460, background: '#fff', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Iniciar sesión</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>
            Ingresa tus credenciales para continuar
          </p>

          {registered && (
            <div style={{
              marginBottom: 20, padding: '12px 16px',
              background: 'var(--brand-light)', border: '1px solid #B2E5D4',
              borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--brand-dark)',
            }}>
              ✅ ¡Cuenta creada! Inicia sesión para continuar.
            </div>
          )}

          {error && <div className="error-box" style={{ marginBottom: 20 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Correo electrónico</label>
              <input
                id="email" name="email" type="email" required
                className="form-input" placeholder="tu@correo.cl"
                value={form.email} onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Contraseña</label>
              <input
                id="password" name="password" type="password" required
                className="form-input" placeholder="••••••••"
                value={form.password} onChange={handleChange}
              />
            </div>
            <button
              type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: 15, marginTop: 6 }}
            >
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              ¿No tienes cuenta?{' '}
              <Link to="/registro" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>Regístrate gratis</Link>
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 16, lineHeight: 1.6 }}>
              Donaton — Plataforma humanitaria DSY1106<br />
              DuocUC · Desarrollo Fullstack III
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}