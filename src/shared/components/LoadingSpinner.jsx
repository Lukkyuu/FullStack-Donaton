export default function LoadingSpinner({ text = 'Cargando...' }) {
  return (
    <div className="loading-center">
      <div className="spinner" />
      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{text}</span>
    </div>
  );
}
