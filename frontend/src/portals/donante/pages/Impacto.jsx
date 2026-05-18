import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/useAuth.js';
import { useApi } from '../../../shared/hooks/useApi.js';
import { donacionesService } from '../../../api/services/donacionesService.js';
import { LoadingSpinner } from '../../../shared/components/index.jsx';

const CATEGORIAS_ICON = {
  ROPA: '👕', ALIMENTOS: '🥫', MEDICAMENTOS: '💊', JUGUETES: '🧸',
  TECNOLOGIA: '💻', MUEBLES: '🛋️', OTROS: '📦',
};

export default function Impacto() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: donaciones, loading } = useApi(() => donacionesService.listar({ limit: 100 }));
  const items = donaciones?.content ?? donaciones ?? [];

  const completadas  = items.filter(d => ['COMPLETADO','ENTREGADO'].includes(d.estado));
  const totalDon     = items.length;
  const entregadas   = completadas.length;
  const tasa         = totalDon > 0 ? Math.round((entregadas / totalDon) * 100) : 0;

  // Agrupar por categoría
  const porCategoria = items.reduce((acc, d) => {
    const cat = d.tipoDonacion ?? 'OTROS';
    acc[cat] = (acc[cat] ?? 0) + 1;
    return acc;
  }, {});

  // Mes con más donaciones
  const porMes = items.reduce((acc, d) => {
    if (!d.fechaCreacion) return acc;
    const key = new Date(d.fechaCreacion).toLocaleDateString('es-CL', { month: 'short', year: 'numeric' });
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const mesTop = Object.entries(porMes).sort((a,b) => b[1]-a[1])[0];

  if (loading) return <LoadingSpinner text="Calculando tu impacto..." />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🌱 Mi impacto</h1>
        <p className="page-subtitle">Así de grande ha sido tu contribución a la comunidad</p>
      </div>

      {/* Hero stats */}
      <div style={{
        background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-dark))',
        borderRadius: 20, padding: '32px 36px', marginBottom: 24, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute',top:-40,right:-40,width:200,height:200,borderRadius:'50%',background:'rgba(255,255,255,0.05)' }} />
        <div style={{ color:'rgba(255,255,255,0.7)', fontSize:13, fontWeight:500, marginBottom:8 }}>
          Hola, {user?.nombre ?? 'donante'} 👋
        </div>
        <div style={{ fontSize:28, fontWeight:800, color:'#fff', marginBottom:6 }}>
          Has realizado {totalDon} {totalDon === 1 ? 'donación' : 'donaciones'}
        </div>
        <div style={{ fontSize:15, color:'rgba(255,255,255,0.75)' }}>
          {entregadas > 0
            ? `${entregadas} ${entregadas === 1 ? 'llegó' : 'llegaron'} exitosamente a destino — ¡gracias por tu generosidad!`
            : 'Tus donaciones están en proceso. ¡Sigue contribuyendo!'}
        </div>
      </div>

      {/* Tarjetas de métricas */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { icon: '💝', label: 'Total donaciones', value: totalDon },
          { icon: '✅', label: 'Entregadas',        value: entregadas },
          { icon: '📊', label: 'Tasa de éxito',     value: `${tasa}%` },
          { icon: '📅', label: 'Mes más activo',    value: mesTop?.[0] ?? '—' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: 22 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Distribución por categoría */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>📦 Tipos de donación</h3>
          {Object.keys(porCategoria).length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>
              Aún no tienes donaciones registradas.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.entries(porCategoria)
                .sort((a,b) => b[1]-a[1])
                .map(([cat, count]) => {
                  const pct = Math.round((count / totalDon) * 100);
                  return (
                    <div key={cat}>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:4 }}>
                        <span>{CATEGORIAS_ICON[cat] ?? '📦'} {cat}</span>
                        <span style={{ fontWeight:600 }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ height:6, borderRadius:99, background:'var(--bg-page)', overflow:'hidden' }}>
                        <div style={{ width:`${pct}%`, height:'100%', borderRadius:99, background:'var(--brand-primary)', transition:'width 0.6s ease' }} />
                      </div>
                    </div>
                  );
              })}
            </div>
          )}
        </div>

        {/* Actividad por mes */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>📅 Actividad mensual</h3>
          {Object.keys(porMes).length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>
              Sin actividad registrada aún.
            </p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {Object.entries(porMes)
                .sort((a,b) => new Date(b[0]) - new Date(a[0]))
                .slice(0, 6)
                .map(([mes, count]) => {
                  const maxVal = Math.max(...Object.values(porMes));
                  const pct = Math.round((count / maxVal) * 100);
                  return (
                    <div key={mes} style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <span style={{ fontSize:12, color:'var(--text-muted)', width:80, flexShrink:0 }}>{mes}</span>
                      <div style={{ flex:1, height:6, borderRadius:99, background:'var(--bg-page)', overflow:'hidden' }}>
                        <div style={{ width:`${pct}%`, height:'100%', borderRadius:99, background:'var(--brand-mid)', transition:'width 0.6s ease' }} />
                      </div>
                      <span style={{ fontSize:12, fontWeight:600, width:20, textAlign:'right' }}>{count}</span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        marginTop: 24, padding: '22px 28px', borderRadius: 16,
        background: '#E1F5EE', border: '1px solid #B2E5D4',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#085041', marginBottom: 4 }}>
            🌍 ¡Cada donación cuenta!
          </div>
          <div style={{ fontSize: 13, color: '#0F6E56' }}>
            Tu generosidad ha impactado a familias reales. ¿Listo para donar de nuevo?
          </div>
        </div>
        <button
          className="btn btn-primary"
          style={{ whiteSpace: 'nowrap' }}
          onClick={() => navigate('/donante/nueva-donacion')}
        >
          Donar ahora →
        </button>
      </div>
    </div>
  );
}
