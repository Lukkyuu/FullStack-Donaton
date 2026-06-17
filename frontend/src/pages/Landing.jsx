import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../shared/hooks/useApi.js';
import { necesidadesService } from '../api/services/necesidadesService.js';
import logoUrl from '../assets/logo.png';

const URGENCY_CONFIG = {
  ALTA:  { label: 'Crítico',     chip: 'chip-critical', bar: '#ba1a1a', icon: '🚨' },
  MEDIA: { label: 'Alta prioridad', chip: 'chip-high',  bar: '#F59E0B', icon: '⚡' },
  BAJA:  { label: 'Estándar',    chip: 'chip-normal',   bar: '#1EB980', icon: '🌱' },
};

const STATS = [
  { value: '1,240+', label: 'Donaciones' },
  { value: '48',     label: 'Organizaciones' },
  { value: '98%',    label: 'Entregas' },
  { value: '3',      label: 'Regiones' },
];

const FEATURES = [
  {
    icon: '🤝',
    title: 'Matching inteligente',
    desc: 'Nuestro motor automático une donaciones con necesidades según urgencia, tipo y cercanía geográfica.',
    color: 'rgba(0,49,120,0.08)',
  },
  {
    icon: '📦',
    title: 'Logística centralizada',
    desc: 'Seguimiento del estado de cada donación desde el registro hasta la entrega final.',
    color: 'rgba(30,185,128,0.08)',
  },
  {
    icon: '🔍',
    title: 'Trazabilidad completa',
    desc: 'Reportes detallados y trazabilidad en tiempo real para donantes y organizaciones.',
    color: 'rgba(240,98,146,0.08)',
  },
  {
    icon: '🌱',
    title: 'Impacto medible',
    desc: 'Métricas claras sobre el impacto real de cada donación. Transparencia total.',
    color: 'rgba(0,49,120,0.08)',
  },
];

