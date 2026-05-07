/* ── LoadingSpinner ── */
export function LoadingSpinner({ text = 'Cargando...' }) {
  return (
    <div className="loading-center">
      <div className="spinner" />
      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{text}</span>
    </div>
  );
}

/* ── DegradedBanner ── */
export function DegradedBanner({ show }) {
  if (!show) return null;
  return (
    <div className="degraded-banner">
      <span style={{ fontSize: 16 }}>⚠</span>
      <span>
        Mostrando datos cacheados — algunos valores pueden no estar al día.
        El sistema se está recuperando automáticamente.
      </span>
    </div>
  );
}

/* ── ErrorBox ── */
export function ErrorBox({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="error-box">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span>⚠ {message}</span>
        {onRetry && (
          <button className="btn btn-secondary" style={{ fontSize: 13, padding: '5px 12px' }} onClick={onRetry}>
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}

/* ── EmptyState ── */
export function EmptyState({ icon = '📭', title = 'Sin resultados', description = '', action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <div className="empty-state-title">{title}</div>
      {description && <p className="empty-state-desc">{description}</p>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

/* ── Modal ── */
export function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

/* ── StatusBadge ── */
const STATUS_MAP = {
  PENDIENTE:   'badge-amber',
  ACTIVO:      'badge-green',
  ACTIVA:      'badge-green',
  COMPLETADO:  'badge-blue',
  COMPLETADA:  'badge-blue',
  CANCELADO:   'badge-red',
  CANCELADA:   'badge-red',
  CERRADA:     'badge-gray',
  EN_TRANSITO: 'badge-coral',
  ENTREGADO:   'badge-green',
};

export function StatusBadge({ status }) {
  const cls = STATUS_MAP[status?.toUpperCase()] ?? 'badge-gray';
  return <span className={`badge ${cls}`}>{status}</span>;
}

/* ── Topbar ── */
export function Topbar({ title, role, userName }) {
  const roleClass = `topbar-role-badge tag-role-${role}`;
  return (
    <header className="topbar">
      <div className="topbar-left">
        <span style={{ fontWeight: 600, fontSize: 15 }}>{title}</span>
      </div>
      <div className="topbar-right">
        <button className="notif-btn">
          🔔
          <span className="notif-dot" />
        </button>
        <span className="topbar-user">{userName}</span>
        <span className={roleClass}>{role}</span>
      </div>
    </header>
  );
}


