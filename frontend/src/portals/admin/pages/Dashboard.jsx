import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../auth/useAuth.js';
import { useApi } from '../../../shared/hooks/useApi.js';
import { donacionesService }  from '../../../api/services/donacionesService.js';
import { necesidadesService } from '../../../api/services/necesidadesService.js';
import { logisticaService }   from '../../../api/services/logisticaService.js';
import { matchingService }    from '../../../api/services/matchingService.js';
import { useNavigate } from 'react-router-dom';
import {
  LoadingSpinner, DegradedBanner, ErrorBox, StatusBadge,
} from '../../../shared/components/index.jsx';

function AnimatedNumber({ value, duration = 900 }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const end = Number(value) || 0;
    const start = prev.current;
    if (start === end) return;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(start + (end - start) * ease));
      if (p < 1) requestAnimationFrame(tick);
      else prev.current = end;
    };
    requestAnimationFrame(tick);
  }, [value, duration]);
  return <>{display}</>;
}

function StatCard({ icon, label, value, sub, accent, delay = 0 }) {
  return (
    <div
      className="stat-card hover-lift"
      style={{
        borderTop: `3px solid ${accent ?? 'var(--primary)'}`,
        animation: `fadeInUp 0.45s ease ${delay}s both`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: -12, right: -12,
        width: 56, height: 56, borderRadius: '50%',
        background: (accent ?? 'var(--primary)') + '15', pointerEvents: 'none',
      }} />
      <div style={{ fontSize: 24, marginBottom: 8, position: 'relative' }}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: accent ?? 'var(--primary)', position: 'relative' }}>
        <AnimatedNumber value={value ?? 0} />
      </div>
      {sub && <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 4, fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}


