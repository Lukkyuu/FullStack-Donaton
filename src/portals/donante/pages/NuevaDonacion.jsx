import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { donacionesService } from '../../../api/services/donacionesService.js';
import { ErrorBox } from '../../../shared/components/index.jsx';

const TIPOS = [
  { value: 'ALIMENTO', label: '🥫 Alimento' },
  { value: 'ROPA',     label: '👕 Ropa' },
  { value: 'MEDICINA', label: '💊 Medicina' },
  { value: 'DINERO',   label: '💵 Dinero' },
  { value: 'OTRO',     label: '📦 Otro' },
];

const INITIAL = {
  tipoDonacion:   '',
  descripcion:    '',
  cantidad:       '',
  unidad:         '',
  zona:           '',
  necesidadId:    '',
};

export default function NuevaDonacion() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [form, setForm]       = useState({
    ...INITIAL,
    necesidadId: location.state?.necesidadId ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        tipoDonacion: form.tipoDonacion,
        descripcion:  form.descripcion,
        cantidad:     form.cantidad ? Number(form.cantidad) : undefined,
        unidad:       form.unidad || undefined,
        zona:         form.zona   || undefined,
        necesidadId:  form.necesidadId ? Number(form.necesidadId) : undefined,
      };
      await donacionesService.crear(payload);
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message ?? 'No se pudo registrar la donación. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ maxWidth: 520, margin: '60px auto', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>¡Donación registrada!</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
          Tu donación fue registrada correctamente. El sistema de matching la asignará
          automáticamente a una necesidad compatible.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/donante/mis-donaciones')}>
            Ver mis donaciones
          </button>
          <button className="btn btn-secondary" onClick={() => { setSuccess(false); setForm(INITIAL); }}>
            Hacer otra donación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Nueva donación</h1>
        <p className="page-subtitle">
          Registra tu donación. El sistema de matching la conectará con la necesidad más adecuada.
        </p>
      </div>

      <div className="card" style={{ maxWidth: 580, padding: 32 }}>
        <ErrorBox message={error} />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Tipo de donación */}
          <div className="form-group">
            <label className="form-label" htmlFor="tipoDonacion">Tipo de donación *</label>
            <select
              id="tipoDonacion"
              name="tipoDonacion"
              className="form-input form-select"
              required
              value={form.tipoDonacion}
              onChange={handleChange}
            >
              <option value="">Selecciona un tipo</option>
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label className="form-label" htmlFor="descripcion">Descripción *</label>
            <textarea
              id="descripcion"
              name="descripcion"
              className="form-input"
              required
              rows={3}
              placeholder="Describe lo que donas (ej: 10 cajas de fideos, frazadas en buen estado…)"
              value={form.descripcion}
              onChange={handleChange}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Cantidad y unidad */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="cantidad">Cantidad</label>
              <input
                id="cantidad"
                name="cantidad"
                type="number"
                min="1"
                className="form-input"
                placeholder="Ej: 10"
                value={form.cantidad}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="unidad">Unidad</label>
              <input
                id="unidad"
                name="unidad"
                type="text"
                className="form-input"
                placeholder="Ej: kg, unidades, cajas"
                value={form.unidad}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Zona */}
          <div className="form-group">
            <label className="form-label" htmlFor="zona">Zona o dirección de retiro</label>
            <input
              id="zona"
              name="zona"
              type="text"
              className="form-input"
              placeholder="Ej: Concepción centro, Las Condes…"
              value={form.zona}
              onChange={handleChange}
            />
          </div>

          {/* Necesidad vinculada (opcional) */}
          <div className="form-group">
            <label className="form-label" htmlFor="necesidadId">
              ID de necesidad vinculada{' '}
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>
                (opcional — el matching lo asigna automáticamente)
              </span>
            </label>
            <input
              id="necesidadId"
              name="necesidadId"
              type="number"
              className="form-input"
              placeholder="Ej: 42"
              value={form.necesidadId}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? 'Registrando…' : 'Registrar donación'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
