import { useNavigate } from 'react-router-dom';
import { useApi } from '../../../shared/hooks/useApi.js';
import { matchingService } from '../../../api/services/matchingService.js';
import {
  LoadingSpinner, DegradedBanner, ErrorBox, EmptyState,
} from '../../../shared/components/index.jsx';

const ESTRATEGIA_INFO = {
  CercaniaStrategy:       { label: 'Cercanía',        color: '#185FA5', bg: '#E6F1FB', icon: '📍' },
  UrgenciaStrategy:       { label: 'Urgencia',         color: '#A32D2D', bg: '#FCEBEB', icon: '🚨' },
  TipoNecesidadStrategy:  { label: 'Tipo de necesidad',color: '#0F6E56', bg: '#E1F5EE', icon: '🏷' },
};

function ScoreBar({ score }) {
  const pct = Math.min(100, Math.max(0, (score ?? 0) * 100));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 6, borderRadius: 99, background: 'var(--bg-page)', overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: 99,
          background: pct > 70 ? 'var(--brand-primary)' : pct > 40 ? 'var(--accent-amber)' : '#D85A30',
          transition: 'width 0.4s ease',
        }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', minWidth: 34 }}>
        {score != null ? (score * 100).toFixed(0) + '%' : '—'}
      </span>
    </div>
  );
}

export default function MatchingPanel() {
  const navigate = useNavigate();
  const { data, loading, error, degraded, refetch } = useApi(
    () => matchingService.listarResultados()
  );

  const matchings = data?.content ?? data ?? [];

  // Estadísticas por estrategia
  const byStrategy = matchings.reduce((acc, m) => {
    const k = m.estrategia ?? 'Desconocida';
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Panel de Matching</h1>
        <p className="page-subtitle">
          Resultados del motor de matching automático — donaciones ↔ necesidades
        </p>
      </div>

      <DegradedBanner show={degraded} />
      <ErrorBox message={error} onRetry={refetch} />

      {/* Info de estrategias */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        {Object.entries(ESTRATEGIA_INFO).map(([key, info]) => (
          <div key={key} className="card" style={{ padding: 18, borderTop: `3px solid ${info.color}` }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{info.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: info.color, marginBottom: 4 }}>{info.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{byStrategy[key] ?? 0}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>matchings con esta estrategia</div>
          </div>
        ))}
      </div>

      {/* Tabla de resultados */}
      <div className="card">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>Resultados de matching</h3>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{matchings.length} registros</span>
        </div>

        {loading ? <LoadingSpinner text="Cargando matchings..." /> :
         matchings.length === 0 ? (
           <EmptyState
             icon="🔗"
             title="Sin matchings aún"
             description="El motor de matching se activa automáticamente al publicarse donaciones o necesidades en el Service Bus."
           />
         ) : (
           <div className="table-wrap">
             <table>
               <thead>
                 <tr>
                   <th>ID</th>
                   <th>Donación</th>
                   <th>Necesidad</th>
                   <th>Estrategia</th>
                   <th style={{ minWidth: 160 }}>Score</th>
                   <th>Fecha</th>
                 </tr>
               </thead>
               <tbody>
                 {matchings.map((m) => {
                   const info = ESTRATEGIA_INFO[m.estrategia];
                   return (
                      <tr
                        key={m.id}
                        onClick={() => navigate(`matching/${m.id}`)}
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-page)'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}
                      >
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                          #{m.id}
                        </td>
                       <td>
                         <span style={{ fontWeight: 500 }}>#{m.donacionId}</span>
                       </td>
                       <td>
                         <span style={{ fontWeight: 500 }}>#{m.necesidadId}</span>
                       </td>
                       <td>
                         {info ? (
                           <span style={{
                             display: 'inline-flex', alignItems: 'center', gap: 5,
                             fontSize: 12, fontWeight: 500,
                             color: info.color, background: info.bg,
                             padding: '3px 10px', borderRadius: 99,
                           }}>
                             {info.icon} {info.label}
                           </span>
                         ) : (
                           <span className="badge badge-gray">{m.estrategia ?? '—'}</span>
                         )}
                       </td>
                       <td style={{ minWidth: 160 }}>
                         <ScoreBar score={m.score} />
                       </td>
                       <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                         {m.fechaMatching
                           ? new Date(m.fechaMatching).toLocaleDateString('es-CL')
                           : '—'}
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
         )}
      </div>

      {/* Nota arquitectónica */}
      <div style={{
        marginTop: 20, padding: '16px 20px',
        background: 'var(--brand-light)',
        border: '1px solid #B2E5D4',
        borderRadius: 'var(--r-md)',
        fontSize: 13, color: 'var(--brand-dark)', lineHeight: 1.6,
      }}>
        <strong>¿Cómo funciona el matching?</strong><br />
        Al publicarse un <code>NecesidadReportadaEvent</code> o <code>DonacionRegistradaEvent</code> en el
        Azure Service Bus, <strong>ms-matching</strong> suscribe y ejecuta la estrategia más apropiada
        (Cercanía, Urgencia o TipoNecesidad) mediante el patrón <em>Strategy + Factory Method</em>.
        Los resultados se persisten en <code>db_donaton_matching</code> para trazabilidad y auditoría.
      </div>
    </div>
  );
}
