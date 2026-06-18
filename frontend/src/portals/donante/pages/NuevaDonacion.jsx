import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { donacionesService } from '../../../api/services/donacionesService.js';
import { ErrorBox } from '../../../shared/components/index.jsx';

export default function NuevaDonacion() {
  const navigate = useNavigate();
  const location = useLocation();
  const necesidad = location.state?.necesidad;

  const getInitialTipoDonacion = () => {
    if (!necesidad?.tipoNecesidad) return 'OTRO';
    const t = necesidad.tipoNecesidad.toUpperCase();
    if (['ALIMENTO', 'ROPA', 'MEDICINA', 'DINERO'].includes(t)) return t;
    return 'OTRO';
  };

  const [formData, setFormData] = useState({
    tipoDonacion: getInitialTipoDonacion(),
    cantidad: necesidad?.cantidadRequerida || '',
    unidad: necesidad?.unidad || '',
    descripcion: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const payload = {
        ...formData,
        cantidad: Number(formData.cantidad),
        necesidadId: necesidad?.id || null,
        categoria: necesidad?.tipoNecesidad || null,
        zona: necesidad?.zona || null
      };
      
      await donacionesService.crear(payload);
      navigate('/donante/mis-donaciones', { state: { message: 'Donación registrada exitosamente.' } });
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Ocurrió un error al registrar la donación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: '40px auto' }}>
      <div className="page-header" style={{ textAlign: 'center', marginBottom: 30 }}>
        <h1 className="page-title" style={{ fontSize: 26 }}>💝 Registrar Donación</h1>
        <p className="page-subtitle">Aporta de manera directa y eficiente</p>
      </div>

      <div className="card" style={{ padding: '36px 40px', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--brand-primary)' }}>
        {necesidad && (
          <div style={{ 
            background: 'var(--bg-page)', 
            padding: '20px 24px', 
            borderRadius: 'var(--r-md)', 
            textAlign: 'left', 
            marginBottom: 24, 
            borderLeft: '4px solid var(--brand-primary)' 
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
              Apoyando a:
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
            </div>
          </div>
        )}
        
        {error && <ErrorBox message={error} />}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          <div>
            <label className="form-label">Tipo de Donación</label>
            <select 
              className="form-input form-select" 
              name="tipoDonacion" 
              value={formData.tipoDonacion} 
              onChange={handleChange}
              required
            >
              <option value="ALIMENTO">🥫 Alimento</option>
              <option value="ROPA">👕 Ropa</option>
              <option value="MEDICINA">💊 Medicina</option>
              <option value="DINERO">💵 Dinero</option>
              <option value="OTRO">📦 Otro</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Cantidad</label>
              <input 
                type="number" 
                className="form-input" 
                name="cantidad" 
                value={formData.cantidad} 
                onChange={handleChange}
                placeholder="Ej: 10"
                min="1"
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">Unidad (Opcional)</label>
              <input 
                type="text" 
                className="form-input" 
                name="unidad" 
                value={formData.unidad} 
                onChange={handleChange}
                placeholder="Ej: kg, litros"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Descripción o Comentarios</label>
            <textarea 
              className="form-input" 
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleChange}
              placeholder="Añade detalles sobre tu donación..."
              rows="3"
            />
          </div>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '10px 24px', fontSize: 14 }}>
              {loading ? 'Enviando...' : '💝 Enviar Donación'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/donante')} style={{ padding: '10px 24px', fontSize: 14 }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
