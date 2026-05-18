import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import apiClient from '../api/axiosClient.js';
import { EP } from '../api/endpoints.js';
import logoUrl from '../assets/logo.png';
import { validarRut, formatRutInput } from '../shared/utils/rutValidator.js';
import { REGIONES_Y_CIUDADES } from '../shared/utils/chileData.js';

const TIPOS = [
  {
    value: 'DONANTE',
    label: 'Soy donante',
    desc: 'Quiero hacer donaciones y apoyar causas solidarias.',
    icon: '🤝',
    color: '#1D6A54',
    bg: '#E1F5EE',
  },
  {
    value: 'ORGANIZACION',
    label: 'Soy organización',
    desc: 'Representamos a una entidad o fundación con necesidades.',
    icon: '🏢',
    color: '#185FA5',
    bg: '#E6F1FB',
  },
  {
    value: 'ANONIMO',
    label: 'Acceso anónimo',
    desc: 'Explorar la plataforma sin revelar mis datos personales.',
    icon: '👤',
    color: '#5F5E5A',
    bg: '#F1EFE8',
  },
];


export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modoAnonimo = searchParams.get('modo') === 'anonimo';

  const [step, setStep]   = useState(modoAnonimo ? 0 : 1);
  const [tipo, setTipo]   = useState(modoAnonimo ? 'ANONIMO' : '');
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [pwdStrength, setPwdStrength]     = useState(0);

  const [form, setForm] = useState({
    nombre: '', email: '', rut: '', fechaNacimiento: '', telefono: '',
    ciudad: '', region: '', domicilio: '',
    password: '', confirmPassword: '', organizacion: '',
  });

  useEffect(() => {
    if (modoAnonimo) {
      setTipo('ANONIMO');
      setStep(2);
    }
  }, [modoAnonimo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'region') {
      setForm(f => ({ ...f, region: value, ciudad: '' }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    if (name === 'password') calcStrength(value);
  };

  const calcStrength = (pwd) => {
    let s = 0;
    if (pwd.length >= 8)  s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    setPwdStrength(s);
  };

  const strengthLabel = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
  const strengthColor = ['', '#D85A30', '#EF9F27', '#1D8A5A', '#1D6A54'];

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (tipo !== 'ANONIMO') {
      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        setError('Ingresa un correo electrónico válido.');
        return;
      }
      // Validar fecha de nacimiento (si es donante)
      if (tipo === 'DONANTE' && form.fechaNacimiento) {
        const birthDate = new Date(form.fechaNacimiento);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18 || age > 120) {
          setError('Debes tener entre 18 y 120 años.');
          return;
        }
      }
      if (form.password !== form.confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
      if (form.password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres.');
        return;
      }
      if (form.rut) {
        const rutResult = validarRut(form.rut);
        if (!rutResult.valid) {
          setError(`RUT inválido: ${rutResult.error}`);
          return;
        }
        // Auto-formatear el RUT antes de enviar
        setForm(f => ({ ...f, rut: rutResult.formatted }));
      }
    }

    setLoading(true);
    try {
      const payload = {
        email:    form.email,
        password: form.password,
        rol:      tipo,
        ...(tipo !== 'ANONIMO' && {
          nombre:    form.nombre,
          rut:       form.rut,
          fechaNacimiento: form.fechaNacimiento,
          telefono:  form.telefono,
          ciudad:    form.ciudad,
          region:    form.region,
          domicilio: form.domicilio,
        }),
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

  const selectedTipo = TIPOS.find(t => t.value === tipo);

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      {/* Panel izquierdo */}
      <div className="auth-left-panel">
        <div className="auth-left-content">
          <img src={logoUrl} alt="Donaton logo" className="auth-logo-img" />
          <h1 className="auth-brand-title">Únete a Donaton</h1>
          <p className="auth-brand-subtitle">
            Crea tu cuenta y empieza a marcar la diferencia. Cada donación conecta corazones con necesidades reales.
          </p>

          <ul className="auth-feature-list">
            {[
              { icon: '🤝', text: 'Conecta con donantes y causas solidarias' },
              { icon: '📦', text: 'Proceso de donación transparente y seguro' },
              { icon: '🔍', text: 'Trazabilidad completa de tu impacto' },
              { icon: '🌱', text: 'Haz crecer tu comunidad ayudando' },
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
        <div className="auth-form-card auth-form-card-wide">
          <div className="auth-mobile-logo">
            <img src={logoUrl} alt="Donaton" className="auth-mobile-logo-img" />
          </div>

          {/* Stepper */}
          <div className="auth-stepper">
            {['Tipo de cuenta', 'Tus datos'].map((label, i) => {
              const s = i + 1;
              const active = step >= s;
              return (
                <div key={s} className="auth-step-item">
                  <div className={`auth-step-circle ${active ? 'active' : ''}`}>{active && step > s ? '✓' : s}</div>
                  <span className={`auth-step-label ${active ? 'active' : ''}`}>{label}</span>
                  {i < 1 && <div className={`auth-step-line ${step > s ? 'active' : ''}`} />}
                </div>
              );
            })}
          </div>

          {/* PASO 1 — Tipo */}
          {step === 1 && (
            <div className="auth-step-content">
              <div className="auth-form-header">
                <h2 className="auth-form-title">¿Cómo quieres participar?</h2>
                <p className="auth-form-desc">Elige el tipo de cuenta que mejor te representa.</p>
              </div>
              <div className="auth-tipo-selector">
                {TIPOS.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    className={`auth-tipo-btn ${tipo === t.value ? 'selected' : ''}`}
                    onClick={() => setTipo(t.value)}
                    style={tipo === t.value ? { borderColor: t.color, background: t.bg } : {}}
                  >
                    <span className="auth-tipo-btn-icon">{t.icon}</span>
                    <div>
                      <div className="auth-tipo-btn-label">{t.label}</div>
                      <div className="auth-tipo-btn-desc">{t.desc}</div>
                    </div>
                    {tipo === t.value && (
                      <div className="auth-tipo-selected-mark" style={{ background: t.color }}>✓</div>
                    )}
                  </button>
                ))}
              </div>
              <button
                className="btn btn-primary auth-submit-btn"
                onClick={() => { if (tipo) setStep(2); }}
                disabled={!tipo}
              >
                Continuar →
              </button>
              <p className="auth-footer-links-center">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="auth-link">Inicia sesión</Link>
              </p>
            </div>
          )}

          {/* PASO 2 — Datos */}
          {step === 2 && (
            <form onSubmit={handleRegister} className="auth-form auth-form-grid">
              <div className="auth-full-width" style={{ marginBottom: 4 }}>
                <button
                  type="button"
                  className="auth-back-btn"
                  onClick={() => { if (!modoAnonimo) setStep(1); else navigate('/login'); }}
                >
                  ← Volver
                </button>
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 26 }}>{selectedTipo?.icon}</span>
                  <div>
                    <h2 className="auth-form-title" style={{ marginBottom: 2 }}>
                      {selectedTipo?.label ?? 'Crear cuenta'}
                    </h2>
                    <p className="auth-form-desc">
                      {tipo === 'ANONIMO' ? 'Solo necesitamos tu correo y contraseña.' : 'Completa tu información para continuar.'}
                    </p>
                  </div>
                </div>
              </div>


              {error && (
                <div className="auth-alert auth-alert-error auth-full-width">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Campos anónimo: solo email + password */}
              {tipo === 'ANONIMO' ? (
                <>
                  <div className="form-group auth-full-width">
                    <label className="form-label">✉️ Correo electrónico</label>
                    <input name="email" type="email" required className="form-input auth-input"
                      placeholder="tu@correo.cl" value={form.email} onChange={handleChange} />
                  </div>
                  <div className="form-group auth-full-width">
                    <label className="form-label">🔒 Contraseña</label>
                    <div className="auth-input-wrapper">
                      <input name="password" type={showPassword ? 'text' : 'password'} required
                        className="form-input auth-input" placeholder="Mín. 8 caracteres"
                        value={form.password} onChange={handleChange} minLength={8} />
                      <button type="button" className="auth-toggle-pwd"
                        onClick={() => setShowPassword(v => !v)}>
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {form.password && (
                      <div className="auth-pwd-strength">
                        <div className="auth-pwd-bar">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="auth-pwd-seg"
                              style={{ background: i <= pwdStrength ? strengthColor[pwdStrength] : '#e0e0e0' }} />
                          ))}
                        </div>
                        <span style={{ color: strengthColor[pwdStrength] }}>{strengthLabel[pwdStrength]}</span>
                      </div>
                    )}
                  </div>
                  <div className="form-group auth-full-width">
                    <label className="form-label">🔒 Confirmar contraseña</label>
                    <div className="auth-input-wrapper">
                      <input name="confirmPassword" type={showConfirm ? 'text' : 'password'} required
                        className="form-input auth-input" placeholder="Repite tu contraseña"
                        value={form.confirmPassword} onChange={handleChange} />
                      <button type="button" className="auth-toggle-pwd"
                        onClick={() => setShowConfirm(v => !v)}>
                        {showConfirm ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* NOMBRE */}
                  <div className="form-group auth-full-width">
                    <label className="form-label">
                      👤 {tipo === 'ORGANIZACION' ? 'Nombre de la organización' : 'Nombre completo'}
                    </label>
                    <input name="nombre" required className="form-input auth-input"
                      placeholder={tipo === 'ORGANIZACION' ? 'Ej: Fundación Ayuda Chile' : 'Ej: Juan Pérez'}
                      value={form.nombre} onChange={handleChange} autoFocus />
                  </div>

                  {/* RUT */}
                  <div className="form-group">
                    <label className="form-label">🪪 RUT</label>
                    <input name="rut" required className="form-input auth-input"
                      placeholder="12.345.678-9"
                      value={form.rut} onChange={handleChange} />
                  </div>

                  {/* FECHA DE NACIMIENTO (Solo donantes) */}
                  {tipo === 'DONANTE' && (
                    <div className="form-group">
                      <label className="form-label">🎂 Fecha de nacimiento</label>
                      <input name="fechaNacimiento" type="date" required className="form-input auth-input"
                        value={form.fechaNacimiento} onChange={handleChange} />
                    </div>
                  )}

                  {/* EMAIL */}
                  <div className="form-group">
                    <label className="form-label">✉️ Correo electrónico</label>
                    <input name="email" type="email" required className="form-input auth-input"
                      placeholder="tu@correo.cl" value={form.email} onChange={handleChange} />
                  </div>

                  {/* TELÉFONO */}
                  <div className="form-group">
                    <label className="form-label">📱 Teléfono</label>
                    <input name="telefono" className="form-input auth-input"
                      placeholder="+56 9 XXXX XXXX"
                      value={form.telefono} onChange={handleChange} />
                  </div>

                  {/* REGIÓN */}
                  <div className="form-group">
                    <label className="form-label">🗺️ Región</label>
                    <select name="region" className="form-input auth-input form-select"
                      value={form.region} onChange={handleChange} required>
                      <option value="">Selecciona tu región</option>
                      {Object.keys(REGIONES_Y_CIUDADES).map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  {/* CIUDAD */}
                  <div className="form-group">
                    <label className="form-label">🏙️ Ciudad / Comuna</label>
                    <select name="ciudad" className="form-input auth-input form-select"
                      value={form.ciudad} onChange={handleChange} required disabled={!form.region}>
                      <option value="">Selecciona tu comuna</option>
                      {form.region && REGIONES_Y_CIUDADES[form.region]?.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* DOMICILIO */}
                  <div className="form-group auth-full-width">
                    <label className="form-label">🏠 Domicilio</label>
                    <input name="domicilio" className="form-input auth-input"
                      placeholder="Ej: Av. Principal 1234, Depto 5B"
                      value={form.domicilio} onChange={handleChange} />
                  </div>

                  {/* ORGANIZACIÓN */}
                  {tipo === 'ORGANIZACION' && (
                    <div className="form-group auth-full-width">
                      <label className="form-label">🏢 Nombre legal de la organización</label>
                      <input name="organizacion" required className="form-input auth-input"
                        placeholder="Razón social o nombre legal"
                        value={form.organizacion} onChange={handleChange} />
                    </div>
                  )}

                  {/* PASSWORD */}
                  <div className="form-group">
                    <label className="form-label">🔒 Contraseña</label>
                    <div className="auth-input-wrapper">
                      <input name="password" type={showPassword ? 'text' : 'password'} required
                        className="form-input auth-input" placeholder="Mín. 8 caracteres"
                        value={form.password} onChange={handleChange} minLength={8} />
                      <button type="button" className="auth-toggle-pwd"
                        onClick={() => setShowPassword(v => !v)}>
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {form.password && (
                      <div className="auth-pwd-strength">
                        <div className="auth-pwd-bar">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="auth-pwd-seg"
                              style={{ background: i <= pwdStrength ? strengthColor[pwdStrength] : '#e0e0e0' }} />
                          ))}
                        </div>
                        <span style={{ color: strengthColor[pwdStrength] }}>{strengthLabel[pwdStrength]}</span>
                      </div>
                    )}
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div className="form-group">
                    <label className="form-label">🔒 Confirmar contraseña</label>
                    <div className="auth-input-wrapper">
                      <input name="confirmPassword" type={showConfirm ? 'text' : 'password'} required
                        className="form-input auth-input" placeholder="Repite tu contraseña"
                        value={form.confirmPassword} onChange={handleChange} />
                      <button type="button" className="auth-toggle-pwd"
                        onClick={() => setShowConfirm(v => !v)}>
                        {showConfirm ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="btn btn-primary auth-submit-btn auth-full-width"
                disabled={loading}
              >
                {loading ? (
                  <><span className="auth-btn-spinner" /> Creando cuenta…</>
                ) : (
                  <>✨ Crear cuenta</>
                )}
              </button>

              <p className="auth-footer-links-center auth-full-width" style={{ fontSize: 12, marginTop: 8 }}>
                Al registrarte aceptas los <a href="#" className="auth-link">términos de uso</a> de Donaton.
              </p>
              <p className="auth-footer-links-center auth-full-width">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="auth-link">Inicia sesión</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
