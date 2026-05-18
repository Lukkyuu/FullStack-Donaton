import { useNavigate } from 'react-router-dom';
import { useApi } from '../shared/hooks/useApi.js';
import { necesidadesService } from '../api/services/necesidadesService.js';
import { StatusBadge } from '../shared/components/index.jsx';
import logoUrl from '../assets/logo.png';

const FEATURES = [
  { icon: '🤝', title: 'Donaciones con propósito', desc: 'Conecta tu donación directamente con quienes más lo necesitan.' },
  { icon: '🔗', title: 'Matching inteligente', desc: 'Nuestro motor automático une donaciones con necesidades según cercanía, urgencia y tipo.' },
  { icon: '📦', title: 'Logística transparente', desc: 'Sigue el estado de tu donación desde que la registras hasta que llega a destino.' },
  { icon: '🌱', title: 'Impacto medible', desc: 'Reportes de trazabilidad completa para donantes y organizaciones.' },
];

const STATS = [
  { value: '1,240+', label: 'Donaciones gestionadas' },
  { value: '48',     label: 'Organizaciones activas' },
  { value: '3',      label: 'Regiones cubiertas' },
  { value: '98%',    label: 'Entregas completadas' },
];

export default function Landing() {
  const navigate = useNavigate();

  const { data: necesidades, loading } = useApi(() => necesidadesService.publicas({ limit: 6 }));
  const items = necesidades?.content ?? necesidades ?? [];

  const urgencyColor = { ALTA: '#A32D2D', MEDIA: '#854F0B', BAJA: '#0F6E56' };
  const urgencyBg    = { ALTA: '#FCEBEB', MEDIA: '#FAEEDA', BAJA: '#E1F5EE' };

  return (
    <div style={{ minHeight: '100vh', background: '#F6F7F5' }}>
      {/* NAV */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={logoUrl} alt="Donaton" style={{ width: 40, height: 40, objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>Donaton</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/login')}
          >Iniciar sesión</button>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/registro')}
          >Únete gratis →</button>
        </div>
      </header>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #0F2D24 0%, #1D6A54 60%, #155C48 100%)',
        padding: '100px 40px 80px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Glows */}
        <div style={{
          position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400, borderRadius: '50%',
          background: 'rgba(93,202,165,0.15)', filter: 'blur(80px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'relative', maxWidth: 700, margin: '0 auto',
        }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(93,202,165,0.2)', color: '#5DCAA5',
            border: '1px solid rgba(93,202,165,0.3)',
            borderRadius: 99, padding: '5px 16px', fontSize: 13, fontWeight: 600,
            marginBottom: 24, letterSpacing: 0.3,
          }}>
            🌱 Plataforma de donación solidaria
          </span>
          <h1 style={{
            fontSize: 52, fontWeight: 800, color: '#fff',
            lineHeight: 1.15, marginBottom: 20,
          }}>
            Tu donación, con <span style={{ color: '#5DCAA5' }}>trazabilidad completa</span>
          </h1>
          <p style={{
            fontSize: 18, color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px',
          }}>
            Donaton conecta donantes y organizaciones de forma inteligente, asegurando que cada ayuda llegue a quien más la necesita.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn"
              style={{
                background: '#fff', color: 'var(--brand-dark)',
                fontWeight: 700, fontSize: 16, padding: '14px 32px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }}
              onClick={() => navigate('/registro')}
            >
              Registrarme gratis
            </button>
            <button
              className="btn btn-secondary"
              style={{
                border: '1.5px solid rgba(255,255,255,0.3)', color: '#fff',
                fontSize: 15, padding: '14px 28px',
              }}
              onClick={() => { document.getElementById('necesidades-section').scrollIntoView({ behavior: 'smooth' }); }}
            >
              Ver necesidades activas
            </button>
          </div>
        </div>
      </section>



      {/* FEATURES */}
      <section style={{ padding: '72px 40px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>¿Por qué Donaton?</h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto' }}>
            Una plataforma diseñada para que cada gesto de solidaridad tenga el máximo impacto posible.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="card" style={{ padding: '28px 32px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'var(--brand-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, flexShrink: 0,
              }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NECESIDADES PUBLICAS */}
      <section id="necesidades-section" style={{ background: '#fff', padding: '72px 40px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Necesidades activas</h2>
              <p style={{ fontSize: 15, color: 'var(--text-muted)' }}>
                Estas son algunas de las necesidades reportadas en este momento. Inicia sesión para donar.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Donar ahora →
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: 14 }}>
              Cargando necesidades…
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <div>No hay necesidades activas en este momento.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {items.slice(0, 6).map((n) => (
                <div key={n.id} className="card" style={{
                  padding: 24,
                  borderTop: `3px solid ${urgencyColor[n.urgencia] ?? 'var(--border)'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <StatusBadge status={n.estado ?? n.urgencia} />
                    {n.urgencia && (
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        color: urgencyColor[n.urgencia],
                        background: urgencyBg[n.urgencia],
                        padding: '2px 9px', borderRadius: 99,
                      }}>
                        {n.urgencia}
                      </span>
                    )}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, lineHeight: 1.4 }}>
                    {n.descripcion ?? 'Necesidad reportada'}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {n.organizacion ?? '—'}
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: 16, fontSize: 13, width: '100%', justifyContent: 'center' }}
                    onClick={() => navigate('/login')}
                  >
                    Quiero ayudar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{
          maxWidth: 760, margin: '0 auto', textAlign: 'center',
          background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-dark))',
          borderRadius: 28, padding: '60px 40px',
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🌍</div>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            Únete a la comunidad Donaton
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', marginBottom: 36, lineHeight: 1.7 }}>
            Ya sea como donante individual o como organización, tu participación marca la diferencia.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn"
              style={{ background: '#fff', color: 'var(--brand-dark)', fontWeight: 700, padding: '13px 32px', fontSize: 15 }}
              onClick={() => navigate('/registro')}
            >
              Crear cuenta gratuita
            </button>
            <button
              className="btn"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.7)', color: '#fff', padding: '13px 28px', fontSize: 15, backdropFilter: 'blur(4px)' }}
              onClick={() => navigate('/login')}
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: '#0F2D24', color: 'rgba(255,255,255,0.5)',
        padding: '28px 40px', textAlign: 'center', fontSize: 13,
      }}>
        © {new Date().getFullYear()} Donaton · Plataforma de donación solidaria
      </footer>
    </div>
  );
}
