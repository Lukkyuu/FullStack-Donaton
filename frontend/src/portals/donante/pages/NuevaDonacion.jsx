import { useNavigate, useLocation } from 'react-router-dom';

export default function NuevaDonacion() {
  const navigate = useNavigate();
  const location = useLocation();
  const necesidad = location.state?.necesidad;

  return (
    <div style={{ maxWidth: 680, margin: '40px auto' }}>
      <div className="page-header" style={{ textAlign: 'center', marginBottom: 30 }}>
        <h1 className="page-title" style={{ fontSize: 26 }}>💝 Donaciones Directas</h1>
        <p className="page-subtitle">Aviso importante para nuestros donantes</p>
      </div>

      <div className="card" style={{ padding: '36px 40px', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-md)', textAlign: 'center', borderTop: '4px solid var(--brand-primary)' }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>📢</div>
        
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>
          ¡Tu ayuda es directa y eficiente!
        </h3>

        {necesidad ? (
          <div style={{ 
            background: 'var(--bg-page)', 
            padding: '20px 24px', 
            borderRadius: 'var(--r-md)', 
            textAlign: 'left', 
            marginBottom: 24, 
            borderLeft: '4px solid var(--brand-primary)' 
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
              Apoyo seleccionado:
            </h4>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong>Organización:</strong> {necesidad.organizacion ?? 'Organización asociada'} <br />
              <strong>Necesidad:</strong> {necesidad.descripcion} <br />
              {necesidad.tipoNecesidad && (
                <><strong>Categoría:</strong> <span className="badge badge-blue" style={{ fontSize: 11, marginLeft: 4 }}>{necesidad.tipoNecesidad}</span> <br /></>
              )}
              {necesidad.zona && (
                <><strong>Ubicación/Zona:</strong> 📍 {necesidad.zona} <br /></>
              )}
              {necesidad.cantidadRequerida && (
                <><strong>Cantidad Requerida:</strong> {necesidad.cantidadRequerida} {necesidad.unidad ?? ''}</>
              )}
            </div>
          </div>
        ) : null}
        
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, marginBottom: 28, padding: '0 10px' }}>
          Actualmente, <strong>no se requiere registrar las donaciones en un formulario</strong>. 
          Queremos que el proceso sea lo más ágil posible y directo.
          <br /><br />
          {necesidad ? (
            <>
              Para concretar tu donación para esta necesidad, por favor ponte en contacto directamente con la organización <strong>{necesidad.organizacion ?? 'asociada'}</strong> para coordinar la entrega o envío del aporte de forma directa.
            </>
          ) : (
            <>
              Para colaborar, por favor explora la sección de <strong>Necesidades activas</strong> reportadas en tiempo real por las organizaciones. Allí podrás seleccionar la necesidad que mejor se adapte a tu intención de ayuda y coordinar la entrega o retiro directamente.
            </>
          )}
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/donante/necesidades')} style={{ padding: '10px 24px', fontSize: 14 }}>
            📋 Ver necesidades activas
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/donante')} style={{ padding: '10px 24px', fontSize: 14 }}>
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}