// Simple intersection observer for scroll animations
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function AnimatedSection({ children, delay = 0, style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : 'translateY(24px)',
      transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

const renderSplitText = (text, startDelay = 0, extraClass = '') => {
  return text.split(' ').map((word, idx) => (
    <span key={idx} className="reveal-word-wrapper">
      <span 
        className={`reveal-word ${extraClass}`}
        style={{ animationDelay: `${startDelay + idx * 0.08}s` }}
      >
        {word}
      </span>
    </span>
  ));
};

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const heroCardRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const blob3Ref = useRef(null);

  const { data: necesidades, loading } = useApi(() => necesidadesService.publicas({ limit: 6 }));
  const items = necesidades?.content ?? necesidades ?? [];

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      
      if (heroCardRef.current) {
        heroCardRef.current.style.transform = `translateY(${y * 0.08}px)`;
      }
      if (blob1Ref.current) {
        blob1Ref.current.style.transform = `translateY(${y * 0.15}px)`;
      }
      if (blob2Ref.current) {
        blob2Ref.current.style.transform = `translateY(${y * -0.1}px) translateX(${y * 0.02}px)`;
      }
      if (blob3Ref.current) {
        blob3Ref.current.style.transform = `translateY(${y * 0.05}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToNeeds = () => {
    document.getElementById('necesidades-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', fontFamily: 'var(--font-sans)' }}>

      {/* ── NAVBAR ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 72,
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(247,250,249,0.7)',
        backdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(0,49,120,0.1)' : '1px solid transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 var(--margin-desktop)',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 20px rgba(13,71,161,0.06)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={logoUrl} alt="Donaton" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%', border: '1.5px solid rgba(0,49,120,0.1)', backgroundColor: 'var(--surface-container-lowest)' }} />
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
            Donaton
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={scrollToNeeds}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, color: 'var(--on-surface-variant)',
              padding: '8px 16px', borderRadius: 'var(--r-md)',
              transition: 'all 0.2s', fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={e => { e.target.style.background = 'var(--surface-container)'; e.target.style.color = 'var(--primary)'; }}
            onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.color = 'var(--on-surface-variant)'; }}
          >
            Necesidades
          </button>
          <button
            className="btn btn-ghost"
            style={{ fontSize: 14 }}
            onClick={() => navigate('/login')}
          >
            Iniciar sesión
          </button>
          <button
            className="btn btn-primary magnetic-btn"
            style={{ fontSize: 14, borderRadius: 'var(--r-lg)' }}
            onClick={() => navigate('/registro')}
          >
            Únete gratis →
          </button>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative', minHeight: '88vh',
        display: 'flex', alignItems: 'center',
        padding: '120px var(--margin-desktop) 80px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #001945 0%, #003178 50%, #0d47a1 100%)',
      }}>
        {/* Background blobs */}
        <div ref={blob1Ref} className="parallax-bg" style={{ position: 'absolute', top: -100, right: -60, width: 600, height: 600, borderRadius: '50%', background: 'rgba(30,185,128,0.12)', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div ref={blob2Ref} className="parallax-bg" style={{ position: 'absolute', bottom: -80, left: -40, width: 400, height: 400, borderRadius: '50%', background: 'rgba(240,98,146,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div ref={blob3Ref} className="parallax-bg" style={{ position: 'absolute', top: '40%', left: '50%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(161,187,255,0.08)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 'var(--container-max)', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          {/* Left */}
          <div style={{ animation: 'fadeInUp 0.7s ease both' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(30,185,128,0.15)', border: '1px solid rgba(30,185,128,0.3)',
              color: '#1EB980', borderRadius: 99, padding: '6px 16px',
              fontSize: 13, fontWeight: 700, marginBottom: 28, letterSpacing: 0.02,
            }}>
              ✅ Plataforma solidaria verificada
            </span>

            <h1 style={{
              fontSize: 52, fontWeight: 800, color: '#fff',
              lineHeight: 1.12, marginBottom: 24, letterSpacing: '-0.02em',
            }}>
              {renderSplitText("Conectamos tu ayuda con", 0)}
              <br />
              {renderSplitText("quienes más la necesitan", 0.32, "reveal-word-gradient")}
            </h1>

            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>
              Donaton une donantes y organizaciones con trazabilidad completa. Cada donación importa, cada entrega se verifica.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}>
              <button
                className="btn btn-teal magnetic-btn"
                style={{ fontSize: 16, padding: '14px 32px', borderRadius: 'var(--r-lg)', fontWeight: 700 }}
                onClick={() => navigate('/registro')}
              >
                Donar ahora →
              </button>
              <button
                className="magnetic-btn"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  fontSize: 15, padding: '14px 28px', borderRadius: 'var(--r-lg)',
                  background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.2)',
                  color: '#fff', cursor: 'pointer', fontWeight: 600,
                  transition: 'background-color 0.2s', fontFamily: 'var(--font-sans)',
                  backdropFilter: 'blur(8px)',
                }}
                onClick={scrollToNeeds}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                Ver necesidades activas
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {STATS.map(s => (
                <div key={s.label} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: '#1EB980', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 3, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Glass card preview */}
          <div ref={heroCardRef} style={{ animation: 'fadeInUp 0.7s ease 0.15s both', transition: 'transform 0.1s ease-out' }}>
            <div style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 24, padding: 32,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Necesidades activas</span>
                <span style={{ background: 'rgba(30,185,128,0.2)', color: '#1EB980', borderRadius: 99, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>En vivo</span>
              </div>

              {/* Mock need cards */}
              {[
                { icon: '🏥', label: 'Suministros médicos', org: 'Cruz Roja Stgo', pct: 72, urgency: 'ALTA' },
                { icon: '📚', label: 'Material educativo', org: 'EduFrontier', pct: 40, urgency: 'MEDIA' },
                { icon: '🌾', label: 'Alimentos básicos', org: 'AgriHope', pct: 88, urgency: 'BAJA' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px 18px',
                  marginBottom: i < 2 ? 12 : 0,
                  border: '1px solid rgba(255,255,255,0.08)',
                  animation: `fadeInUp 0.5s ease ${0.3 + i * 0.12}s both`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{item.label}</div>
                      <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 1 }}>{item.org}</div>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                      background: URGENCY_CONFIG[item.urgency]?.bar + '25',
                      color: URGENCY_CONFIG[item.urgency]?.bar,
                    }}>
                      {URGENCY_CONFIG[item.urgency]?.label}
                    </span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${item.pct}%`, borderRadius: 99,
                      background: `linear-gradient(90deg, #1EB980, #70f8ba)`,
                      transition: 'width 1s ease',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                    <span style={{ fontSize: 11, color: '#1EB980', fontWeight: 700 }}>{item.pct}% financiado</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Ver más →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '96px var(--margin-desktop)', background: 'var(--surface-container-lowest)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          <AnimatedSection style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)', marginBottom: 14, letterSpacing: '-0.01em' }}>
              ¿Por qué Donaton?
            </h2>
            <p style={{ fontSize: 17, color: 'var(--on-surface-variant)', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
              Una plataforma diseñada para que cada gesto de solidaridad tenga el máximo impacto posible.
            </p>
          </AnimatedSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.1}>
                <div
                  className="card"
                  style={{ padding: '32px', display: 'flex', gap: 20, alignItems: 'flex-start', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                >
                  <div style={{
                    width: 54, height: 54, borderRadius: 16,
                    background: f.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26, flexShrink: 0,
                    border: '1px solid rgba(0,49,120,0.08)',
                  }}>
                    {f.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: 'var(--on-surface)' }}>{f.title}</div>
                    <div style={{ fontSize: 14, color: 'var(--on-surface-variant)', lineHeight: 1.65 }}>{f.desc}</div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── NECESIDADES ACTIVAS ── */}
      <section id="necesidades-section" style={{ padding: '96px var(--margin-desktop)', background: 'var(--bg-page)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          <AnimatedSection>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h2 style={{ fontSize: 34, fontWeight: 800, color: 'var(--primary)', marginBottom: 8, letterSpacing: '-0.01em' }}>
                  Necesidades urgentes
                </h2>
                <p style={{ fontSize: 15, color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
                  Solicitudes verificadas que necesitan apoyo logístico inmediato.
                </p>
              </div>
              <button
                className="btn btn-primary"
                style={{ borderRadius: 'var(--r-lg)', fontWeight: 700, fontSize: 14 }}
                onClick={() => navigate('/login')}
              >
                Donar ahora →
              </button>
            </div>
          </AnimatedSection>

          {loading ? (
            <div className="loading-center">
              <div className="spinner" />
              <span style={{ fontSize: 14 }}>Cargando necesidades…</span>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-title">Sin necesidades activas</div>
              <div className="empty-state-desc">No hay necesidades reportadas en este momento.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {items.slice(0, 6).map((n, i) => {
                const urgCfg = URGENCY_CONFIG[n.urgencia] ?? URGENCY_CONFIG['BAJA'];
                const pct = n.porcentajeCubierto ?? Math.round(Math.random() * 80 + 10);
                return (
                  <AnimatedSection key={n.id} delay={i * 0.08}>
                    <article
                      style={{
                        background: 'var(--surface-container-lowest)',
                        borderRadius: 'var(--r-lg)',
                        border: '1px solid var(--outline-variant)',
                        boxShadow: 'var(--shadow-sm)',
                        overflow: 'hidden',
                        display: 'flex', flexDirection: 'column',
                        transition: 'all 0.25s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                    >
                      {/* Top accent */}
                      <div style={{ height: 4, background: urgCfg.bar, borderRadius: '0' }} />

                      <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99,
                            background: urgCfg.bar + '18', color: urgCfg.bar,
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                          }}>
                            {urgCfg.icon} {urgCfg.label}
                          </span>
                          <span style={{ fontSize: 13, color: 'var(--on-surface-variant)', fontWeight: 500 }}>
                            {n.tipoNecesidad ?? 'Donación'}
                          </span>
                        </div>

                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, lineHeight: 1.4, color: 'var(--on-surface)', flex: 1 }}>
                          {n.descripcion ?? 'Necesidad reportada'}
                        </div>

                        {n.organizacion && (
                          <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 5 }}>
                            🏢 {n.organizacion}
                          </div>
                        )}

                        {/* Progress */}
                        <div style={{ marginBottom: 16 }}>
                          <div className="progress-track" style={{ height: 7 }}>
                            <div className="progress-fill" style={{ width: `${pct}%` }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--secondary)' }}>{pct}% cubierto</span>
                            <span style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>
                              {n.diasRestantes ?? '—'} días
                            </span>
                          </div>
                        </div>

                        <button
                          className="btn btn-primary"
                          style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: 13 }}
                          onClick={() => navigate('/login')}
                        >
                          Quiero ayudar →
                        </button>
                      </div>
                    </article>
                  </AnimatedSection>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── IMPACTO BENTO ── */}
      <section style={{ padding: '96px var(--margin-desktop)', background: 'var(--surface-container-lowest)', borderTop: '1px solid var(--outline-variant)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          <AnimatedSection style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: 'var(--primary)', marginBottom: 12, letterSpacing: '-0.01em' }}>
              Transparencia medible
            </h2>
            <p style={{ fontSize: 16, color: 'var(--on-surface-variant)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              Cada contribución es rastreada a través de nuestra red logística para garantizar el máximo impacto.
            </p>
          </AnimatedSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
            {/* Large block */}
            <AnimatedSection style={{ gridColumn: 'span 8' }}>
              <div className="card" style={{
                padding: '40px 48px', position: 'relative', overflow: 'hidden',
                background: 'var(--surface-container-lowest)',
              }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'rgba(0,49,120,0.04)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span style={{ fontSize: 36, marginBottom: 12, display: 'block' }}>🌍</span>
                  <div style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginBottom: 8, fontWeight: 600 }}>Total de valor entregado</div>
                  <div style={{ fontSize: 68, fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>$2.4M</div>
                  <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginTop: 12, maxWidth: 400, lineHeight: 1.6 }}>
                    En 42 países, apoyando directamente a socios institucionales verificados con cero gastos opacos.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Small stat */}
            <AnimatedSection delay={0.1} style={{ gridColumn: 'span 4' }}>
              <div style={{
                background: 'var(--primary)', borderRadius: 'var(--r-lg)', padding: '36px 32px',
                height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                boxShadow: '0 8px 30px rgba(0,49,120,0.3)',
              }}>
                <span style={{ fontSize: 28, marginBottom: 12, display: 'block' }}>🚚</span>
                <div>
                  <div style={{ fontSize: 52, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.03em' }}>247</div>
                  <div style={{ fontSize: 15, color: 'rgba(161,187,255,0.9)', marginTop: 6, fontWeight: 600 }}>Envíos activos</div>
                </div>
              </div>
            </AnimatedSection>

            {/* NGO partners */}
            <AnimatedSection delay={0.15} style={{ gridColumn: 'span 4' }}>
              <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <span style={{ fontSize: 28, display: 'block', marginBottom: 10 }}>🤝</span>
                <div>
                  <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--primary)', lineHeight: 1, letterSpacing: '-0.03em' }}>48+</div>
                  <div style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginTop: 6, fontWeight: 600 }}>Organizaciones verificadas</div>
                </div>
              </div>
            </AnimatedSection>

            {/* Corporate matching */}
            <AnimatedSection delay={0.2} style={{ gridColumn: 'span 8' }}>
              <div className="card" style={{ padding: '32px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 20, color: 'var(--primary)', marginBottom: 8 }}>Matching corporativo disponible</h3>
                  <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', lineHeight: 1.6, marginBottom: 20, maxWidth: 400 }}>
                    Multiplica tu impacto. Más de 200 empresas usan Donaton para gestionar sus programas de donación.
                  </p>
                  <button className="btn btn-secondary magnetic-btn" style={{ borderRadius: 'var(--r-lg)', fontWeight: 700 }} onClick={() => navigate('/registro')}>
                    Registrar organización →
                  </button>
                </div>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%',
                  border: '8px solid var(--outline-variant)',
                  position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '8px solid var(--vibrant-teal)', clipPath: 'inset(0 50% 0 0)' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>98%</div>
                    <div style={{ fontSize: 10, color: 'var(--on-surface-variant)', fontWeight: 600, letterSpacing: '0.05em' }}>matching</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: '96px var(--margin-desktop)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <AnimatedSection>
            <div style={{
              background: 'linear-gradient(135deg, #001945 0%, #003178 60%, #0d47a1 100%)',
              borderRadius: 28, padding: '72px 56px', textAlign: 'center',
              position: 'relative', overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,49,120,0.3)',
            }}>
              <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(30,185,128,0.1)', filter: 'blur(60px)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 48, marginBottom: 20 }}>🌍</div>
                <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 14, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  Únete a la comunidad Donaton
                </h2>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.72)', marginBottom: 40, lineHeight: 1.7 }}>
                  Ya sea como donante individual o como organización, tu participación marca la diferencia.
                </p>
                <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-teal magnetic-btn"
                    style={{ fontSize: 16, padding: '14px 36px', borderRadius: 'var(--r-lg)', fontWeight: 700 }}
                    onClick={() => navigate('/registro')}
                  >
                    Crear cuenta gratuita
                  </button>
                  <button
                    className="magnetic-btn"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      fontSize: 15, padding: '14px 28px', borderRadius: 'var(--r-lg)',
                      background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.22)',
                      color: '#fff', cursor: 'pointer', fontWeight: 600,
                      transition: 'background-color 0.2s', fontFamily: 'var(--font-sans)',
                    }}
                    onClick={() => navigate('/login')}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  >
                    Iniciar sesión
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: 'var(--surface-container-lowest)',
        borderTop: '1px solid var(--outline-variant)',
        padding: '40px var(--margin-desktop)',
      }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <img src={logoUrl} alt="Donaton" style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: '50%', border: '1px solid rgba(0,49,120,0.1)', backgroundColor: 'var(--surface-container-lowest)' }} />
              <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--primary)', letterSpacing: '-0.01em' }}>Donaton</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', lineHeight: 1.65 }}>
              Confianza institucional combinada con logística moderna. Una plataforma diseñada para impacto seguro y transparente.
            </p>
          </div>

          {[
            { title: 'Plataforma', links: ['Sobre nosotros', 'Cómo funciona', 'Soluciones corporativas'] },
            { title: 'Legal', links: ['Política de privacidad', 'Términos de servicio', 'Transparencia'] },
            { title: 'Soporte', links: ['Centro de ayuda', 'Contacto', 'Ser socio'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>{col.title}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.links.map(link => (
                  <a key={link} href="#"
                    style={{ fontSize: 13, color: 'var(--on-surface-variant)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                    onMouseLeave={e => e.target.style.color = 'var(--on-surface-variant)'}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          maxWidth: 'var(--container-max)', margin: '32px auto 0', paddingTop: 24,
          borderTop: '1px solid var(--outline-variant)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8,
        }}>
          <p style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>
            © {new Date().getFullYear()} Donaton Platform · DuocUC DSY1106
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {['🌐', '🔒'].map((icon, i) => (
              <a key={i} href="#" style={{ color: 'var(--outline)', textDecoration: 'none', fontSize: 18, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--outline)'}
              >{icon}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