export default function AdminHome() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'monitoring'

  const { data: donData,  loading: l1, error: e1, degraded: d1 } = useApi(() => donacionesService.listar({ limit: 5 }));
  const { data: necData,  loading: l2, error: e2, degraded: d2 } = useApi(() => necesidadesService.listar({ limit: 5 }));
  const { data: logData,  loading: l3, error: e3, degraded: d3 } = useApi(() => logisticaService.listarRecursos({ limit: 3 }));
  const { data: matData,  loading: l4, error: e4, degraded: d4 } = useApi(() => matchingService.listarResultados({ limit: 5 }));

  const donaciones  = donData?.content  ?? donData  ?? [];
  const necesidades = necData?.content  ?? necData  ?? [];
  const recursos    = logData?.content  ?? logData  ?? [];
  const matchings   = matData?.content  ?? matData  ?? [];
  const degraded = d1 || d2 || d3 || d4;

  const anyError = e1 || e2 || e3 || e4;

  // ─── MONITOREO STATE ───
  const [services, setServices] = useState([
    { id: 1, name: 'ms-gateway (API Gateway)', host: 'donaton-ms-gateway', port: 8080, status: 'UP', latency: 14, cpu: 1.1, mem: 164, maxMem: 512, db: 'N/A' },
    { id: 2, name: 'ms-auth (Autenticación & JWT)', host: 'donaton-ms-auth', port: 8081, status: 'UP', latency: 19, cpu: 0.7, mem: 232, maxMem: 512, db: 'CONECTADO' },
    { id: 3, name: 'ms-donacion (Gestión de Donaciones)', host: 'donaton-ms-donacion', port: 8082, status: 'UP', latency: 25, cpu: 2.3, mem: 289, maxMem: 512, db: 'CONECTADO' },
    { id: 4, name: 'ms-logistica (Inventario & Rutas)', host: 'donaton-ms-logistica', port: 8083, status: 'UP', latency: 16, cpu: 1.4, mem: 201, maxMem: 512, db: 'CONECTADO' },
    { id: 5, name: 'ms-necesidad (Requerimientos)', host: 'donaton-ms-necesidad', port: 8084, status: 'UP', latency: 28, cpu: 1.9, mem: 248, maxMem: 512, db: 'CONECTADO' },
    { id: 6, name: 'ms-matching (Motor de Cruces)', host: 'donaton-ms-matching', port: 8085, status: 'UP', latency: 48, cpu: 3.5, mem: 312, maxMem: 512, db: 'CONECTADO' },
    { id: 7, name: 'ms-notificaciones (Alertas & Email)', host: 'donaton-ms-notificaciones', port: 8087, status: 'UP', latency: 15, cpu: 0.5, mem: 178, maxMem: 512, db: 'CONECTADO' },
    { id: 8, name: 'ms-usuarios (Gestor de Perfiles)', host: 'donaton-ms-usuarios', port: 8086, status: 'UP', latency: 11, cpu: 0.4, mem: 152, maxMem: 512, db: 'CONECTADO' },
  ]);

  const [logs, setLogs] = useState([
    { id: 1, time: '19:56:32', service: 'ms-auth', method: 'POST', path: '/api/auth/register', status: 201, latency: 95, message: 'Usuario registrado exitosamente: carlos.valenzuela@gmail.com' },
    { id: 2, time: '19:56:33', service: 'ms-notificaciones', method: 'MAIL', path: 'SMTP', status: 200, latency: 140, message: 'Correo de bienvenida enviado a carlos.valenzuela@gmail.com (cuenta creada con éxito)' },
    { id: 3, time: '19:55:18', service: 'ms-donacion', method: 'POST', path: '/api/donaciones', status: 201, latency: 112, message: 'Donación de alimentos no perecibles creada, DonanteID: #512' },
    { id: 4, time: '19:55:20', service: 'ms-matching', method: 'GET', path: '/api/matching/resultados', status: 200, latency: 235, message: 'Matching exitoso: Donación #512 ↔ Necesidad #87 (Score: 98%)' },
    { id: 5, time: '19:54:12', service: 'ms-logistica', method: 'PUT', path: '/api/logistica/recursos/5', status: 200, latency: 48, message: 'Inventario actualizado: ms-logistica agregó 80 botiquines de primeros auxilios' },
    { id: 6, time: '19:53:05', service: 'ms-auth', method: 'POST', path: '/api/auth/login', status: 200, latency: 45, message: 'Token JWT generado con éxito para: admin@donaton.cl' }
  ]);

  const [isPaused, setIsPaused] = useState(false);

  // Simulación de métricas en tiempo real
  useEffect(() => {
    if (activeTab !== 'monitoring' || isPaused) return;

    const interval = setInterval(() => {
      // 1. Simular métricas de servicios
      setServices(prev => prev.map(s => {
        const dLat = (Math.random() - 0.5) * 6; // +/- 3ms
        const dCpu = (Math.random() - 0.5) * 0.8; // +/- 0.4%
        const dMem = (Math.random() - 0.5) * 6; // +/- 3MB
        return {
          ...s,
          latency: Math.max(4, Math.round(s.latency + dLat)),
          cpu: Math.max(0.1, Math.min(99, Number((s.cpu + dCpu).toFixed(1)))),
          mem: Math.max(50, Math.min(s.maxMem - 10, Math.round(s.mem + dMem))),
        };
      }));

      // 2. Insertar logs simulados de operaciones
      const logTemplates = [
        { service: 'ms-auth', method: 'POST', path: '/api/auth/login', status: 200, message: 'Autenticación exitosa de usuario' },
        { service: 'ms-auth', method: 'POST', path: '/api/auth/register', status: 201, message: 'Nueva cuenta de donante registrada' },
        { service: 'ms-notificaciones', method: 'MAIL', path: 'SMTP', status: 200, message: 'Correo enviado a nuevo usuario: cuenta creada con éxito' },
        { service: 'ms-donacion', method: 'POST', path: '/api/donaciones', status: 201, message: 'Registro de donación de ropa invernal' },
        { service: 'ms-necesidad', method: 'POST', path: '/api/necesidades', status: 201, message: 'Nueva necesidad cargada por Hogar de Cristo' },
        { service: 'ms-matching', method: 'GET', path: '/api/matching/resultados', status: 200, message: 'Recálculo automático de scoring completado' },
        { service: 'ms-logistica', method: 'POST', path: '/api/logistica/distribuciones', status: 201, message: 'Ruta de envío asignada al conductor #3' },
        { service: 'ms-usuarios', method: 'PUT', path: '/usuarios/perfil', status: 200, message: 'Datos de perfil actualizados' },
        { service: 'ms-gateway', method: 'GET', path: '/api/auth/me', status: 200, message: 'Verificación de sesión JWT válida' }
      ];

      const chosen = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      setLogs(prev => [
        {
          id: Date.now(),
          time: timeStr,
          service: chosen.service,
          method: chosen.method,
          path: chosen.path,
          status: chosen.status,
          latency: Math.floor(Math.random() * 90) + 12,
          message: chosen.message
        },
        ...prev.slice(0, 14) // max 15 logs
      ]);

    }, 3000);

    return () => clearInterval(interval);
  }, [activeTab, isPaused]);

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <h1 className="page-title">
            {role === 'ADMIN' ? '🛡 Panel de Administración' : '🏢 Panel de Organización'}
          </h1>
          <p className="page-subtitle">Visión general y estado en tiempo real de Donaton</p>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', background: 'var(--border)', borderRadius: 10, padding: 3, gap: 2 }}>
          <button
            onClick={() => setActiveTab('general')}
            style={{
              padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: activeTab === 'general' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'general' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: activeTab === 'general' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            📊 Resumen General
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            style={{
              padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: activeTab === 'monitoring' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'monitoring' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: activeTab === 'monitoring' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            🖥 Monitoreo del Sistema
          </button>
        </div>
      </div>

      <DegradedBanner show={degraded} />
      {anyError && activeTab === 'general' && (
        <ErrorBox message="Algunos módulos no pudieron cargarse. Mostrando datos disponibles." />
      )}

      {/* Tab: Resumen General */}
      {activeTab === 'general' && (
        <>
          {/* Stats */}
          <div className="stats-grid">
            <StatCard icon="💝" label="Donaciones"          value={donaciones.length}  sub="últimas registradas"  accent="var(--brand-primary)" />
            <StatCard icon="📋" label="Necesidades activas" value={necesidades.length} sub="en terreno"            accent="var(--accent-amber)" />
            <StatCard icon="📦" label="Recursos logísticos" value={recursos.length}    sub="en inventario"         accent="var(--accent-blue)" />
            <StatCard icon="🔗" label="Matchings realizados" value={matchings.length}  sub="cruces completados"    accent="#5DCAA5" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Últimas donaciones */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>Últimas donaciones</h3>
                <button className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 10px' }}
                  onClick={() => navigate('/admin/matching')}>Ver matching</button>
              </div>
              {l1 ? <LoadingSpinner text="Cargando..." /> : donaciones.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '16px 0' }}>Sin datos disponibles.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {donaciones.slice(0, 5).map((d) => (
                    <div key={d.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '9px 12px', background: 'var(--bg-page)', borderRadius: 'var(--r-md)', fontSize: 13,
                    }}>
                      <div>
                        <div style={{ fontWeight: 500 }}>{d.tipoDonacion ?? 'Donación'}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>#{d.id} · {d.donante ?? '—'}</div>
                      </div>
                      <StatusBadge status={d.estado} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Necesidades recientes */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>Necesidades recientes</h3>
                <button className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 10px' }}
                  onClick={() => navigate('/admin/necesidades')}>Ver todas</button>
              </div>
              {l2 ? <LoadingSpinner text="Cargando..." /> : necesidades.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '16px 0' }}>Sin datos disponibles.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {necesidades.slice(0, 5).map((n) => (
                    <div key={n.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '9px 12px', background: 'var(--bg-page)', borderRadius: 'var(--r-md)', fontSize: 13,
                      borderLeft: `3px solid ${n.urgencia === 'ALTA' ? '#A32D2D' : n.urgencia === 'MEDIA' ? '#EF9F27' : '#5DCAA5'}`,
                    }}>
                      <div>
                        <div style={{ fontWeight: 500 }}>{n.descripcion?.slice(0, 36) ?? '—'}{n.descripcion?.length > 36 ? '…' : ''}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{n.organizacion ?? '—'}</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: n.urgencia === 'ALTA' ? '#A32D2D' : 'var(--text-secondary)' }}>
                        {n.urgencia}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Matchings recientes */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>Matchings recientes</h3>
                <button className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 10px' }}
                  onClick={() => navigate('/admin/matching')}>Ver panel</button>
              </div>
              {l4 ? <LoadingSpinner text="Cargando..." /> : matchings.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '16px 0' }}>Sin matchings aún.</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Donación</th><th>Necesidad</th><th>Estrategia</th><th>Score</th></tr></thead>
                    <tbody>
                      {matchings.slice(0, 5).map((m) => (
                        <tr key={m.id}>
                          <td>#{m.donacionId}</td>
                          <td>#{m.necesidadId}</td>
                          <td><span className="badge badge-blue" style={{ fontSize: 11 }}>{m.estrategia ?? '—'}</span></td>
                          <td style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>{m.score ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recursos logísticos */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>Inventario logístico</h3>
                <button className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 10px' }}
                  onClick={() => navigate('/admin/logistica')}>Gestionar</button>
              </div>
              {l3 ? <LoadingSpinner text="Cargando..." /> : recursos.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '16px 0' }}>Sin recursos registrados.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {recursos.slice(0, 4).map((r) => (
                    <div key={r.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '9px 12px', background: 'var(--bg-page)', borderRadius: 'var(--r-md)', fontSize: 13,
                    }}>
                      <span style={{ fontWeight: 500 }}>{r.nombre ?? r.tipo ?? 'Recurso'}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{r.cantidad} {r.unidad ?? ''}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Tab: Monitoreo del Sistema */}
      {activeTab === 'monitoring' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Fila superior: Tabla de Microservicios */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>🖥 Estado de Microservicios</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  Servicios y contenedores en la red bridge de Donaton
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} className="pulse-green-led" />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Todos los sistemas operativos</span>
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Microservicio</th>
                    <th>Puerto</th>
                    <th>Estado</th>
                    <th>Latencia</th>
                    <th>RAM Asignada</th>
                    <th>Uso CPU</th>
                    <th>Base de Datos</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600 }}>
                        <span style={{ color: 'var(--brand-primary)', marginRight: 6 }}>⚙</span>
                        {s.name}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{s.port}</td>
                      <td>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '3px 8px', borderRadius: 99, background: '#D2F4E8', color: '#1B6A54',
                          fontSize: 11, fontWeight: 600
                        }}>
                          <span style={{
                            width: 6, height: 6, borderRadius: '50%', background: '#10B981',
                            display: 'inline-block'
                          }} className="pulse-green-led" />
                          {s.status}
                        </span>
                      </td>
                      <td style={{ color: s.latency > 35 ? 'var(--accent-amber)' : 'var(--brand-primary)', fontWeight: 600 }}>
                        {s.latency} ms
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
                            <div style={{
                              height: '100%',
                              width: `${(s.mem / s.maxMem) * 100}%`,
                              background: s.mem > 300 ? 'var(--accent-coral)' : 'var(--brand-primary)',
                              borderRadius: 3
                            }} />
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                            {s.mem}MB / {s.maxMem}MB
                          </span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 500, color: s.cpu > 3 ? 'var(--accent-amber)' : 'var(--text-primary)' }}>
                        {s.cpu}%
                      </td>
                      <td>
                        {s.db === 'CONECTADO' ? (
                          <span className="badge badge-green" style={{ fontSize: 10, padding: '2px 7px' }}>🟢 {s.db}</span>
                        ) : (
                          <span className="badge badge-gray" style={{ fontSize: 10, padding: '2px 7px' }}>{s.db}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fila inferior: Tabla de Request / Audit Logs */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>📋 Registro de Eventos del Sistema (Live Logs)</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  Trazabilidad e historial de peticiones HTTP en tiempo real
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="btn btn-secondary"
                  style={{ fontSize: 12, padding: '6px 12px' }}
                >
                  {isPaused ? '▶ Reanudar Monitoreo' : '⏸ Pausar Monitoreo'}
                </button>
                <button
                  onClick={() => setLogs([])}
                  className="btn btn-danger"
                  style={{ fontSize: 12, padding: '6px 12px' }}
                >
                  🗑 Limpiar Logs
                </button>
              </div>
            </div>

            <div className="table-wrap" style={{ maxHeight: 400, overflowY: 'auto' }}>
              {logs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: 14 }}>Sin logs en este momento.</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: 90 }}>Hora</th>
                      <th style={{ width: 130 }}>Microservicio</th>
                      <th style={{ width: 80 }}>Método</th>
                      <th style={{ width: 180 }}>Ruta/Canal</th>
                      <th style={{ width: 90 }}>HTTP/Status</th>
                      <th style={{ width: 90 }}>Latencia</th>
                      <th>Mensaje / Operación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(log => (
                      <tr key={log.id} style={{ animation: 'fadeIn 0.3s ease' }}>
                        <td style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                          {log.time}
                        </td>
                        <td>
                          <span style={{
                            padding: '2px 7px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                            background: log.service === 'ms-auth' ? '#EEEDFE' : log.service === 'ms-donacion' ? '#E1F5EE' : log.service === 'ms-logistica' ? '#E6F1FB' : '#F1EFE8',
                            color: log.service === 'ms-auth' ? '#3C3489' : log.service === 'ms-donacion' ? '#0F6E56' : log.service === 'ms-logistica' ? '#185FA5' : '#5F5E5A',
                          }}>
                            {log.service}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700 }}>
                          <span style={{
                            color: log.method === 'POST' ? 'var(--brand-primary)' : log.method === 'GET' ? 'var(--accent-blue)' : log.method === 'MAIL' ? 'var(--accent-amber)' : 'var(--text-secondary)'
                          }}>
                            {log.method}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                          {log.path}
                        </td>
                        <td>
                          <span className={`badge ${log.status >= 200 && log.status < 300 ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 11, padding: '2px 6px' }}>
                            {log.status}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                          {log.latency} ms
                        </td>
                        <td style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                          {log.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
